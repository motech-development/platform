# Domain Docs

How the engineering skills should consume this repo's domain documentation when exploring the codebase.

## Before exploring, read these

- **`CONTEXT-MAP.md`** at the repo root — it points to the `CONTEXT.md` files for each context. Read each one relevant to the topic.
- **`CONTEXT.md`** at the repo root if `CONTEXT-MAP.md` does not yet exist.
- **`docs/adr/`** — read system-wide ADRs that touch the area you're about to work in.
- Context-specific ADR directories listed by `CONTEXT-MAP.md`, typically alongside their context's `CONTEXT.md`.

If any of these files don't exist, **proceed silently**. Don't flag their absence or suggest creating them upfront. The `/domain-modeling` skill, reached through `/grill-with-docs` and `/improve-codebase-architecture`, creates them lazily when terms or decisions actually get resolved.

## File structure

This repository uses a multi-context layout:

```text
/
├── CONTEXT-MAP.md
├── docs/adr/                     ← system-wide decisions
├── .github/
│   ├── CONTEXT.md                ← Platform Delivery context
│   └── docs/adr/                 ← Platform Delivery decisions
├── applications/
│   └── <context>/
│       ├── CONTEXT.md
│       └── docs/adr/             ← context-specific decisions
└── packages/
    └── <context>/
        ├── CONTEXT.md
        └── docs/adr/             ← context-specific decisions
```

`CONTEXT-MAP.md` is authoritative. A directory does not need domain documentation merely because it is a workspace; add a context only when its domain language needs to be modelled independently.

## Use the glossary's vocabulary

When your output names a domain concept—in an issue title, refactor proposal, hypothesis, or test name—use the term as defined in the relevant `CONTEXT.md`. Don't drift to synonyms the glossary explicitly avoids.

If the concept you need isn't in the glossary yet, that's a signal: either you're inventing language the project doesn't use, or there's a real gap to note for `/domain-modeling`.

## Flag ADR conflicts

If your output contradicts an existing ADR, surface it explicitly rather than silently overriding:

> _Contradicts ADR-0007 (event-sourced orders) — but worth reopening because…_
