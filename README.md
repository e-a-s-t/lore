# lore

Git-native requirements, ADRs, stories and tests.

Because AI needs better context.

`lore` stores project knowledge in `.lore/` inside your repository.

## Usage

```bash
npm install
npm link

lore init
lore req new "Audit logging"
lore adr new "Use immutable audit storage"
lore import requirements examples/requirements.csv
lore trace
lore gaps
lore ui
```

## Project storage

```text
.lore/
  requirements/
  stories/
  adrs/
  tests/
  templates/
  lore.toml
```

## Philosophy

Code is the implementation.

`.lore` is the memory of the system.
