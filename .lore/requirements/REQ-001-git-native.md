---
id: REQ-001
title: Git Native
status: Draft
related_requirements: []
related_adrs:
  - ADR-001
  - ADR-002
related_stories:
  - STORY-001
  - STORY-006
related_tests:
  - TEST-001
  - TEST-003
---

# REQ - Git Native

## Requirement

Lore SHALL use files in a Git repository as its primary storage mechanism and SHALL NOT require a database.

## Rationale

Context should live with the code, travel with the repository, and be reviewable in pull requests.

## Acceptance Criteria

- [ ] No external database is required.
- [ ] All artifacts are stored as files.
- [ ] Artifacts can be reviewed using pull requests.
- [ ] The repository remains readable without Lore installed.
