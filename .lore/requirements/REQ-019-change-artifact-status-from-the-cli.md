---
id: REQ-019
title: Change artifact status from the CLI
status: Draft
related_features:
  - FEATURE-008
related_requirements: []
related_adrs: []
related_stories: []
related_tests: []
---

# REQ-019 - Change artifact status from the CLI

Users shall be able to change the status of an artifact using the Lore CLI.

## Acceptance Criteria

- A command exists to update an artifact status.
- The artifact is located using repository discovery.
- Only the `status` field in the frontmatter is modified.
- The command reports success after updating the artifact.
