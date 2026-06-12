---
id: TEST-003
title: Search finds matching artifacts
status: Draft
related_requirements:
  - REQ-001
  - REQ-002
  - REQ-004
  - REQ-009
related_adrs:
  - ADR-006
related_stories:
  - STORY-003
related_tests: []
---

# TEST-003 - Search finds matching artifacts

## Purpose

Verify that Lore satisfies the linked requirements and user stories.

## Test Steps

1. Create an artifact containing the word audit.
2. Run `lore search audit`.
3. Verify the artifact is listed in the result.

## Expected Result

The behavior matches the linked requirements and no unexpected files, services or dependencies are introduced.
