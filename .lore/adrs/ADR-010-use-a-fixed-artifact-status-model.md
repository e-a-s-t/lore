---
id: ADR-010
title: Use a fixed artifact status model
status: Draft
related_features:
  - FEATURE-008
related_requirements: []
related_adrs: []
related_stories: []
related_tests: []
---

# ADR-010 - Use a fixed artifact status model



## Context

Lore artifacts represent project knowledge that progresses through a common lifecycle.
Allowing arbitrary status values would make validation, filtering and automation inconsistent across repositories.

## Decision

Lore shall support a fixed set of artifact statuses:

- Draft
- Proposed
- Accepted
- Implemented
- Verified
- Rejected
- Deprecated

Status values are validated by the CLI.

Not every artifact type is expected to transition through every status.

where:

- Draft – The artifact is being created or refined.
- Proposed – The artifact is ready for review or discussion.
- Accepted – The artifact has been approved as the intended direction.
- Implemented – The work described by the artifact has been completed.
- Verified – The implemented work has been validated.
- Rejected – The artifact has been explicitly declined.
- Deprecated – The artifact is no longer current and should not be used for new work.

## Consequences

Positive

- Consistent lifecycle across all artifact types.
- Simple validation.
- Deterministic filtering and reporting.
- Easier future TUI support.

Negative

- Custom workflows are not supported initially.
