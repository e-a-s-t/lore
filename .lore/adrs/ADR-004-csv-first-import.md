---
id: ADR-004
title: Support CSV as the first import format
status: Draft
related_requirements:
  - REQ-006
related_adrs: []
related_stories:
  - STORY-004
related_tests:
  - TEST-004
---

# ADR-004 - Support CSV as the first import format

## Context

Most external requirement lists can be exported to CSV even from enterprise systems.

## Decision

Lore will implement CSV import before deeper integrations.

## Consequences

CSV gives quick value. Mapping columns may require configuration later.

## Alternatives Considered

- Azure DevOps API first
- Jira API first
- Excel first
