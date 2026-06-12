---
id: REQ-015
title: Zero Magic
status: Draft
related_requirements: []
related_adrs:
  - ADR-003
related_stories:
  - STORY-001
  - STORY-002
  - STORY-005
related_tests:
  - TEST-001
  - TEST-002
  - TEST-005
---

# REQ - Zero Magic

## Requirement

Lore SHALL prioritize explicit files and predictable behavior over hidden automation.

## Rationale

Developers should understand what Lore does by reading the files it creates.

## Acceptance Criteria

- [ ] Lore prefers Markdown, YAML, Git and CLI.
- [ ] Lore avoids mandatory databases, background daemons and proprietary workflows.
- [ ] Generated files are deterministic where possible.
