---
id: TEST-009
title: Show single artifact by ID
status: Draft
related_requirements:
  - REQ-021
  - REQ-023
related_stories:
  - STORY-009
---

# TEST-009 - Show Single Artifact by ID

## Test Case

Run:

```bash
lore show REQ-001
```

### Expected Result

- The artifact REQ-001 is printed to stdout.
- The original Markdown is preserved.
- The frontmatter is included.
- The command exits successfully.
