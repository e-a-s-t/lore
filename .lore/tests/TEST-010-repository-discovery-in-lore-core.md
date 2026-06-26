---
id: TEST-010
title: Repository discovery in lore-core
status: Implemented
related_features:
  - FEATURE-002
related_requirements:
  - REQ-011
related_adrs: []
related_stories:
  - STORY-005
related_tests: []
---

Given a nested current directory, repository discovery returns the nearest root and `.lore` path or a structured error when none exists.
