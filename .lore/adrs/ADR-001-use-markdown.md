---
id: ADR-001
title: Use Markdown as the primary artifact format
status: Draft
related_requirements:
  - REQ-001
  - REQ-004
  - REQ-005
  - REQ-011
related_adrs: []
related_stories:
  - STORY-002
related_tests:
  - TEST-002
---

# ADR-001 - Use Markdown as the primary artifact format

## Context

Lore needs a storage format for requirements, user stories, ADRs and test cases. The format must be human-readable, Git-friendly, local-first and useful as AI context.

## Decision

Lore will use Markdown files with YAML frontmatter as the primary artifact format.

## Consequences

Positive: readable, reviewable, editable, Git-native and AI-friendly. Negative: frontmatter must be validated and large repositories may eventually need indexing.

## Alternatives Considered

- JSON files only
- YAML files only
- SQLite database
- External systems such as Jira, Azure DevOps or ServiceNow
- Plain Markdown without frontmatter
