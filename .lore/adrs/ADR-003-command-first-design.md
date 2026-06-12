---
id: ADR-003
title: Use a command-first Unix-style design
status: Draft
related_requirements:
  - REQ-003
  - REQ-013
  - REQ-015
related_adrs: []
related_stories:
  - STORY-001
  - STORY-003
  - STORY-004
  - STORY-005
related_tests:
  - TEST-001
  - TEST-003
  - TEST-004
  - TEST-005
---

# ADR-003 - Use a command-first Unix-style design

## Context

Lore should feel like a small developer utility similar to ctop rather than a platform.

## Decision

Lore will expose functionality primarily through small CLI commands.

## Consequences

The tool is scriptable and easy to automate. Complex workflows must be composed from simple commands rather than hidden in the tool.

## Alternatives Considered

- A full web application first
- A background daemon
- Editor plugin only
