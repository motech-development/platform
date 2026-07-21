# AGENTS.md

Repository-specific guidance for agents working in this monorepo.

## Scope and Decisions

- Perform proportionate, read-only reconnaissance of the affected area before modifying files.
- Proceed autonomously when the requested outcome and repository evidence make the implementation clear.
- Ask for direction when a required decision cannot be inferred safely and would materially affect behavior, scope, external state, or risk.
- Keep changes within the requested outcome. Updating affected consumers is in scope when required to preserve consistency; report unrelated issues instead of fixing them.
- Keep changes surgical and inspect the final diff for unintended edits.

## Implementation

- Follow established patterns in the affected package and reuse existing abstractions where they fit.
- Follow YAGNI: implement only capabilities required by the current outcome; do not add speculative abstractions, configuration, extension points, or future-facing code.
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
- Run the relevant lint, type-check, test, build, and end-to-end checks in proportion to the change and available tooling.
- Fix failures introduced by the change. Diagnose and report pre-existing failures unless they block the requested outcome.
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

## Reporting

- Summarize the changes made, validation performed, and any known verification gaps or pre-existing failures.

## Agent skills

### Issue tracker

Issues and PRDs are tracked in GitHub Issues for `motech-development/platform`. See `docs/agents/issue-tracker.md`.

### Domain docs

Domain documentation uses a multi-context layout indexed by `CONTEXT-MAP.md`. See `docs/agents/domain.md`.
