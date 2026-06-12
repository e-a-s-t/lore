---
id: TEST-002
title: New artifact is created from template
status: Draft
related_requirements:
  - REQ-003
  - REQ-004
  - REQ-011
  - REQ-015
related_adrs:
  - ADR-001
related_stories:
  - STORY-002
related_tests: []
---

# TEST-002 - New artifact is created from template

## Purpose

Verify that Lore satisfies the linked requirements and user stories.

## Test Steps

1. Run `lore req new --id REQ-999 --title Example`.
2. Verify the generated file exists.
3. Verify the file has YAML frontmatter.
4. Verify the ID is stable and visible.

## Expected Result

The behavior matches the linked requirements and no unexpected files, services or dependencies are introduced.
