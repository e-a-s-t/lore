# Project Lore

Requirements, stories, ADRs, tests and features for this repository.
# Lore project knowledge

This directory contains Lore's own requirements, ADRs, user stories and tests.

Lore uses itself to describe its intended behavior.

## Structure

```text
.lore/
  requirements/
  adrs/
  stories/
  tests/
  templates/
  traceability.yaml
  lore.toml
```

## Main design choices

- Markdown with YAML frontmatter.
- Single `.lore/` directory.
- Local-first and Git-native.
- CLI-first, with an optional local UI.
