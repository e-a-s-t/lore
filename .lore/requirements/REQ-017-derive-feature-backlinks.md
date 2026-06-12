---
id: REQ-017
title: Derive Feature Backlinks
status: Draft
related_requirements: []
related_adrs:
  - ADR-009
related_stories: []
related_tests: []

---

# Derive Feature Backlinks

## Requirement

Lore SHALL derive feature relationships rather than storing reverse references.

## Rationale

Artifacts should remain reusable across multiple features without requiring duplicate metadata.

## Acceptance Criteria

- [ ] Features may reference requirements.
- [ ] Features may reference stories.
- [ ] Features may reference ADRs.
- [ ] Features may reference tests.
- [ ] Requirements do not require `related_features`.
- [ ] Stories do not require `related_features`.
- [ ] ADRs do not require `related_features`.
- [ ] Tests do not require `related_features`.
- [ ] The UI can show "Used by Features" using derived relationships.
