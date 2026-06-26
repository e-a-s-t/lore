---
id: ADR-009
title: Keep artifact status changes CLI-first
status: Draft
related_features:
  - FEATURE-008
related_requirements: []
related_adrs: []
related_stories: []
related_tests: []
---

# ADR-009 - Keep artifact status changes CLI-first

## Status

Accepted

## Context

Lore provides both a command-line interface and a terminal user interface for interacting with project artifacts.

Changing an artifact's status modifies repository content. Implementing write operations independently in both the CLI and the TUI would duplicate file update logic, validation, and error handling.

The CLI already serves as the primary interface for repository modifications, while the TUI is initially focused on browsing and visualization.

## Decision

Artifact status changes shall be exposed first through the Lore CLI.

The repository mutation logic shall live in `lore-core`, including:

- artifact lookup
- status validation
- frontmatter update
- cascade planning
- cascade execution
- preservation of unrelated content

The CLI shall call `lore-core` and handle command-line argument parsing, output, and exit codes.

The TUI shall remain read-only initially. If the TUI later supports changing artifact status, it shall reuse the same `lore-core` status update logic instead of invoking the CLI or editing files directly.

## Consequences

Positive

- Repository mutation logic has a single implementation.
- CLI and TUI can share the same behavior.
- Status validation and cascade behavior remain consistent.
- The CLI stays thin and focused on user interaction.

Negative

- Interactive status changes from the TUI require invoking the CLI.
- The CLI becomes the central implementation for write operations.

## Alternatives Considered

### Allow the TUI to edit artifact files directly

Rejected.

This would duplicate repository update logic, validation, and future maintenance.

### Implement separate write logic in both the CLI and the TUI

Rejected.

Multiple implementations increase the risk of inconsistent behavior and make future enhancements more difficult.
