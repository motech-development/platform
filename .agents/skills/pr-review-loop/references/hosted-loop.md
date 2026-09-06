# Continue until the PR is ready

This is the outer loop around the parallel local reviewers. Preserve the user's
scope and existing commit, push, and bot-interaction authorization. Do not ask
again for authorized actions. Do not merge, buy reviews, bypass checks, or change
review/analysis policy to make the completion conditions appear satisfied.

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
- **CodeRabbit:** completed CLI coverage and a GitHub review with state
  `APPROVED` from the verified CodeRabbit account for the current head commit.
  Inspect newer reviews and follow-ups for outstanding objections. A successful
  check, resolved threads, or an approval on an older commit is insufficient.
- **Sonar:** a finished analysis attributable to the current PR revision, passing
  quality gate, and **zero unresolved PR issues across all severities**. Query the
  actual PR issue list with pagination, not merely the quality gate or new-code
  rating. Use the configured Sonar API/connector and current API documentation;
  keep tokens out of logs. Check applicable hotspot/security review conditions
  too. An empty stale scan, unavailable issue API, or missing scan is not success.
  Do not suppress rules or dismiss a valid issue merely to make the count zero.
- **Pipelines:** expected required workflows/checks completed successfully for
  this revision. Verify PR merge-test commit association where applicable rather
  than assuming every Actions run uses the head SHA. Account for workflows whose
  jobs register later. Investigate other relevant failures; do not fix unrelated
  problems or silently waive required checks.

The repository currently enables `reviews.request_changes_workflow`. CodeRabbit
[documents automatic approval](https://docs.coderabbit.ai/reference/configuration)
after its comments are resolved, the latest commit is reviewed, and pre-merge
checks are satisfied. Verify this configuration in the target repository; do not
change it as part of routine review handling. Draft status, path exclusions, or a
missing integration can prevent a review. Report those conditions instead of
waiting forever or counting a skipped review as approval.

## Run the outer loop

1. Complete the **entire inner local loop**: run both reviewers in parallel, wait
   for both reports, assess and fix their combined findings, validate, and run
   both again on the new delta. Repeat until neither reports further actionable
   issues. Do not push merely because one round's findings have been fixed; those
   fixes must pass the next local round first. Check cumulative task scope before
   pushing the actual, verified change using existing authorization. Check the CodeRabbit organization's billing
   mode before any push that triggers automatic reviews, as well as before CLI
   reviews. Stop before paid work under the existing no-charge policy.
2. Record the pushed head and let configured pipelines and bot reviews start.
   Do not request duplicate reviews for a revision already queued, running, or
   reviewed. If a needed review did not start, diagnose the trigger and use one
   supported incremental request only when bot messages are authorized. Never
   trigger a paid, forced, or full review merely to escape a wait.
3. Wait for the current hosted review round and relevant pipelines. Use the helper
   below for GitHub checks. Read operational status during waits, but accumulate
   findings until the hosted reviewers have finished before making the next
   code changes. Failures requiring intervention may return early for diagnosis;
   that does not authorize applying a partial set of review fixes.
4. Fetch new comments, full review summaries including collapsed CodeRabbit
   nitpicks/out-of-diff sections, CI failure evidence, and the completed Sonar PR
   analysis. Deduplicate against the retained record. Resolve eligible fixed,
   rejected, and obsolete threads using [thread-resolution.md](thread-resolution.md).
   Do this before waiting for CodeRabbit approval: approval may depend on closure.
5. If valid in-scope work remains, fix the collected batch and return to step 1's
   entire inner local loop, with incremental review deltas. Push only after both
   local reviewers are clear again. If no source changes are needed, retain the
   local reviews and wait for outstanding approval/analysis; do not rerun them.
6. Re-read the head, review state, checks, Sonar analysis, and relevant threads,
   and reconcile the final cumulative changes with the scope record before
   declaring completion. A concurrent push invalidates affected evidence;
   reconcile it without overwriting another contributor's work.

## Adaptive waiting without model polling

Run [wait-for-pipelines.py](../scripts/wait-for-pipelines.py) as one tracked
asynchronous process, using an absolute skill path and a scratch state file:

```sh
python3 "$skill_dir/scripts/wait-for-pipelines.py" \
  --repo "$review_repo" --pr "$review_pr" --head "$review_head" \
  --state-file "$wait_state_file"
```

It uses read-only GitHub CLI calls. It measures up to ten recent successful runs
per relevant workflow and event from a bounded history sample. The estimate is
the arithmetic mean of creation-to-completion duration, including queue time;
GitHub's `updatedAt` is an approximation of completion. It subtracts elapsed time
and adds a 20% margin. Concurrent workflows contribute their longest remaining
estimate, not a sum. Unknown timings start at two minutes. Overruns back off from
two to fifteen minutes; the initial sleep is also capped at fifteen minutes.

The process checks GitHub and sleeps without invoking a model. It writes its
averages, sample counts, pending checks, next wake time, and terminal reason to
the state file. It prints only startup and terminal events. Use tool completion
notifications where supported, with bounded tool yields; preserve the session ID
and keep cancellation available. Do not restart the process or re-read unchanged
logs every few seconds. Host-required status updates or model resumptions still
consume usage; never promise zero total usage.

The helper returns when observed checks settle, a check fails, the head changes,
the PR closes, the API fails, or the observation window expires. **Its result is
not the PR completion verdict.** Confirm expected workflows and all review/Sonar
conditions above. A missing check remains missing, not passed. The one-hour
observation window is a point for inspecting a stalled or slow run, not a reason
to fail a healthy pipeline; resume waiting when evidence shows useful progress.

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

Wait through healthy slow runs and explicit cooldowns. Stop and report a concrete
blocker for paid continuation, missing authorization/access, a required scope
decision, an unavailable review integration, or repeated non-actionable feedback
with no new evidence. Do not create a cycle of identical pushes, review requests,
or rejected suggestions. Do not resolve a valid thread simply to obtain approval.
Respect cancellation and explicit budgets. Summarize the final head and evidence
for each completion condition, or the exact condition that remains blocked.

GitHub command contracts: [PR checks](https://cli.github.com/manual/gh_pr_checks)
and [workflow history](https://cli.github.com/manual/gh_run_list).
