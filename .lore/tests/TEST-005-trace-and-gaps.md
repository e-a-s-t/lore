---
id: TEST-005
title: Traceability and gaps are reported
status: Draft
related_requirements:
  - REQ-003
  - REQ-007
  - REQ-008
  - REQ-011
  - REQ-015
related_adrs:
  - ADR-005
related_stories:
  - STORY-005
related_tests: []
---

# TEST-005 - Traceability and gaps are reported

## Purpose

Verify that Lore satisfies the linked requirements and user stories.

## Test Steps

1. Create a requirement linked to an ADR, story and test.
2. Run `lore trace`.
3. Verify links are displayed.
4. Remove one link and run `lore gaps`.
5. Verify the missing link is reported.

## Expected Result

The behavior matches the linked requirements and no unexpected files, services or dependencies are introduced.
