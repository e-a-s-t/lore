---
id: REQ-022
title: Feature status changes shall support cascading to related artifacts
status: Draft
related_features:
  - FEATURE-008
related_requirements: []
related_adrs: []
related_stories: []
related_tests: []
---

# REQ-022 - Feature status changes shall support cascading to related artifacts

## Requirement

Users shall be able to update the status of a Feature and optionally propagate the new status to related artifacts.

## Acceptance Criteria

- Cascading is explicitly enabled using `--cascade`.
- The Feature status is always updated.
- Directly related Requirements, Stories, ADRs and Tests are updated.
- Artifacts not related to the Feature are unaffected.
