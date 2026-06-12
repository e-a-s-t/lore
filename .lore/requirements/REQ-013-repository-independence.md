---
id: REQ-013
title: Repository Independence
status: Draft
related_requirements: []
related_adrs:
  - ADR-002
  - ADR-003
related_stories:
  - STORY-001
related_tests:
  - TEST-001
---

# REQ - Repository Independence

## Requirement

Lore SHALL work with any repository, including repositories that are not yet Git repositories.

## Rationale

Lore should be useful for many project types and should not assume a specific language or framework.

## Acceptance Criteria

- [ ] Lore works in Java, Go, Python, Node, Kubernetes and Terraform repositories.
- [ ] Lore can initialize in a directory before `git init`.
