---
id: REQ-011
title: Repository discovery in lore-core
status: Implemented
related_features:
  - FEATURE-002
related_requirements: []
related_adrs: []
related_stories:
  - STORY-005
related_tests:
  - TEST-010
---

The system shall discover the repository root by walking upward from the current working directory until a `.lore` directory is found.
