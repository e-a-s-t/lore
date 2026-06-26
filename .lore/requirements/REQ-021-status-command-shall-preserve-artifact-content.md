---
id: REQ-021
title: Status command shall preserve artifact content
status: Draft
related_features:
  - FEATURE-008
related_requirements: []
related_adrs: []
related_stories: []
related_tests: []
---

# REQ-021 - Status command shall preserve artifact content

## Requirement

Changing an artifact status shall not modify any content except the `status` field.

## Acceptance Criteria

- Markdown body is unchanged.
- Relationships are unchanged.
- Frontmatter fields other than `status` are unchanged.
- Formatting outside the modified field is preserved where practical.
