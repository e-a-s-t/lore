---
id: ADR-007
title: Provide a local Node-based UI
status: Draft
related_requirements:
  - REQ-010
  - REQ-012
related_adrs: []
related_stories:
  - STORY-006
  - STORY-007
related_tests:
  - TEST-006
  - TEST-007
---

# ADR-007 - Provide a local Node-based UI

## Context

A terminal is good for automation, but browsing relationships benefits from a simple UI.

## Decision

Lore will provide `lore ui`, starting a local Node web server that reads `.lore/`.

## Consequences

The UI requires no deployed backend. It adds Node runtime dependency for UI usage.

## Alternatives Considered

- Static HTML only
- Hosted SaaS UI
- No UI
