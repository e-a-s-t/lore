---
id: REQ-005
title: Single Directory
status: Draft
related_requirements: []
related_adrs:
  - ADR-002
related_stories:
  - STORY-001
related_tests:
  - TEST-001
---

# REQ - Single Directory

## Requirement

Lore SHALL store all project knowledge under `.lore/`.

## Rationale

A project should not be cluttered with multiple root-level documentation directories.

## Acceptance Criteria

- [ ] `lore init` creates `.lore/`.
- [ ] Lore does not create `requirements/`, `adrs/`, `stories/` or `tests/` in the repository root.
