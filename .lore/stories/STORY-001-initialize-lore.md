---
id: STORY-001
title: Initialize Lore in a repository
status: Draft
related_requirements:
  - REQ-001
  - REQ-002
  - REQ-003
  - REQ-005
  - REQ-012
  - REQ-013
  - REQ-015
related_adrs:
  - ADR-002
  - ADR-003
related_stories: []
related_tests:
  - TEST-001
---

# STORY-001 - Initialize Lore in a repository

## Story

As a developer, I want to initialize Lore in a repository so that I can start storing project knowledge under `.lore/`.

## Acceptance Criteria

- [ ] Given an empty directory, when I run `lore init`, then `.lore/` is created.
- [ ] The command creates requirements, stories, adrs, tests and templates directories.
- [ ] The command does not create root-level artifact directories.
