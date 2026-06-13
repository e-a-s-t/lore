---
id: REQ-026
title: Provide clear errors for missing artifacts
status: Draft
related_requirements: []
related_adrs: []
related_stories:
  - STORY-010
related_tests:
  - TEST-012
---

# REQ-026 - Report Missing Artifacts

## Requirement

Lore SHALL provide clear feedback when artifacts cannot be found.

## Rationale

Users and AI agents should be able to distinguish between successful retrieval and missing context.

## Acceptance Criteria

- [ ] Missing artifacts are reported.
- [ ] Existing artifacts are still returned.
- [ ] Error messages contain the missing IDs.
- [ ] Missing artifacts do not terminate processing of valid artifacts.
