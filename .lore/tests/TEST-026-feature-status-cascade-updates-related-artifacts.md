---
id: TEST-026
title: Feature status cascade updates related artifacts
status: Draft
related_features:
  - FEATURE-008
related_requirements: []
related_adrs: []
related_stories: []
related_tests: []
---

# TEST-026 - Feature status cascade updates related artifacts

Verify that `--cascade` updates the Feature and its directly related artifacts.

Expected Result

- Feature status is updated.
- Related Requirements, Stories, ADRs and Tests receive the same status.
- Unrelated artifacts remain unchanged.
