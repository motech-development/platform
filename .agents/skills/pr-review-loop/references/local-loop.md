# Local review gate

Read before starting local review or fixing findings. The [main skill](../SKILL.md) credit-consent exception applies throughout.

## Fix, verify, review

This is an inner loop that must finish before any push: **review in parallel →
wait for both → assess and fix → validate → review in parallel again**. Repeat
until both local reviewers are clear. Handling one round's findings does not
complete this gate; every resulting fix must go through the next local round.

1. Capture the starting revision and affected paths. Make the smallest durable
   fix. For behavior changes, add a regression through the existing test setup
   and demonstrate the failure before the fix when practical. Do not introduce
   testing infrastructure merely to satisfy a review comment.
   On the first invocation, reuse recorded local review coverage when available.
   Otherwise review the requested change set once to establish that coverage,
   even if no feedback fix was needed; subsequent rounds cover only new edits.
2. Run the affected tests and proportionate formatting, lint, type, and build
   checks under `AGENTS.md`. Inspect the final diff. Do not repeat passing checks
   unless a new change, failure, or required gate justifies it.
   Tests must establish behavior or a regression; do not add tests that merely
   restate a style edit. The fixing agent owns validation, so neither reviewer
   needs to rerun the supplied passing checks.
3. Run **one native Codex review with `gpt-5.6-luna` at `low` effort and one
   CodeRabbit CLI review of the same new delta**. Follow
   [native-review.md](native-review.md) and
   [coderabbit-cli.md](coderabbit-cli.md). After preparing both inputs
   and checking the no-charge boundary, launch both tracked read-only processes
   **before waiting for either to finish**. Keep separate session IDs and logs.
   Do not run them serially or spawn substitute reviewer agents. If the available
   tools cannot run them concurrently, report the limitation instead of silently
   changing this requirement. Freeze the snapshot throughout the round, including
   any CodeRabbit cooldown. Provide validation and scope instructions through
   each tool's supported interface.
4. **Wait for both final reports before triaging findings or making any fixes
   from the round.** Operational checks for progress, failure, cooldown, or paid
   continuation are allowed while waiting. Store the faster reviewer's result;
   do not act on it or rerun it while the other is pending. Once both report,
   deduplicate their findings and triage by the same rules, including CodeRabbit
   nitpicks. Except for the credit-consent exception in [SKILL.md](../SKILL.md), a failed or blocked
   run leaves the combined gate incomplete; never treat the other reviewer's
   success as a substitute. If valid issues remain,
   fix them together, validate, and have both reviewers inspect only the edits
   since the preceding snapshot. Retain earlier coverage; do not restart against
   `main` or rerun the first reviewer just because the second is still waiting.
5. Finish the local round when both reviewers have completed coverage through
   the final snapshot and neither reports further actionable issues. Any fixes
   made from their reports, including minor or style fixes, return to validation
   and another parallel local review before publishing. A false positive rejected
   with evidence does not require an unchanged rerun; retain its disposition.

Do not repeat an unchanged review, spawn parallel full-PR reviews, or escalate
effort automatically. Honor any user-specified effort, time, or usage budget.
If the same blocker recurs without new evidence or the next fix requires a scope
decision, stop that loop and report the concrete unresolved issue. Do not call
it clean. Continue other authorized work; request only the missing decision.
A reported CodeRabbit cooldown with a retry deadline is a wait state, not a
failed review: use the reference's timer procedure and resume after the deadline.
A paid-review or credit-consent warning triggers the CodeRabbit skip in [SKILL.md](../SKILL.md);
continue the rest of the loop and disclose the missing review at completion.
