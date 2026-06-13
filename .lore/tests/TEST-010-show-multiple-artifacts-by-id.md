---
id: TEST-010
title: Show multiple artifacts by ID
status: Draft
related_requirements:
  - REQ-022
  - REQ-023
related_stories:
  - STORY-009
  - STORY-010
related_adrs: []
related_tests: []
---

# TEST-010 - Show Multiple Artifacts by ID

## Test Case

Run:

```bash
lore show REQ-001 ADR-001 TEST-001
```

## Expected Result

- All requested artifacts are printed to stdout.
- Artifacts are shown in the requested order.
- Artifact boundaries are clear.
- Original Markdown is preserved for each artifact.
