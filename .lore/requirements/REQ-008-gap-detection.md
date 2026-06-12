---
id: REQ-008
title: Gap Detection
status: Draft
related_requirements: []
related_adrs:
  - ADR-005
related_stories:
  - STORY-005
related_tests:
  - TEST-005
---

# REQ - Gap Detection

## Requirement

Lore SHALL identify missing or weak relationships between artifacts.

## Rationale

Missing links reveal missing engineering context.

## Acceptance Criteria

- [ ] `lore gaps` reports requirements without tests.
- [ ] `lore gaps` reports ADRs without related requirements.
- [ ] `lore gaps` reports stories without tests.
