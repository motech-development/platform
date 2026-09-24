# Continue until the PR is ready

This is the outer loop around the parallel local reviewers. Preserve the user's
scope and existing commit, push, and bot-interaction authorization. Do not ask
again for authorized actions. Do not merge, buy reviews, bypass checks, or change
review/analysis policy to make the completion conditions appear satisfied.

Hosted remediation is a complete-batch gate. For the recorded head, wait for all
expected exact-head reviewers to deliver a terminal feedback result, plus Sonar
analysis and relevant CI, before editing or publishing by default. A terminal
CodeRabbit review may request changes or comment without approving; its
`APPROVED` state is a later completion gate that can depend on thread cleanup.
A pending reviewer or quality gate is not a partial batch that can be fixed
opportunistically. The user may request a narrower operation, but record it as an
exception and retain the missing coverage.

The main skill's credit-consent exception also applies here: once CodeRabbit is
skipped for this loop, do not submit more reviews or wait for its approval. Keep
handling feedback already received, complete Codex, Sonar, and required CI, and
report any missing CLI or hosted CodeRabbit coverage at the end. This does not
bypass repository checks or authorize automatic overage charges.

## Establish completion evidence

Record the PR's current head, expected workflows/checks, actual bot identities,
and Sonar project/PR analysis before waiting. Refresh those expectations if the
change affects workflow selection. Every result must apply to the current head:

- **Task scope:** the cumulative implementation maps to the original outcome and
  explicit user amendments in the scope record. No unresolved scope drift remains;
  reviewer approval and green checks cannot substitute for this check.
- **Codex:** completed native review coverage through the final source snapshot,
  with no unresolved actionable findings. Also collect and assess the completed
  hosted Codex review when the repository uses it. No comment is not proof that
  a hosted review ran; use its completion evidence. A local review is not a
  replacement for a pending hosted review. Preserve reactions-only handling of
  Codex findings unless text replies were requested.
- **CodeRabbit (unless the credit-consent skip is recorded):** completed CLI
  coverage and a GitHub review with state
  `APPROVED` from the verified CodeRabbit account for the current head commit.
  Inspect newer reviews and follow-ups for outstanding objections. A successful
  check, resolved threads, or an approval on an older commit is insufficient.
- **Sonar:** a finished analysis attributable to the current PR revision, passing
  quality gate, and **zero unresolved PR issues across all severities**. Query the
  actual PR issue list with pagination, not merely the quality gate or new-code
  rating. Use the configured Sonar API/connector and current API documentation;
  keep tokens out of logs. Check applicable hotspot/security review conditions
  too, requiring zero unreviewed security hotspots for the current head. An empty
  stale scan, unavailable issue API, or missing scan is not success.
  Do not suppress rules or dismiss a valid issue merely to make the count zero.
- **Pipelines:** expected required workflows/checks completed successfully for
  this revision. Query branch protection to derive required checks and distinguish
  optional statuses. Account for workflows whose jobs register late before
  deciding that the batch is complete. A pending optional status, such as a plan
  limited visual check, is reported separately and does not block required CI;
  a pending or failed required check does. Verify PR merge-test commit association
  where applicable rather than assuming every Actions run uses the head SHA.
  Investigate other relevant failures; do not fix unrelated problems or silently
  waive required checks.
- **Bot cleanup:** after the remote fix and its validation, re-read the head and
  handled bot threads, perform the authorized reactions and eligible resolutions,
  and re-read each mutation. The final verification must report zero unresolved
  bot review threads. Eligible handled threads must be cleaned up; still-valid,
  actionable, disputed, or out-of-scope bot threads remain open and block a clean
  result. A human thread is reported separately; do not claim completion while a
  bot thread remains unresolved.

