---
id: TEST-001
title: Init creates .lore structure
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
related_stories:
  - STORY-001
related_tests: []
---

# TEST-001 - Init creates .lore structure

## Purpose

Verify that Lore satisfies the linked requirements and user stories.

## Test Steps

1. Run `lore init` in an empty temporary directory.
2. Verify `.lore/` exists.
3. Verify expected child directories exist.
4. Verify no root-level artifact directories are created.

## Expected Result

The behavior matches the linked requirements and no unexpected files, services or dependencies are introduced.
