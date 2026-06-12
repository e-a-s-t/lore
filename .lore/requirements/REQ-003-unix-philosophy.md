---
id: REQ-003
title: Unix Philosophy
status: Draft
related_requirements: []
related_adrs:
  - ADR-003
related_stories:
  - STORY-001
  - STORY-002
  - STORY-003
  - STORY-004
  - STORY-005
related_tests:
  - TEST-001
  - TEST-002
  - TEST-004
  - TEST-005
---

# REQ - Unix Philosophy

## Requirement

Lore SHALL provide small, composable commands that do one thing clearly.

## Rationale

Lore should feel like a Unix-style developer tool, not a platform.

## Acceptance Criteria

- [ ] Commands are scriptable.
- [ ] Commands write useful output to stdout.
- [ ] Commands fail with non-zero exit codes on validation errors.