The repository currently enables `reviews.request_changes_workflow`. CodeRabbit
[documents automatic approval](https://docs.coderabbit.ai/reference/configuration)
after its comments are resolved, the latest commit is reviewed, and pre-merge
checks are satisfied. Verify this configuration in the target repository; do not
change it as part of routine review handling. Draft status, path exclusions, or a
missing integration can prevent a review. Report those conditions instead of
waiting forever or counting a skipped review as approval.

## Run the outer loop

1. Record the current head, expected exact-head hosted reviewers, Sonar project,
   branch-protection required checks, optional statuses, and a finite hosted wait
   deadline. If this is a published head, wait for the complete batch before
   editing. The initial local implementation exception still requires a concrete
   delta before local review.
2. Fetch the complete batch: full review bodies and collapsed CodeRabbit sections,
   hosted Codex evidence, CI failure details, Sonar PR issues and hotspots, and
   late-registered checks. Deduplicate findings by behavior theme against the
   durable ledger. Do not triage or fix from a partial reviewer batch.
3. Triage the complete batch against the recorded contract and scope. For a valid
   in-scope finding, record its trace and delegate the bounded fix. Validate the
   combined changes, then freeze the new delta and run the entire local loop in
   [local-loop.md](local-loop.md). Check the cumulative scope and remaining
   publication budget before any push. Check CodeRabbit's billing mode before a
   CLI review or a push that triggers automatic review.
4. After both local reviewers are complete and clear, publish only when separate
   push/commit authorization exists. Re-read the remote head and handled bot
   threads, then perform eligible authorized reactions and resolutions before
   waiting for the subsequent CodeRabbit approval. The complete feedback batch
   has already been triaged; this approval is a later completion gate that may
   depend on the cleanup just performed. Do not request duplicate reviews for
   a revision already queued, running, or reviewed. If a needed review did not
   start, diagnose the trigger and use one supported incremental request only when
   bot messages are authorized; never trigger paid, forced, or full review merely
   to escape a wait.
5. Wait for the newly published head's complete hosted batch using the bounded
   procedure below. If there are no source changes, retain local coverage and wait
   for outstanding approval or analysis; do not rerun unchanged local reviews.
   For one unrelated failed required job, inspect its logs and permit one
   evidence-backed rerun without changing source. A source-neutral rerun does not
   restart local semantic review; if it fails again, report the required check.
6. If the complete batch has new valid in-scope findings, return to step 3 and
   consume one remediation publication allowance after the local gate. If the
   finite allowance is exhausted, stop and request the user's explicit choice of
   simplify/redesign, document a limitation, or approve a new budget. Re-read the
   head, review state, checks, Sonar data, and relevant threads before declaring
   completion. A concurrent push invalidates affected evidence; reconcile it
   without overwriting another contributor's work.

## Bounded hosted-review wait

Set and record a finite deadline before waiting for automatic bot reviews or
analysis. The default is a one-hour observation window per exact-head hosted
batch; a user-authorized workflow may record a different finite deadline. The
window must include late check registration and the expected bot completion
signals. At expiry, inspect the current head and status once, then pause rather
than polling indefinitely. Ask for an explicit extension or waiver if the
reviewer never reports. A waiver is recorded as missing hosted coverage and the
loop ends with an incomplete report; it is never described as approval or clean
evidence.

Healthy progress inside the window may use the measured timer below. A reported
service cooldown has its own deadline and does not silently extend this batch
budget. Preserve the evidence and deadline across task wakeups.

## Adaptive waiting without model polling

Run [wait-for-pipelines.py](../scripts/wait-for-pipelines.py) as one tracked
asynchronous process, using the recorded trusted skill directory (never the
less-trusted PR copy) and a scratch state file:

```sh
python3 "$skill_dir/scripts/wait-for-pipelines.py" \
  --repo "$review_repo" --pr "$review_pr" --head "$review_head" \
  --state-file "$wait_state_file"
```

It uses read-only GitHub CLI calls. It measures up to ten recent successful first-attempt runs
per relevant workflow and event from a bounded history sample. The estimate is
the arithmetic mean of creation-to-completion duration for first attempts,
including queue time, and a separate start-to-completion mean for active reruns;
later attempts are excluded because their timestamps can include idle time before a rerun.
GitHub's `updatedAt` is an approximation of completion. It reads each pending
workflow run's timestamps and attempt once per poll, sharing the lookup across jobs. First attempts use creation time,
including queue time; active reruns use the current attempt's `startedAt` to avoid
counting the idle gap since original creation. Reruns use only the runtime mean,
so historical queue delays are not added again; missing runtime samples use the
normal bounded backoff. Both means retain their sample counts. Estimates add a 20% margin. Concurrent workflows contribute their longest remaining
estimate, not a sum. Unknown timings start at two minutes. Overruns back off from
two to fifteen minutes; the initial sleep is also capped at fifteen minutes.

The process checks GitHub and sleeps without invoking a model. It writes its
averages, sample counts, pending checks, next wake time, and terminal reason to
the state file. It prints only startup and terminal events. Use tool completion
notifications where supported, with bounded tool yields; preserve the session ID
and keep cancellation available. Do not restart the process or re-read unchanged
logs every few seconds. Host-required status updates or model resumptions still
consume usage; never promise zero total usage.

If the state file cannot be saved, the terminal event still reports the outcome
and persistence error; retain that event instead of assuming a saved checkpoint.

The helper returns when observed checks settle, a check fails, the head changes,
the PR closes, the API fails, or the recorded observation window expires. **Its
result is not the PR completion verdict.** Confirm expected workflows, hosted
review, Sonar, and thread conditions above. A missing check remains missing, not
passed. At the finite deadline, inspect once and use the explicit extension or
waiver path; do not turn a healthy but silent reviewer into an unbounded wait.
The window is checked around each API call and before sleeping. An in-flight call
may finish after the deadline, but the helper will not start another call or
interpret that late response as completion; individual calls time out after 60
seconds.

When only a hosted review or Sonar analysis remains, use its running status or
reported retry deadline and the same timer approach. Prefer a deterministic
status watcher with a completion event when available. Otherwise use a sparse
timed recheck, retaining previous observations rather than repeating analysis.
For CodeRabbit rate limits, the server's deadline takes precedence over pipeline
averages. Reuse timing history within a head; refresh it for the next pushed head.

If the app cannot keep the active task attached to the wait, checkpoint the PR,
head, findings, log paths, and deadline, and use its supported task wakeup feature
within the user's authorization to continue later. Prefer a single wake near the
estimated completion time over frequent model-driven monitoring; disable the
wakeup when this loop completes or is cancelled. Follow the scheduling tool's
capabilities rather than inventing a cron workaround. A detached sleeping process
alone cannot wake an ended model task, and local execution may pause when the
computer sleeps or goes offline; explain that limitation if it affects the run.

## Stop honestly

Wait through healthy slow runs and free cooldowns within the recorded finite
deadline. If the expected reviewer never reports, request an explicit extension
or waiver and record any waiver as missing coverage. Skip CodeRabbit on credit
consent and continue the remaining loop under the main skill's exception. Stop
and report a concrete blocker for missing authorization/access, a required scope
decision, an unavailable review integration, or repeated non-actionable feedback
with no new evidence. Do not create a cycle of identical pushes, review requests,
or rejected suggestions. Do not resolve a valid thread simply to obtain approval.
Respect cancellation, the remediation-publication budget, and all explicit
budgets. Summarize the final head and evidence for each completion condition, or
the exact condition that remains blocked.

GitHub command contracts: [PR checks](https://cli.github.com/manual/gh_pr_checks)
and [workflow history](https://cli.github.com/manual/gh_run_list).
