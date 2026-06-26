---
id: FEATURE-008
title: Change status of an Artifact
status: Draft
related_features: []
related_requirements:
  - REQ-019
  - REQ-020
  - REQ-021
  - REQ-022
related_adrs:
  - ADR-009
  - ADR-010
  - ADR-011
related_stories:
  - STORY-010
related_tests:
  - TEST-022
  - TEST-023
  - TEST-024
  - TEST-025
  - TEST-026
  - TEST-027
---

# FEATURE-008 - Change status of an Artifact

## Feature

Lore shall allow changing the status field of an existing artifact from the CLI.
The command shall update only the artifact frontmatter and preserve the body content.

Initial command:

```bash 
lore status <ARTIFACT_ID> <STATUS> 
```

Example:

```bash 
lore status FEATURE-008 Proposed lore status REQ-019 Accepted 
```

## Scope

- Find artifact by ID using repository discovery.
- Validate that the artifact exists.
- Validate that the requested status is allowed.
- Update the status field in frontmatter.
- Preserve all other frontmatter fields.
- Preserve markdown body content.
- Print deterministic output.

## Non-goals

- TUI editing.
- Bulk status changes.
- Status workflow rules.
- Approval gates.
- Git commits.
- Interactive prompts.
