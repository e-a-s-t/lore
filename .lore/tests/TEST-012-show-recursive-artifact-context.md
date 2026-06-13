---
id: TEST-012
title: Show recursive artifact context
status: Draft
related_requirements:
  - REQ-025
  - REQ-026
related_stories:
  - STORY-010
---

# TEST-012 - Show Recursive Artifact Context

## Test Case

Run:

```bash
lore show REQ-001 --recursive
```

## Expected Result

- Related artifacts are included recursively.
- Circular references are avoided.
- Each artifact is shown only once.
- Missing artifacts are reported clearly.
- Output is deterministic.
