use crate::artifacts::{load_lore, Artifact};
use anyhow::Result;
use std::path::PathBuf;

#[derive(Debug)]
pub struct App {
    pub root: PathBuf,
    pub artifacts: Vec<Artifact>,
    pub selected: usize,
    history: Vec<usize>,
    pub should_quit: bool,
    pub message: String,
}

impl App {
    pub fn new(root: PathBuf) -> Result<Self> {
        let artifacts = load_lore(&root)?;
        let message = if artifacts.is_empty() {
            "No .lore artifacts found. Run inside a Lore repo.".to_string()
        } else {
            format!("Loaded {} artifacts", artifacts.len())
        };

        Ok(Self {
            root,
            artifacts,
            selected: 0,
            history: Vec::new(),
            should_quit: false,
            message,
        })
    }

    pub fn reload(&mut self) -> Result<()> {
        let previous_id = self
            .selected_artifact()
            .map(|artifact| artifact.meta.id.clone());
        self.artifacts = load_lore(&self.root)?;

        self.selected = previous_id
            .as_deref()
            .and_then(|id| {
                self.artifacts
                    .iter()
                    .position(|artifact| artifact.meta.id == id)
            })
            .unwrap_or(0);

        self.history.retain(|index| *index < self.artifacts.len());
        self.message = if self.artifacts.is_empty() {
            "No .lore artifacts found. Run inside a Lore repo.".to_string()
        } else {
            format!("Loaded {} artifacts", self.artifacts.len())
        };

        Ok(())
    }

    pub fn selected_artifact(&self) -> Option<&Artifact> {
        self.artifacts.get(self.selected)
    }

    pub fn next(&mut self) {
        let features = self.feature_indexes();
        if features.is_empty() {
            return;
        }

        let current = features
            .iter()
            .position(|index| *index == self.selected)
            .unwrap_or(0);
        self.selected = features[(current + 1).min(features.len() - 1)];
    }

    pub fn previous(&mut self) {
        let features = self.feature_indexes();
        if features.is_empty() {
            return;
        }

        let current = features
            .iter()
            .position(|index| *index == self.selected)
            .unwrap_or(0);
        self.selected = features[current.saturating_sub(1)];
    }

    pub fn open_related(&mut self) {
        let Some(current) = self.selected_artifact() else {
            return;
        };

        if let Some(target) = current
            .relation_groups()
            .into_iter()
            .flat_map(|(_, ids)| ids)
            .find_map(|id| {
                self.artifacts
                    .iter()
                    .position(|artifact| artifact.meta.id == id)
            })
        {
            self.history.push(self.selected);
            self.selected = target;
        }
    }

    pub fn back(&mut self) {
        if let Some(previous) = self.history.pop() {
            self.selected = previous;
        }
    }

    fn feature_indexes(&self) -> Vec<usize> {
        self.artifacts
            .iter()
            .enumerate()
            .filter_map(|(index, artifact)| artifact.is_feature().then_some(index))
            .collect()
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    use crate::artifacts::{Artifact, Frontmatter};
    use std::{
        fs,
        time::{SystemTime, UNIX_EPOCH},
    };

    fn temp_repo() -> PathBuf {
        let root = std::env::temp_dir().join(format!(
            "lore-tui-test-{}",
            SystemTime::now()
                .duration_since(UNIX_EPOCH)
                .unwrap()
                .as_nanos()
        ));
        fs::create_dir_all(root.join(".lore")).unwrap();
        root
    }

    fn write_artifact(root: &PathBuf, name: &str, yaml: &str, body: &str) {
        fs::write(
            root.join(".lore").join(name),
            format!("---\n{}\n---\n{}\n", yaml, body),
        )
        .unwrap();
    }

    fn artifact(id: &str, title: &str, related_features: Vec<&str>) -> Artifact {
        Artifact {
            meta: Frontmatter {
                id: id.into(),
                title: title.into(),
                related_features: related_features.into_iter().map(Into::into).collect(),
                ..Default::default()
            },
            body: String::new(),
        }
    }

    #[test]
    fn keyboard_navigation_moves_only_between_features() {
        let mut app = App {
            root: PathBuf::new(),
            artifacts: vec![
                artifact("REQ-001", "Load", vec![]),
                artifact("FEATURE-001", "Browser", vec![]),
                artifact("ADR-001", "Binary", vec![]),
                artifact("FEATURE-002", "Reload", vec![]),
            ],
            selected: 1,
            history: Vec::new(),
            should_quit: false,
            message: String::new(),
        };

        app.next();
        assert_eq!(app.selected, 3);
        app.previous();
        assert_eq!(app.selected, 1);
    }

    #[test]
    fn open_related_and_back_restore_selection() {
        let mut app = App {
            root: PathBuf::new(),
            artifacts: vec![
                artifact("FEATURE-001", "Browser", vec!["REQ-001"]),
                artifact("REQ-001", "Load", vec![]),
            ],
            selected: 0,
            history: Vec::new(),
            should_quit: false,
            message: String::new(),
        };

        app.open_related();
        assert_eq!(app.selected, 1);
        app.back();
        assert_eq!(app.selected, 0);
    }

    #[test]
    fn reload_restores_selection_when_artifact_still_exists() {
        let root = temp_repo();
        write_artifact(
            &root,
            "feature.md",
            "id: FEATURE-001\ntitle: Browser",
            "Body",
        );
        write_artifact(&root, "req.md", "id: REQ-001\ntitle: Load", "Body");

        let mut app = App::new(root.clone()).unwrap();
        app.selected = 1;
        app.reload().unwrap();

        assert_eq!(app.selected_artifact().unwrap().meta.id, "REQ-001");
    }

    #[test]
    fn reload_falls_back_when_selected_artifact_disappears() {
        let root = temp_repo();
        write_artifact(
            &root,
            "feature.md",
            "id: FEATURE-001\ntitle: Browser",
            "Body",
        );
        write_artifact(&root, "req.md", "id: REQ-001\ntitle: Load", "Body");

        let mut app = App::new(root.clone()).unwrap();
        app.selected = 1;
        fs::remove_file(root.join(".lore").join("req.md")).unwrap();
        app.reload().unwrap();

        assert_eq!(app.selected_artifact().unwrap().meta.id, "FEATURE-001");
    }

    #[test]
    fn empty_and_missing_states_are_reported() {
        let root = temp_repo();
        let app = App::new(root.clone()).unwrap();
        assert_eq!(app.artifacts.len(), 0);
        assert!(app.message.contains("No .lore artifacts found"));

        fs::remove_dir_all(root.join(".lore")).unwrap();
        let app = App::new(root).unwrap();
        assert_eq!(app.artifacts.len(), 0);
        assert!(app.message.contains("No .lore artifacts found"));
    }
}
