---
id: TEST-004
title: Import CSV creates requirement files
status: Draft
related_requirements:
  - REQ-003
  - REQ-006
related_adrs:
  - ADR-004
related_stories:
  - STORY-004
related_tests: []
---

# TEST-004 - Import CSV creates requirement files

## Purpose

Verify that Lore satisfies the linked requirements and user stories.

## Test Steps

1. Prepare a CSV with id,title,description,status.
2. Run `lore import requirements requirements.csv`.
3. Verify one Markdown file is created per row.
4. Verify frontmatter contains imported metadata.

## Expected Result

The behavior matches the linked requirements and no unexpected files, services or dependencies are introduced.
