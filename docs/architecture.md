# Architecture

This document describes the architecture of Lore and the principles used to organize the codebase.

## Overview

Lore is a Git-native project memory tool.

The architecture is intentionally simple:

```text
Repository
    │
    ├── CLI
    ├── Validation
    ├── Traceability
    ├── Storage
    └── UI
```

Lore does not use:

* Databases
* External services
* SaaS platforms

The Git repository is the system of record.

---

## High-Level Architecture

```text
┌─────────────┐
│ CLI         │
└──────┬──────┘
       │
       ▼
┌─────────────┐
│ Services    │
├─────────────┤
│ Validation  │
│ Traceability│
│ Storage     │
└──────┬──────┘
       │
       ▼
┌─────────────┐
│ .lore/      │
│ Repository  │
└─────────────┘
```

The UI consumes the same services and data model as the CLI.

---

## Repository Structure

```text
bin/
├── lore.js
└── lib/
    ├── commands/
    ├── ui/
    ├── validation/
    ├── trace/
    ├── templates/
    └── store.js
```

### lore.js

CLI entrypoint.

Responsible for:

* Argument parsing
* Command registration
* Version information

Business logic should not live here.

---

## Storage Layer

The storage layer is responsible for:

* Reading artifacts
* Writing artifacts
* Parsing metadata
* Resolving relationships

Current implementation:

```text
.lore/
├── requirements/
├── stories/
├── adrs/
├── tests/
└── templates/
```

Artifacts are stored as Markdown files with frontmatter.

Example:

```markdown
---
id: REQ-001
title: Audit Logging
status: Draft

related_stories:
  - STORY-001
---

# Audit Logging

The system SHALL provide immutable audit logging.
```

The filesystem is the database.

---

## Artifact Model

Lore currently supports four artifact types:

```text
Requirement
Story
ADR
Test
```

Each artifact has:

```text
id
title
status
content
relationships
```

All artifact types share the same fundamental structure.

Future artifact types should follow the same pattern.

---

## Traceability

Relationships are represented using explicit identifiers.

Example:

```yaml
related_requirements:
  - REQ-001

related_stories:
  - STORY-001

related_adrs:
  - ADR-001

related_tests:
  - TEST-001
```

The traceability engine is responsible for:

* Resolving references
* Detecting broken links
* Finding gaps
* Building graphs

---

## Validation

Validation ensures repository consistency.

Examples:

* Unique IDs
* Valid references
* Required metadata
* Valid artifact structure

The goal is to fail fast and detect problems before they reach Git.

---

## UI

The UI is intentionally lightweight.

Current technology choices:

* HTML
* CSS
* JavaScript
* Express
* Mermaid

No frontend framework is required.

Reasons:

* Minimal dependencies
* Fast startup
* Easy debugging
* Easy contribution

---

## Relationship Visualization

Relationships are visualized using Mermaid.

Example:

```text
REQ-001
    │
    ├── STORY-001
    │       │
    │       └── TEST-001
    │
    └── ADR-001
```

Future versions will support repository-wide graph visualization.

---

## Design Principles

### Git Native

Git is the source of truth.

### Local First

Lore should function without network access.

### Human Readable

Artifacts must remain understandable without Lore.

### AI Friendly

Artifacts should be consumable directly by LLMs.

### Unix Philosophy

Small focused commands.

Composable behavior.

### Zero Magic

Prefer explicit behavior over hidden behavior.

---

## Future Architecture

Planned additions:

```text
Storage
  └── Import / Export

Traceability
  └── Full graph engine

UI
  ├── Markdown rendering
  ├── Mermaid in content
  ├── Tabs
  ├── Git history
  └── Editing

Git
  └── History integration
```

The long-term goal is to keep the architecture simple while allowing repositories to grow in knowledge and traceability.

Code is the implementation.

Documentation explains the implementation.

`.lore` is the memory of the system.
