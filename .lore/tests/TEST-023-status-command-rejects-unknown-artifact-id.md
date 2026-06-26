---
id: TEST-023
title: Status command rejects unknown artifact ID
status: Draft
related_features:
  - FEATURE-008
related_requirements: []
related_adrs: []
related_stories: []
related_tests: []
---

# TEST-023 - Status command rejects unknown artifact ID

Verify that the status command rejects an artifact ID that does not exist.

Expected Result

- Command fails.
- Exit code is non-zero.
- No files are modified.
