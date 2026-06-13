---
id: FEATURE-002
title: Artifact Inspection
status: Draft
related_requirements:
  - REQ-021
  - REQ-022
  - REQ-023
  - REQ-024
  - REQ-025
  - REQ-026
related_adrs: []
related_stories: []
related_tests: []
---

# FEATURE-002 - Artifact Inspection

## Goal

Allow humans and AI agents to inspect artifacts directly by their IDs without needing to search the repository or manually copy Markdown files.

## Scope

* Show artifacts by ID.
* Show multiple artifacts in a single command.
* Preserve the original Markdown.
* Support all artifact types.
* Show direct relationships between artifacts.
* Support recursive context expansion.
* Produce output suitable for AI agents and terminal usage.

## Out of Scope

* Editing artifacts.
* Rendering Markdown.
* Graph visualization.
* Search functionality.

## User Value

Developers can quickly inspect project knowledge from the terminal.

AI assistants and coding agents can request only the artifacts they need, reducing context size and avoiding unnecessary Markdown duplication.

Instead of embedding large documents in prompts, users can reference artifact IDs and allow tools to retrieve the relevant context.

Relationships between artifacts make it possible to provide additional context on demand without manually searching through the repository.

## Success Criteria

* [ ] A single artifact can be shown by ID.
* [ ] Multiple artifacts can be shown in one command.
* [ ] Output preserves the original Markdown.
* [ ] Missing artifacts produce a clear error message.
* [ ] Requirements, Stories, ADRs, Tests and Features are supported.
* [ ] Direct relations can be displayed.
* [ ] Related artifacts can be recursively expanded.

## Notes

This feature is particularly valuable for AI workflows.

For example, instead of including large Markdown documents in a prompt:

```text
Use Lore context:

REQ-001
REQ-004
ADR-004
TEST-003
```

an agent can execute:

```bash
lore show REQ-001 REQ-004 ADR-004 TEST-003
```

and retrieve only the information required for the current task.

Relationships allow additional context to be included:

```bash
lore show REQ-001 --relations
```

Recursive context expansion can provide the complete context surrounding an artifact:

```bash
lore show REQ-001 --recursive
```

This reduces context size, minimizes duplication and improves determinism for coding agents.
