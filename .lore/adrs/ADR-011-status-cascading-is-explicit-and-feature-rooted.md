---
id: ADR-011
title: Status cascading is explicit and feature-rooted
status: Draft
related_features:
  - FEATURE-008
related_requirements: []
related_adrs: []
related_stories: []
related_tests: []
---

# ADR-011 - Status cascading is explicit and feature-rooted

## Context

Changing the status of a Feature often represents the completion or acceptance of the work represented by its related artifacts.
Automatically updating related artifacts could unintentionally modify large portions of the repository.

## Decision

Status cascading shall be initiated explicitly using the `--cascade` option.
When cascading is enabled from a Feature, the Feature is updated first, followed by its directly related artifacts.

## Consequences

Positive

- Prevents accidental repository-wide updates.
- Gives users explicit control over lifecycle changes.
- Keeps normal status updates simple.

Negative

- Requires an additional option when updating an entire Feature.
