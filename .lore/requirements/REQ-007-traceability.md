---
id: REQ-007
title: Traceability
status: Draft
related_requirements: []
related_adrs:
  - ADR-005
related_stories:
  - STORY-005
  - STORY-007
related_tests:
  - TEST-005
  - TEST-007
---

# REQ - Traceability

## Requirement

Lore SHALL maintain relationships between requirements, ADRs, stories and tests.

## Rationale

The value of Lore is not just storage, but visible context and impact chains.

## Acceptance Criteria

- [ ] `lore trace` displays artifact relationships.
- [ ] Relationships are stored in artifact frontmatter.
- [ ] Traceability can be generated without a database.
