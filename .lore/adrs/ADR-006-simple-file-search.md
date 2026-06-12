---
id: ADR-006
title: Use simple file-based search initially
status: Draft
related_requirements:
  - REQ-009
related_adrs:
  - ADR-001
related_stories:
  - STORY-003
related_tests:
  - TEST-003
---

# ADR-006 - Use simple file-based search initially

## Context

Lore needs search but should remain local-first and database-free.

## Decision

Lore will initially scan Markdown files directly for search.

## Consequences

Implementation stays simple. Very large repositories may need optional indexing later.

## Alternatives Considered

- SQLite FTS from day one
- External search engine
- No search command
