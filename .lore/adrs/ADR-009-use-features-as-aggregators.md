---
id: ADR-009
title: Use Features as Aggregators
status: Accepted
related_requirements:
  - REQ-016
  - REQ-017
related_adrs: []
related_stories: []
related_tests: []
---

# ADR-009 - Use Features as Aggregators

## Context

Lore currently supports:

- Requirements
- Stories
- Architecture Decision Records (ADRs)
- Tests

As repositories grow, users need a way to group related artifacts into larger business capabilities without introducing strict hierarchies.

A requirement, ADR, story or test may contribute to multiple business capabilities.

Therefore a tree-based ownership model is not appropriate.

## Decision

Lore SHALL introduce a Feature artifact type.
Features SHALL act as aggregators of existing artifacts.

Features MAY reference:

- Requirements
- Stories
- ADRs
- Tests

Referenced artifacts SHALL NOT store reverse references to features.
Reverse relationships SHALL be derived from the graph.

## Example

```text
FEATURE-001 Audit Logging
├── REQ-001 Immutable Audit Events
├── STORY-001 Create Audit Event API
├── ADR-001 Use Object Storage
└── TEST-001 Verify Audit Events
```

Artifacts remain independent and reusable across multiple features.

## Consequences

### Positive

* Reduces duplication.
* Supports many-to-many relationships.
* Simplifies artifact maintenance.
* Allows features to represent business capabilities.
* Keeps artifacts reusable.

### Negative

* Reverse relationships must be calculated.
* Graph traversal becomes more important.
