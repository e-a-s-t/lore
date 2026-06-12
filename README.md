# ᛚᛟᚱᛖ

> Git-native project memory.
>
> Because Humans and AI need better context.

## Install

```shell
npm install -g github:e-a-s-t/lore
```

## The Problem

Understanding a feature should be easy.

In reality, project knowledge is often scattered across multiple systems:

* Requirements in Jira
* User stories in Azure DevOps
* ADRs in Confluence
* Tests in TestRail
* Documentation in a Wiki
* Architecture diagrams in Visio
* Decisions in someone's head

To understand a single feature, developers often need to search through several tools and hope the information is still up to date.

The same problem affects AI assistants.

The context exists.

It is just fragmented.

---

## What Lore Does

Lore keeps project knowledge together with the code.

```text
project/
├── src/
├── docs/
└── .lore/
```

Inside `.lore` you can store:

* Requirements
* User Stories
* Architecture Decision Records (ADRs)
* Test Cases

All:

* Plain Markdown files
* Version controlled
* Reviewable in pull requests
* Searchable
* AI friendly

---

## Why?

Because developers already have everything they need:

* A Git repository
* An editor
* A terminal
* A browser

Adding another platform often creates more problems than it solves.

Lore works with the tools developers already use.

No:

* Database
* SaaS subscription
* Proprietary platform
* Vendor lock-in

---

## Connected Knowledge

Requirements, stories, ADRs and tests can be linked together.

```text
REQ-001 Audit Logging
    │
    ├── STORY-001 Implement Audit Events
    │       │
    │       └── TEST-001 Verify Audit Events
    │
    └── ADR-001 Immutable Storage
```

This makes it possible to answer questions such as:

* Why does this feature exist?
* Which requirement does this code implement?
* Which decision led to this design?
* Which tests verify this requirement?
* What is affected if this requirement changes?

---

## Developer Friendly

Use the editor you already like:

* Zed
* Vim
* VS Code
* IntelliJ
* Neovim
* Emacs
* Cursor
* Windsurf

Use the AI assistant you already like:

* ChatGPT
* Codex
* Claude Code
* Gemini
* Continue

Use the browser when you want a visual view:

```bash
lore ui
```

Use the terminal when you don't:

```bash
lore trace
lore gaps
```

Lore is not another platform.

It is a structure for project knowledge.

---

## Philosophy

Code is the implementation.

Documentation explains the implementation.

`.lore` is the memory of the system.
