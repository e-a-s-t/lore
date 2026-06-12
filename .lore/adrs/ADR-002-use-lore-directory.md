---
id: ADR-002
title: Use .lore as the single project knowledge directory
status: Draft
related_requirements:
  - REQ-001
  - REQ-002
  - REQ-005
  - REQ-012
  - REQ-013
related_adrs:
  - ADR-001
related_stories:
  - STORY-001
related_tests:
  - TEST-001
---

# ADR-002 - Use .lore as the single project knowledge directory

## Context

Lore should not fill the repository root with multiple directories.

## Decision

Lore will place all project knowledge under `.lore/`.

## Consequences

The repository root stays clean. Tools and humans know where project context lives. The directory name is product-specific and may need migration if changed later.

## Alternatives Considered

- Use `.context/`
- Use root-level `requirements/`, `adrs/`, `stories/` and `tests/`
- Use `docs/` only
