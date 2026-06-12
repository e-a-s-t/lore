---
id: ADR-008
title: Develop Lore using Lore
status: Draft
related_requirements:
  - REQ-014
related_adrs: []
related_stories:
  - STORY-008
related_tests:
  - TEST-008
---

# ADR-008 - Develop Lore using Lore

## Context

Lore should prove its own model and provide useful examples.

## Decision

The Lore repository will contain a `.lore/` directory with linked requirements, ADRs, stories and tests for Lore itself.

## Consequences

The project becomes self-describing and easier to demo. The metadata must be maintained as part of normal development.

## Alternatives Considered

- Separate example repository
- README-only documentation
