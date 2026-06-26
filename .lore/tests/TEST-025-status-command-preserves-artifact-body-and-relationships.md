---
id: TEST-025
title: Status command preserves artifact body and relationships
status: Draft
related_features:
  - FEATURE-008
related_requirements: []
related_adrs: []
related_stories: []
related_tests: []
---

# TEST-025 - Status command preserves artifact body and relationships

Verify that changing status does not alter artifact content.

Expected Result

- Markdown body is unchanged.
- Relationships are unchanged.
- Only the `status` field is modified.
