---
id: REQ-022
title: Support multiple artifact IDs
status: Draft
related_requirements: []
related_adrs: []
related_stories:
  - STORY-009
  - STORY-010
related_tests: 
  - TEST-010
---

# REQ-022 - Support Context Extraction

## Requirement

Lore SHALL support retrieving multiple artifacts in a single command.

## Rationale

AI assistants and coding agents often require several related artifacts as context.

## Acceptance Criteria

* [ ] Multiple artifact IDs can be specified.
* [ ] Artifacts are returned in the order requested.
* [ ] Output preserves artifact boundaries.
* [ ] Missing artifacts do not prevent existing artifacts from being returned.
