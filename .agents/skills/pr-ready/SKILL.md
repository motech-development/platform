---
name: pr-ready
description: Drive an existing pull request to merge-ready by iterating review findings, fixes, validation, commits, pushes, and current-head CI. Use when the user explicitly asks for end-to-end PR completion rather than a single review or diagnostic pass.
---

# PR Ready

Take one existing pull request from its current state to a verified merge-ready
state without requiring the user to prompt each routine transition.

This workflow is suitable for Goal mode. Do not create a goal unless the user
explicitly requests one. An explicit request to run `$pr-ready` authorizes the
routine repository and pull-request mutations described below for the named PR;
it does not authorize unrelated changes, destructive operations, paid actions,
or expansion beyond the PR's scope.

## Bind the contract

Before changing anything:

- Resolve the repository, PR, branch, worktree, current local HEAD, PR head, base,
  issue or specification, and affected package boundaries.
- Read the applicable repository instructions and inspect existing local changes.
  Preserve changes that are not known to belong to this workflow. If they overlap
  and ownership cannot be established safely, pause for the user.
- Record any PR-specific review rules, accepted exceptions, package restrictions,
  testing requirements, or paid-tool limits supplied by the user. Do not carry an
  exception from one PR into another.
- Treat the latest PR head as the fixed point for CI and review evidence. Ignore a
  failure only when evidence proves it belongs exclusively to an obsolete head.

The PR is merge-ready only when all of the following are true for the same pushed
head:

- all required checks have completed successfully;
- every in-scope bot finding has been classified and every valid finding fixed;
- handled Codex threads are resolved only after their fixes are present on the PR;
- the relevant local validation passes;
- the worktree is clean and local HEAD matches its upstream;
- a final refresh finds no newer actionable review or CI result.

Draft state, approvals, labels, merge queues, and issue closure wording remain as
requested by the user or existing PR contract; do not change them by assumption.

## Review findings

Audit review threads, review bodies, and current check annotations. Include
CodeRabbit findings outside the current diff, but distinguish them from findings
on changed lines. Deduplicate findings by stable comment or annotation identity.

Verify each claim against the PR contract and current source before acting:

- **Codex:** fix valid findings and react with 👍 after the fix is validated. React
  to invalid findings with 👎 only; do not reply.
- **CodeRabbit:** fix valid findings without replying. Reply to invalid inline
  findings with concise, evidence-based reasoning. Inspect outside-diff findings,
  but do not reply to them unless the user explicitly requests replies.
- **Other bots and static analysis:** apply the user's PR-specific exceptions,
  reproduce the underlying issue where feasible, and fix only claims necessary to
  meet the PR contract. Do not make cosmetic rewrites merely to silence tooling.

Do not manually resolve review threads before the fix is committed, pushed, and
confirmed as the PR head. After that confirmation, resolve only handled Codex
threads unless the user explicitly authorizes another bot's resolution workflow.

If a review tool or CLI requests additional payment, stop using that paid path and
report it. Continue with available review evidence where that can be done safely.

## Fix and validate

For each actionable batch:

1. Establish expected behavior and reproduce the defect when feasible.
2. Make the smallest durable in-scope fix, reusing established abstractions and
   avoiding unrelated code or UI changes.
3. Add regression coverage at the layer that observes the failure. For UI claims,
   verify rendered behavior when unit assertions cannot prove the user-visible
   contract.
4. Run targeted checks while iterating, then the complete relevant package or
   application validation before committing. Do not claim unrun checks passed.
5. Review the resulting diff for unintended changes and scope drift.

Do not fix a genuine issue outside the PR's authorized package boundaries. Report
it as follow-up work, and create a separate issue or PR only when the user has
authorized that external mutation.

## Commit, push, and observe

Once a batch is validated:

- stage only files belonging to the batch;
- commit with a Conventional Commit message without skipping hooks;
- push the PR branch;
- confirm the remote PR head equals the pushed commit;
- apply the permitted thread resolutions;
- wait for required checks and review bots on that head.

When CI fails, inspect the failing job and logs, reproduce it locally when
feasible, and form a falsifiable root-cause hypothesis before editing code. Do not
repeat a failed fix without new evidence. Rerun a job without a code change only
when the evidence identifies a transient or infrastructure failure and the
workflow is authorized to rerun it.

When new findings or failures arrive, repeat from review classification. Keep the
user informed during long waits, but do not hand routine review, commit, push, or
CI transitions back to them.

## Pause conditions

Pause and ask for direction only when progress requires:

- new credentials, permissions, or approval not already granted;
- a paid action;
- a destructive or difficult-to-recover operation;
- a material product, architecture, or scope decision;
- changes outside the authorized PR boundary;
- distinguishing overlapping local changes whose ownership is unclear.

Do not treat slow CI, a new valid review finding, or another necessary fix cycle as
a reason to stop.

## Completion report

Report the final PR URL and head, checks and validation that passed, review actions
taken, and any rejected or externally blocked claims that remain relevant. Do not
report the PR as merge-ready while any completion condition above is unproven.
