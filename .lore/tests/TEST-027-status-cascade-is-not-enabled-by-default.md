---
id: TEST-027
title: Status cascade is not enabled by default
status: Draft
related_features:
  - FEATURE-008
related_requirements: []
related_adrs: []
related_stories: []
related_tests: []
---

# TEST-027 - Status cascade is not enabled by default

Verify that changing the status of a Feature without `--cascade` updates only the Feature.

Expected Result

- Feature status is updated.
- Related artifacts keep their existing status.
