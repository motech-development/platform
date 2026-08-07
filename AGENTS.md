# AGENTS.md

Repository-specific guidance for agents working in this monorepo.

# MSW — the kernel

## program — complete

```
contract ← the requested outcome + the smallest criteria that prove it

while ∃ claim c : deleting c leaves contract unmet ∨ unproven
      do c ; prove c

halt ; report
```

## definitions — no behavior lives here, only meaning

**contract** — the requested outcome and the smallest set of acceptance criteria that would prove it, stated before any work. The sole source of necessity; a ceiling as much as a floor. If the request is ambiguous: attended → ask; unattended → bind the smallest reading consistent with stated intent and record the assumption.

**claim** — anything petitioning to become work: a plan step, a change, a test, a reviewer's P1, a discovered edge case, your own instinct that one more pass would help. Everything enters as this type. Nothing enters as a verdict.

**deleting c leaves contract unmet ∨ unproven** — the only test. A claim passes solely by breaking the contract — reproducibly, within the task's actual inputs and environment. Severity is derived from the contract, never inherited from whoever raised the claim. _Useful_, _thorough_, and _possible_ are not aliases for _necessary_. A claim that fails receives one line in the report — never a fix, an investigation, or a deferred follow-up.

**do ; prove** — the smallest reliable act that closes the gap, and evidence sized to the claim it settles. An unproven act keeps its claim alive; a proven one closes it — and re-proving a closed claim is itself an inadmissible claim.

**halt** — the fixed point: contract proven, no remaining claim passes. Not reviewer silence; not exhausted imagination. Halting before the fixed point and looping past it are the same bug, mirrored.

**report** — the outcome against the contract; the proof; rejected claims worth the user's attention, one line each. Nothing else.

## fuses — outside the program, for when its evaluator fails

```
rounds = 3            → halt anyway ; report open items, do not chase them
claim born in round n+1, visible in round n   → rejected
```

## No unauthoritative limits

Never invent a limit. A cap, threshold, quota, budget, timeout, retry or round count, file or line count, acceptance-criterion count, agent count, or similar constraint is admissible only when its exact value is:

- explicitly required by the requester;
- imposed by an applicable technical or platform contract;
- defined by authoritative project policy; or
- derived from measured evidence necessary to meet or prove the task contract.

State the authority or derivation whenever proposing or applying a limit. If no authority exists, omit the limit and use the MSW necessity test. Metrics may be reported as evidence, but they must not become gates, defaults, targets, or recommendations through agent intuition. Examples and representative proportions never become defaults. If a necessary limit is an unresolved owner choice, ask; do not manufacture a value.

## Scope and Decisions

- Perform read-only reconnaissance of the affected area before modifying files.

## Implementation

- Follow established patterns in the affected package and reuse existing abstractions where they fit.
- Avoid accidental duplication, but do not introduce a premature abstraction merely to eliminate similarity.
- Do not make cosmetic rewrites to evade duplication or static-analysis findings. Resolve the underlying design or explain why the finding should be accepted.
- Treat `.editorconfig`, Prettier, ESLint, TypeScript, and package-local configuration as the source of truth for code style.
- Do not disable or add lint rules merely to avoid fixing the underlying issue. Any exception must be justified by the affected code or toolchain.
- Follow the module system used by the affected package or tool; do not convert CommonJS and ES module boundaries incidentally.
- Remove dead or commented-out code introduced or made obsolete by the change.

## Testing and Verification

- Test observable behavior rather than implementation details.
- Add or update regression tests at the appropriate level when behavior changes. Follow coverage thresholds configured by the affected package.
- Prefer targeted, non-watch tests. Do not run root `yarn test` or a workspace's `test-ci` locally unless explicitly requested; they run CI coverage suites. Invoke the affected Jest or Vitest tests directly instead.
- When mocking Node core modules or external packages, prefer partial mocks that preserve unmocked exports. Full mocks can break transitive consumers.

## Bug Diagnosis

- Establish the expected behavior and reproduce the failure when feasible. For intermittent, production-only, or external-service failures, use the strongest available logs and observations to form a falsifiable hypothesis.
- Prefer the smallest durable root-cause fix. Do not repeat a failed fix without new evidence.
- Add a regression test when the failure can be represented reliably, then run the relevant broader checks.

## Dependencies and Git

- Use Yarn 4 as declared by the root `packageManager` field.
- When adding a dependency, choose the latest compatible version consistent with repository constraints. Preserve the current major version during upgrades unless a major upgrade is explicitly requested or approved.
- Never skip Git hooks.
- Use Conventional Commits for commit messages.

## Repository Guardrails

- Keep Sentry environment names aligned with deployment stages: `production`, `develop`, or `pr-xxx` for pull request stages.
- Treat Auth0-related dependencies and code inside `applications/id` as sensitive. Do not update Auth0 there unless explicitly requested.

## Agent skills

### Issue tracker

Issues and PRDs are tracked in GitHub Issues for `motech-development/platform`. See `docs/agents/issue-tracker.md`.

### Domain docs

Domain documentation uses a multi-context layout indexed by `CONTEXT-MAP.md`. See `docs/agents/domain.md`.

### Platform delivery

Deployment workflows are generated from a catalog and reconcile exact Release tags. Before changing applications, infrastructure dependencies, releases, previews, or delivery workflows, see `docs/agents/platform-delivery.md`.
