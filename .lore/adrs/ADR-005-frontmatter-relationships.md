---
id: ADR-005
title: Store relationships in artifact frontmatter
status: Draft
related_requirements:
  - REQ-007
  - REQ-008
  - REQ-011
related_adrs:
  - ADR-001
related_stories:
  - STORY-005
  - STORY-007
related_tests:
  - TEST-005
  - TEST-007
---

# ADR-005 - Store relationships in artifact frontmatter

## Context

Traceability requires relationships between requirements, ADRs, stories and tests.

## Decision

Lore will store relationships using `related_requirements`, `related_adrs`, `related_stories` and `related_tests` in YAML frontmatter.

## Consequences

Relationships are visible and reviewable. Validation is needed to detect broken links.

## Alternatives Considered

- Separate traceability database
- Central-only traceability.yaml
- Infer links from text only
