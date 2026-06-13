---
id: TEST-011
title: Show artifact relations
status: Draft
related_requirements:
  - REQ-024
related_stories:
  - STORY-010
---

# TEST-011 - Show Artifact Relations

## Test Case

Run:

```bash
lore show REQ-001 --relations
```

## Expected Result

- Direct outgoing relations are shown.
- Direct incoming relations are shown.
- Relation types are shown.
- Missing references are clearly marked.
