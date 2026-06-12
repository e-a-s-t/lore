# Developer Guide

This document describes conventions used by Lore development.

## Versioning

Lore uses the version defined in `package.json` as the single source of truth.

Do not hardcode version numbers anywhere else in the project.

Example:

```json
{
  "version": "0.1.0"
}
```

The CLI version should always be loaded from `package.json`.

### Updating the Version

Patch release:

```bash
npm version patch
```

Minor release:

```bash
npm version minor
```

Major release:

```bash
npm version major
```

This updates:

* `package.json`
* `package-lock.json`
* Git tag

Example:

```text
0.1.0 -> 0.1.1
```

Push version and tags:

```bash
git push
git push --tags
```

---

## Formatting

Lore uses:

```bash
npm run format
```

before committing changes.

Formatting should be applied consistently across the repository.

---

## Project Structure

```text
bin/
├── lore.js
└── lib/
    ├── commands/
    ├── ui/
    ├── validation/
    └── ...
```

### UI

The UI is intentionally implemented using:

* Plain HTML
* Plain CSS
* Plain JavaScript

No frontend framework is required.

The goal is:

* Minimal dependencies
* Easy debugging
* Easy contribution
* Fast startup

---

## Repository Philosophy

Lore follows a few simple principles:

### Git Native

Everything should be stored as files.

### Local First

Lore should work without external services.

### Human Readable

Artifacts must remain understandable without Lore.

### AI Friendly

Artifacts should be easy for LLMs to consume.

### Zero Magic

Prefer explicit behavior over hidden behavior.

---

## Commit Messages

Use conventional commit style where possible.

Examples:

```text
feat(ui): add Mermaid relationship graphs

feat(trace): add broken reference detection

fix(ui): prevent duplicate relations

docs: improve README and installation instructions

refactor(ui): split app into modules
```

---

## Release Process

1. Update code and documentation.
2. Run validation.

```bash
lore validate
```

3. Run tests.

```bash
npm test
```

4. Update version.

```bash
npm version patch
```

5. Commit changes.

```bash
git push
git push --tags
```

---

## Long-Term Direction

Current roadmap:

* Markdown rendering via marked
* Mermaid diagrams in content
* Item tabs (Overview, Content, Graph, Raw)
* Full project graph view
* Git history integration
* In-browser editing

The goal is not to build another platform.

The goal is to provide Git-native project memory.
