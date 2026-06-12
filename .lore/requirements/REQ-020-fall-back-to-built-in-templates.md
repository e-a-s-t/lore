---
id: REQ-020
title: Fall Back to Built-in Templates
status: Draft
related_requirements: []
related_adrs: []
related_stories: []
related_tests: []
---

# REQ-020 - Fall Back to Built-in Templates

## Requirement

Lore SHALL use built-in templates when no repository template exists.

## Rationale

Repositories should not be required to define templates for every artifact type.

## Acceptance Criteria

* [ ] Missing repository templates do not cause errors.
* [ ] Artifact creation continues to work without repository templates.
* [ ] Built-in templates remain available as defaults.
