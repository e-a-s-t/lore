use std::{collections::HashMap, fs, path::PathBuf};

use thiserror::Error;

use crate::{
    artifacts::{
        Artifact, RelationField, artifact_kind, load_artifacts, load_artifacts_unsorted,
        relation_field_for_kind, relation_ids_mut, render_artifact_markdown,
    },
    repository::{LoreError, Repository},
};

#[derive(Debug, Error)]
pub enum ValidationError {
    #[error("missing required field `{field}` in {path}")]
    MissingField { path: PathBuf, field: &'static str },
    #[error("duplicate artifact id `{id}` in {first} and {second}")]
    DuplicateId {
        id: String,
        first: PathBuf,
        second: PathBuf,
    },
    #[error("unknown reference `{id}` in {path} ({field})")]
    UnknownReference {
        path: PathBuf,
        field: &'static str,
        id: String,
    },
    #[error("mismatched relationship `{id}` in {path} ({field} -> {expected_field})")]
    RelationshipMismatch {
        path: PathBuf,
        field: &'static str,
        expected_field: &'static str,
        id: String,
    },
}

pub fn validate_repository(repository: &Repository) -> Result<Vec<ValidationError>, LoreError> {
    let artifacts = load_artifacts(repository)?;
    Ok(validate_artifacts(&artifacts))
}

pub fn repair_relationships(repository: &Repository) -> Result<bool, LoreError> {
    let artifacts = load_artifacts_unsorted(repository)?;
    let mut changed = false;

    let known: HashMap<&str, &Artifact> = artifacts
        .iter()
        .filter(|artifact| !artifact.meta.id.trim().is_empty())
        .map(|artifact| (artifact.meta.id.as_str(), artifact))
        .collect();

    for artifact in &artifacts {
        let mut meta = artifact.meta.clone();
        let original = meta.clone();

        for field in relation_fields() {
            relation_ids_mut(&mut meta, field).clear();
        }

        for field in relation_fields() {
            let ids = relation_ids(&original, field);
            for id in ids {
                let destination = known
                    .get(id.as_str())
                    .and_then(|artifact| artifact_kind(artifact))
                    .map(relation_field_for_kind)
                    .unwrap_or(field);
                let bucket = relation_ids_mut(&mut meta, destination);
                if !bucket.iter().any(|existing| existing == id) {
                    bucket.push(id.clone());
                }
            }
        }

        if relation_views(&meta) != relation_views(&original) {
            fs::write(
                &artifact.path,
                render_artifact_markdown(
                    artifact_kind(&artifact).expect("known artifact kind"),
                    &meta,
                    &artifact.body,
                ),
            )
            .map_err(|source| LoreError::Io {
                path: artifact.path.clone(),
                source,
            })?;
            changed = true;
        }
    }

    Ok(changed)
}

fn validate_artifacts(artifacts: &[Artifact]) -> Vec<ValidationError> {
    let mut errors = Vec::new();
    let mut ids: HashMap<&str, &PathBuf> = HashMap::new();

    for artifact in artifacts {
        if artifact.meta.id.trim().is_empty() {
            errors.push(ValidationError::MissingField {
                path: artifact.path.clone(),
                field: "id",
            });
        }
        if artifact.meta.title.trim().is_empty() {
            errors.push(ValidationError::MissingField {
                path: artifact.path.clone(),
                field: "title",
            });
        }
        if !artifact.meta.id.trim().is_empty() {
            if let Some(first) = ids.insert(&artifact.meta.id, &artifact.path) {
                errors.push(ValidationError::DuplicateId {
                    id: artifact.meta.id.clone(),
                    first: first.clone(),
                    second: artifact.path.clone(),
                });
            }
        }
    }

    let known: HashMap<&str, &Artifact> = artifacts
        .iter()
        .filter(|artifact| !artifact.meta.id.trim().is_empty())
        .map(|artifact| (artifact.meta.id.as_str(), artifact))
        .collect();

    for artifact in artifacts {
        for (field, ids) in relation_views(&artifact.meta) {
            for id in ids {
                let Some(referenced) = known.get(id.as_str()) else {
                    errors.push(ValidationError::UnknownReference {
                        path: artifact.path.clone(),
                        field: field.label(),
                        id: id.clone(),
                    });
                    continue;
                };

                let Some(referenced_kind) = artifact_kind(referenced) else {
                    continue;
                };
                let expected_field = relation_field_for_kind(referenced_kind);
                if expected_field != field {
                    errors.push(ValidationError::RelationshipMismatch {
                        path: artifact.path.clone(),
                        field: field.label(),
                        expected_field: expected_field.label(),
                        id: id.clone(),
                    });
                }
            }
        }
    }

    errors.sort_by(|a, b| format!("{a}").cmp(&format!("{b}")));
    errors
}

fn relation_fields() -> [RelationField; 5] {
    [
        RelationField::Requirements,
        RelationField::Features,
        RelationField::Adrs,
        RelationField::Stories,
        RelationField::Tests,
    ]
}

fn relation_views<'a>(
    meta: &'a crate::artifacts::Frontmatter,
) -> [(RelationField, &'a Vec<String>); 5] {
    [
        (RelationField::Requirements, &meta.related_requirements),
        (RelationField::Features, &meta.related_features),
        (RelationField::Adrs, &meta.related_adrs),
        (RelationField::Stories, &meta.related_stories),
        (RelationField::Tests, &meta.related_tests),
    ]
}

fn relation_ids<'a>(
    meta: &'a crate::artifacts::Frontmatter,
    field: RelationField,
) -> &'a Vec<String> {
    match field {
        RelationField::Requirements => &meta.related_requirements,
        RelationField::Features => &meta.related_features,
        RelationField::Adrs => &meta.related_adrs,
        RelationField::Stories => &meta.related_stories,
        RelationField::Tests => &meta.related_tests,
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    use std::{
        fs,
        time::{SystemTime, UNIX_EPOCH},
    };

    fn temp_repo() -> Repository {
        let root = std::env::temp_dir().join(format!(
            "lore-core-validate-{}",
            SystemTime::now()
                .duration_since(UNIX_EPOCH)
                .unwrap()
                .as_nanos()
        ));
        fs::create_dir_all(root.join(".lore")).unwrap();
        Repository {
            root: root.clone(),
            lore_dir: root.join(".lore"),
        }
    }

    fn write_artifact(repo: &Repository, folder: &str, name: &str, yaml: &str) {
        let dir = repo.lore_dir.join(folder);
        fs::create_dir_all(&dir).unwrap();
        fs::write(dir.join(name), format!("---\n{}\n---\nbody\n", yaml)).unwrap();
    }

    #[test]
    fn valid_repository_has_no_errors() {
        let repo = temp_repo();
        write_artifact(
            &repo,
            "features",
            "feature.md",
            "id: FEATURE-001\ntitle: Browser\nrelated_requirements: [REQ-001]",
        );
        write_artifact(
            &repo,
            "requirements",
            "req.md",
            "id: REQ-001\ntitle: Load\n",
        );

        let errors = validate_repository(&repo).unwrap();
        assert!(errors.is_empty());
    }

    #[test]
    fn detects_missing_required_fields() {
        let repo = temp_repo();
        write_artifact(&repo, "features", "feature.md", "id: FEATURE-001\n");

        let errors = validate_repository(&repo).unwrap();
        assert!(
            errors
                .iter()
                .any(|error| matches!(error, ValidationError::MissingField { field: "title", .. }))
        );
    }

    #[test]
    fn detects_duplicate_ids() {
        let repo = temp_repo();
        write_artifact(&repo, "features", "one.md", "id: FEATURE-001\ntitle: One\n");
        write_artifact(&repo, "features", "two.md", "id: FEATURE-001\ntitle: Two\n");

        let errors = validate_repository(&repo).unwrap();
        assert!(errors.iter().any(
            |error| matches!(error, ValidationError::DuplicateId { id, .. } if id == "FEATURE-001")
        ));
    }

    #[test]
    fn detects_unknown_references() {
        let repo = temp_repo();
        write_artifact(
            &repo,
            "features",
            "feature.md",
            "id: FEATURE-001\ntitle: Browser\nrelated_requirements: [REQ-999]",
        );

        let errors = validate_repository(&repo).unwrap();
        assert!(errors.iter().any(
            |error| matches!(error, ValidationError::UnknownReference { id, .. } if id == "REQ-999")
        ));
    }

    #[test]
    fn detects_mismatched_relationships_generically() {
        let repo = temp_repo();
        write_artifact(
            &repo,
            "requirements",
            "req.md",
            "id: REQ-001\ntitle: Requirement\nrelated_requirements: [FEATURE-001, TEST-001]",
        );
        write_artifact(
            &repo,
            "features",
            "feature.md",
            "id: FEATURE-001\ntitle: Feature\n",
        );
        write_artifact(&repo, "tests", "test.md", "id: TEST-001\ntitle: Test\n");

        let errors = validate_repository(&repo).unwrap();
        assert!(errors.iter().any(|error| matches!(
            error,
            ValidationError::RelationshipMismatch {
                id,
                field,
                expected_field,
                ..
            } if id == "FEATURE-001"
                && *field == "related_requirements"
                && *expected_field == "related_features"
        )));
        assert!(errors.iter().any(|error| matches!(
            error,
            ValidationError::RelationshipMismatch {
                id,
                field,
                expected_field,
                ..
            } if id == "TEST-001"
                && *field == "related_requirements"
                && *expected_field == "related_tests"
        )));
    }

    #[test]
    fn repairs_relationship_mismatches_idempotently() {
        let repo = temp_repo();
        write_artifact(
            &repo,
            "requirements",
            "req.md",
            "id: REQ-001\ntitle: Requirement\nrelated_requirements: [REQ-002, FEATURE-001, TEST-001]\nrelated_features: [FEATURE-001]\n",
        );
        write_artifact(
            &repo,
            "requirements",
            "req2.md",
            "id: REQ-002\ntitle: Another requirement\n",
        );
        write_artifact(
            &repo,
            "features",
            "feature.md",
            "id: FEATURE-001\ntitle: Feature\n",
        );
        write_artifact(&repo, "tests", "test.md", "id: TEST-001\ntitle: Test\n");

        assert!(repair_relationships(&repo).unwrap());
        let first = fs::read_to_string(repo.lore_dir.join("requirements/req.md")).unwrap();
        assert!(
            first.contains("related_requirements:\n  - REQ-002"),
            "{first}"
        );
        assert!(
            first.contains("related_features:\n  - FEATURE-001"),
            "{first}"
        );
        assert!(first.contains("related_tests:\n  - TEST-001"), "{first}");
        assert!(
            !first.contains("related_requirements:\n  - FEATURE-001"),
            "{first}"
        );

        assert!(!repair_relationships(&repo).unwrap());
        let second = fs::read_to_string(repo.lore_dir.join("requirements/req.md")).unwrap();
        assert_eq!(first, second);
    }
}
