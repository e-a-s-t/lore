---
id: TEST-006
title: UI starts locally
status: Draft
related_requirements:
  - REQ-010
  - REQ-012
related_adrs:
  - ADR-007
related_stories:
  - STORY-006
related_tests: []
---

# TEST-006 - UI starts locally

## Purpose

Verify that Lore satisfies the linked requirements and user stories.

## Test Steps

1. Run `lore ui`.
2. Verify a local server starts.
3. Verify the dashboard can load without external services.

## Expected Result

The behavior matches the linked requirements and no unexpected files, services or dependencies are introduced.
