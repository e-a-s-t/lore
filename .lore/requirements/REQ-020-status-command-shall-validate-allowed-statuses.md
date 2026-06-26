---
id: REQ-020
title: Status command shall validate allowed statuses
status: Draft
related_features:
  - FEATURE-008
related_requirements: []
related_adrs: []
related_stories: []
related_tests: []
---

# REQ-020 - Status command shall validate allowed statuses

The status command shall only accept statuses defined by the Lore artifact lifecycle.

## Acceptance Criteria

- Invalid status values are rejected.
- The command exits with a non-zero exit code on validation failure.
- The artifact is left unchanged if validation fails.
- The error message lists the allowed statuses.
