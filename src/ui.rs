use crate::app::App;
use ratatui::{
    layout::{Constraint, Direction, Layout, Rect},
    style::{Modifier, Style},
    text::{Line, Span},
    widgets::{Block, Borders, List, ListItem, Paragraph, Wrap},
    Frame,
};

pub fn draw(frame: &mut Frame, app: &App) {
    let root = Layout::default()
        .direction(Direction::Vertical)
        .constraints([Constraint::Min(3), Constraint::Length(3)])
        .split(frame.area());

    let columns = Layout::default()
        .direction(Direction::Horizontal)
        .constraints([
            Constraint::Percentage(30),
            Constraint::Percentage(30),
            Constraint::Percentage(40),
        ])
        .split(root[0]);

    draw_artifacts(frame, app, columns[0]);
    draw_relations(frame, app, columns[1]);
    draw_preview(frame, app, columns[2]);
    draw_status(frame, app, root[1]);
}

fn draw_artifacts(frame: &mut Frame, app: &App, area: Rect) {
    let features = app
        .artifacts
        .iter()
        .enumerate()
        .filter(|(_, artifact)| artifact.is_feature());
    let items: Vec<ListItem> = features
        .map(|(index, artifact)| {
            let line = if index == app.selected {
                Line::from(vec![Span::styled(
                    artifact.label(),
                    Style::default().add_modifier(Modifier::BOLD),
                )])
            } else {
                Line::from(artifact.label())
            };
            ListItem::new(line)
        })
        .collect();

    let list = List::new(items).block(Block::default().title("Features").borders(Borders::ALL));
    frame.render_widget(list, area);
}

fn draw_relations(frame: &mut Frame, app: &App, area: Rect) {
    let mut items = Vec::new();
    if let Some(artifact) = app.selected_artifact() {
        for (group, ids) in artifact.relation_groups() {
            items.push(ListItem::new(Line::from(Span::styled(
                group,
                Style::default().add_modifier(Modifier::BOLD),
            ))));
            for id in ids {
                items.push(ListItem::new(format!("  {id}")));
            }
        }
    }

    if items.is_empty() {
        items.push(ListItem::new("No relations"));
    }

    let list = List::new(items).block(Block::default().title("Related").borders(Borders::ALL));
    frame.render_widget(list, area);
}

fn draw_preview(frame: &mut Frame, app: &App, area: Rect) {
    let text = match app.selected_artifact() {
        Some(artifact) => format!(
            "{}\n{}\nStatus: {}\n\n{}",
            artifact.meta.id, artifact.meta.title, artifact.meta.status, artifact.body
        ),
        None => "No artifact selected".to_string(),
    };

    let paragraph = Paragraph::new(text)
        .block(Block::default().title("Preview").borders(Borders::ALL))
        .wrap(Wrap { trim: false });

    frame.render_widget(paragraph, area);
}

fn draw_status(frame: &mut Frame, app: &App, area: Rect) {
    let status = format!(
        " q/Esc quit | ↑/↓ or j/k navigate | Enter open | b back | v validate | cwd: {} | {} ",
        app.root.display(),
        app.message
    );

    let paragraph =
        Paragraph::new(status).block(Block::default().title("Status").borders(Borders::ALL));
    frame.render_widget(paragraph, area);
}
