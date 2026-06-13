---
id: FEATURE-001
title: Repository templates
status: Draft
related_requirements:
  - REQ-018
  - REQ-019
  - REQ-020
related_adrs: []
related_stories: []
related_tests: []
---

# FEATURE-001 - Repository Templates

## Goal

Allow repositories to define and customize artifact templates without modifying Lore itself.

## Scope

- Repository-specific templates
- Requirement templates
- Story templates
- ADR templates
- Test templates

## Out of Scope

- Remote template repositories
- Template marketplaces
- Dynamic template generation

## User Value

Teams can adapt Lore to their own workflows while remaining Git-native.

Template customization becomes part of the repository and can be reviewed, versioned and shared through Git.

## Success Criteria

- [ ] Lore prefers repository templates over built-in templates
- [ ] Missing repository templates fall back to built-in templates
- [ ] Existing repositories continue to work unchanged
- [ ] Templates remain plain Markdown files

## Notes

Repository templates should be treated as project knowledge and stored under:

```text
.lore/templates/
```
