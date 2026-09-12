---
name: implement
description: 'Implement a piece of work based on a spec or set of tickets.'
disable-model-invocation: true
---

# Implementation Orchestration

Act as the main chat orchestrator for the requested implementation. Establish
the requirements, affected paths, acceptance criteria, exclusions, and the
smallest useful validation plan before delegating work.

Delegate each bounded implementation and test assignment to an `implementer`
agent configured as `gpt-5.6-luna` with `max` reasoning effort. Independent
assignments may run in parallel when their paths and responsibilities do not
overlap. Give each agent the relevant specification, repository guidance, paths,
seams, and targeted checks. Use `/tdd` where possible at pre-agreed seams. An
implementer may edit the assigned code and tests and run the assigned checks,
but must not expand the scope, delegate further, commit, push, or start a
review loop. Have each one return a concise report of changes, validation, and
unresolved issues.

Inspect the implementer's result and orchestrate `/code-review` against the
exact final delta. If the review reports valid in-scope findings, send the
implementer a bounded fix request, then inspect the new delta, reuse its passing
targeted checks, rerun only checks required by the new edits or repository gate,
and review it again. Keep ownership of scope, triage, integration, validation,
and the overall workflow in the main orchestrator.

Use repository-targeted validation: select the narrowest meaningful affected
tests and proportionate formatting, lint, type-check, build, or end-to-end
checks from the repository's scripts and guidance. The parent may reuse passing
checks reported by the implementer and should rerun them only after a relevant
change, failure, or required gate. Run broader checks only when the changed
dependency surface or repository gate requires them. Do not run a blanket
full-repository suite by default.

When implementation and review are clear, inspect the final diff and commit the
integrated result on the current branch with a Conventional Commit message.
