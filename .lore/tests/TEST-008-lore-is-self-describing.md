---
id: TEST-008
title: Lore repository contains Lore metadata
status: Draft
related_requirements:
  - REQ-014
related_adrs:
  - ADR-008
related_stories:
  - STORY-008
related_tests: []
---

# TEST-008 - Lore repository contains Lore metadata

## Purpose

Verify that Lore satisfies the linked requirements and user stories.

## Test Steps

1. Verify `.lore/requirements` exists.
2. Verify `.lore/adrs` exists.
3. Verify `.lore/stories` exists.
4. Verify `.lore/tests` exists.

## Expected Result

The behavior matches the linked requirements and no unexpected files, services or dependencies are introduced.
