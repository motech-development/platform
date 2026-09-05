# AGENTS.md

Repository-specific guidance for agents working in this monorepo.

## Scope and Decisions

- Perform proportionate, read-only reconnaissance of the affected area before modifying files.
- Treat requests for action as instructions to complete the work and verify the result. Proceed autonomously when the requested outcome and repository evidence make the implementation clear.
- Resolve routine choices from conversation context and repository evidence. Ask only when a required decision remains unresolved and materially affects the outcome or authorization; continue independent work while awaiting an answer.
- Retain completed work, constraints, and authorization across follow-up turns. Incorporate corrections and answer side questions without abandoning the task unless the user cancels or replaces it.
- Prepare the authorized, reviewable result before requesting any still-needed approval. Do not ask again for actions already authorized within the task scope.
- Keep changes within the requested outcome. Updating affected consumers is in scope when required to preserve consistency; report unrelated issues instead of fixing them.
- Keep changes surgical and inspect the final diff for unintended edits.
- When permitted by the task and available tools, delegate independent subtasks where parallel work helps. Keep simple or dependent work local, and integrate delegated results before claiming completion.

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

- Test observable behavior rather than implementation details; identify the concrete regression each test would catch.
- Do not write tests that merely read source, schema, configuration, or generated files and repeat their declarations as assertions, such as field names, required arguments, directives, or copied snippets. Use existing static validation and build checks for those concerns.
- Exercise the production behavior under test. Do not replace it with a mock or test-only implementation, such as a resolver that echoes its inputs, and claim to verify authorization, integration, or other behavior that never runs. Mock external boundaries instead.
- Add or update regression tests at the appropriate level when behavior changes. Follow coverage thresholds configured by the affected package.
- Prefer targeted, non-watch tests. Do not run root `yarn test` or a workspace's `test-ci` locally unless explicitly requested; they run CI coverage suites. Invoke the affected Jest or Vitest tests directly instead.
- Run the relevant formatting, lint, type-check, test, build, and end-to-end checks in proportion to the change and available tooling.
- For documentation-only edits, verify formatting and content rather than adding runtime tests.
- Once relevant checks pass, repeat or expand verification only for a new change, failure, required gate, or unresolved concern.
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

- Lead with the outcome and explain changes, validation, and remaining gaps in plain language. Prefer concise paragraphs; use lists when they make parallel information easier to scan.
- Keep progress updates focused on findings, decisions, and blockers. State technical details only when they help the user understand or assess the work.

## Agent skills

- Explicit user requirements take precedence over skill guidance. Apply each instruction only to the work it covers; do not infer extra approval steps from a skill.
- If a skill blocks progress or changes the requested scope, link the exact `SKILL.md`, quote the relevant instruction, and explain how it applies. Distinguish an explicit requirement from your interpretation.

### Issue tracker

Issues and PRDs are tracked in GitHub Issues for `motech-development/platform`. See `docs/agents/issue-tracker.md`.

### Domain docs

Domain documentation uses a multi-context layout indexed by `CONTEXT-MAP.md`. See `docs/agents/domain.md`.

### Platform delivery

Deployment workflows are generated from a catalog and reconcile exact Release tags. Before changing applications, infrastructure dependencies, releases, previews, or delivery workflows, see `docs/agents/platform-delivery.md`.
