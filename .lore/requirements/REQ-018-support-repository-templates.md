---
id: REQ-018
title: Support Repository Templates
status: Draft
related_requirements: []
related_adrs: []
related_stories: []
related_tests: []
---

# REQ-018 - Support Repository Templates

## Requirement

Lore SHALL support repository-specific templates stored under `.lore/templates`.

## Rationale

Repositories should be able to customize artifact templates without modifying Lore itself.

## Acceptance Criteria

* [ ] Lore searches `.lore/templates` for artifact templates.
* [ ] Repository templates are plain Markdown files.
* [ ] Template files are version controlled.
* [ ] Template files can be reviewed in pull requests.
