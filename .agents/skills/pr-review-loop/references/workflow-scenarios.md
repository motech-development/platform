# Review-loop regression scenarios

Use this document as a reproducible manual dry-run protocol when changing the
`pr-review-loop` skill. It does not require a live PR, host credentials, a test
adapter, network calls, messages, thread mutations, pushes, or review credits.
Use the fixtures below as simulated responses and complete the worksheet by hand
for each scenario.

## Dry-run setup

For each scenario, start with a fresh copy of the shared fixture and worksheet.
Follow its steps in order. Treat each explicitly simulated response as the
service result, record every read or attempted action, and update the worksheet
state only when that step specifies the resulting state. Do not make live API or
CLI calls. The worksheet is:

```text
scenario:
request and narrowing:
head and frozen paths:
authorization and spend state:
review/check/thread state before:
phase, head, event, actor, target/paths, arguments, simulated result,
  ledger/state change, mutation count
review/check/thread state after:
expected status and unmet gates:
```

A scenario passes only when the worksheet records the expected event order,
allowed and blocked actions, ledger and fixture state, and final status stated in
its pass condition. A final sentence that merely contains the expected words is
not a passing result.

## Shared fixture

Seed every run with this ledger and remote state:

```text
request: explicit "$pr-review-loop" invocation
narrowing: none
head: A
contract: controlled and uncontrolled values are supported; custom values are excluded
authorization: local reviews=bounded frozen delta, no-charge, no repeat prompt;
               reactions/resolutions=default, CodeRabbit rejection explanations=default,
               manual hosted Codex comment=no, other text replies=no,
               push/commit=no, metadata=no
budget: initial=1, remediation_republishes=2, used=1
matrix: controlled/uncontrolled=supported, loading-defaults=supported,
        unavailable=excluded, custom-values=excluded,
        form-submit-reset=supported, late-mounted-form=unresolved,
        autofill-replacement=unresolved, disabled=supported, read-only=supported
reviews[A]: Codex=COMMENTED (hosted_review_commit=A),
            CodeRabbit=CHANGES_REQUESTED (terminal feedback)
sonar[A]: quality_gate=passed, issues=0, unreviewed_hotspots=0
checks[A]: Tests=passed (required), Lint=passed (required), Chromatic=pending (optional)
```

The review-thread fixture contains:

```text
T-fixed: Codex, open, current, accepted finding, viewerCanResolve=true
T-rejected: CodeRabbit, open, current, conclusively rejected finding, viewerCanResolve=true
T-outdated-actionable: CodeRabbit, open, outdated, valid follow-up, viewerCanResolve=true
T-out-of-scope: Codex, open, current, valid but excluded contract, viewerCanResolve=true
T-human: human reviewer, open, current, viewerCanResolve=true
```

The complete feedback batch is a terminal `COMMENTED`, `CHANGES_REQUESTED`, or
`APPROVED` result for every expected reviewer plus completed Sonar and relevant
CI. CodeRabbit `APPROVED` is intentionally absent in this fixture until cleanup;
it is a later completion gate.

## 1. Default full-loop authorization and cleanup

**Steps**

1. Start from the shared fixture and keep the request un-narrowed.
2. Simulate a verified remote fix on head `B` for `T-fixed` and increment
   `budget.used` from 1 to 2.
3. Read the head and all paginated bot threads. Apply the Codex reaction to
   `T-fixed`, resolve it, and read the head and thread after each mutation.
4. Record conclusive rejection evidence for `T-rejected`, post its required
   evidence-backed explanation with a top-level `@coderabbitai` tag (or the
   supported inline mechanism), confirm the post, then resolve the thread and
   read it after the mutation.
5. Leave `T-outdated-actionable`, `T-out-of-scope`, and `T-human` unchanged.
6. Perform the final paginated thread read. Repeat the `T-rejected` branch with
   a fresh reset of the shared fixture, event log, and ledger, with the
   explanation post returning a failure; verify that the thread remains open and
   the failure is reported.

**Evidence**

Record the invocation classification, reaction, explanation, and resolution
calls, before and after reads, the final bot-thread count, and attempted
CodeRabbit-reaction, unrelated-text, push, commit, and metadata calls. In the
failure variant, record the post failure and the absence of a resolution.

**Pass if** the bare explicit invocation is classified as full-loop; `T-fixed`
gets its permitted reaction and resolution; `T-rejected` gets exactly one
evidence-backed explanation through the supported mechanism before resolution;
no CodeRabbit reaction, unrelated text, push, commit, or metadata mutation is
attempted; and the final report is incomplete with two unresolved bot threads and
one unresolved human thread. The failure variant leaves `T-rejected` open and
reports the posting failure. The report names the current actionable,
out-of-scope, and outdated threads rather than calling them clean.

**Fail if** cleanup authorization is requested again, any non-Codex reaction or
unrelated text reply is sent, `T-rejected` is resolved without a confirmed
explanation, a failed explanation post is followed by resolution, a human thread
is changed, `isOutdated` alone resolves `T-outdated-actionable`, or the result
claims completion with unresolved bot threads.

## 2. Explicitly narrowed request

**Steps**

1. Replace `narrowing` with `code fixes only` and reset the fixture.
2. Repeat the reads from scenario 1 without changing the remote state.

**Evidence**

Record the narrowing in the ledger and every attempted mutation.

**Pass if** reads and classification occur, no reaction, CodeRabbit rejection
explanation, or resolution mutation is attempted, and the report identifies the
missing cleanup authorization without claiming a clean full loop. Push, commit,
metadata, and other text remain blocked.

**Fail if** the default full-loop authorization overrides the explicit code-fixes-
only narrowing or any bot mutation is attempted.

## 3. Sandbox-only CodeRabbit authentication

**Steps**

1. Reset to a concrete frozen delta. Record a CodeRabbit attempt in the
   credentialless sandbox and enter a sanitized authentication or missing-session
   error as its simulated result.
2. Record the environment and exactly one normal outside-sandbox retry, with its
   simulated host result.
3. In a separate reset, record a successful authenticated primary review from
   the host.
4. Repeat in separate reset runs with a host authentication failure and with a
   host service failure.

**Evidence**

Record the two environments, sanitized diagnostics, retry count, final
classification, and review result. Do not record credentials.

**Pass if** the primary run records `sandbox_isolation` and uses the host review;
the host-auth run records genuine `host_authentication`; the service run records
an access/service blocker; and each sandbox-auth case has exactly one escalation
retry.

**Fail if** the sandbox error is reported as account unauthentication before the
retry, a second escalation is attempted, or credentials are copied into the
sandbox.

## 4. Complete feedback batch before triage, approval afterward

**Steps**

1. Reset to head `A` and return `CodeRabbit=CHANGES_REQUESTED` as a terminal
   result, `Codex=COMMENTED` as a terminal result, completed Sonar, and required
   checks. Keep optional `Chromatic` pending.
2. Run the hosted wait. Then fetch full review bodies, Sonar issue/hotspot data,
   and required check results together.
3. Before all reviewer results arrive, run a second reset with CodeRabbit pending;
   attempt triage and an edit.
4. In the first run, triage the complete feedback, simulate a validated fix and
   remote head `B` (increment `budget.used` from 1 to 2), clean eligible handled
   threads, and only then return
   CodeRabbit `APPROVED` for head `B`.

**Evidence**

Record the status transition, head associated with each result, fetch order,
optional versus required check classification, cleanup time, and CodeRabbit
approval time.

**Pass if** the pending run makes no edit or publication; the terminal feedback
run permits triage after all expected results and required gates are present;
optional pending status is reported separately; cleanup occurs after the fix is
remote and validated; and `APPROVED` is accepted only as the subsequent
completion gate after cleanup.

**Fail if** a partial batch is triaged, a pending reviewer is ignored, an optional
status blocks required CI, approval is required before triage, or cleanup waits
until after approval when approval depends on cleanup.

## 5. Concrete delta and incremental review scope

**Steps**

1. Reset with no hosted findings, no prior local review coverage, and no
   implementation delta. Invoke the local gate and record the attempted
   reviewers.
2. Apply and validate the concrete user-requested delta in `src/Select.tsx` and
   `src/Select.test.tsx`, with no hosted findings and no prior local coverage;
   freeze its file snapshot, then launch native Codex and CodeRabbit concurrently.
3. Return a CodeRabbit result with `reviewType=uncommitted` and exactly those
   `reviewedFiles`. Repeat once with a whole-branch result and once with an extra
   file, then correct the selector and return the exact result.
4. Run a formatter-only hook change with an unchanged semantic snapshot and
   passing formatter, lint, tests, and hooks.
5. Repeat the local CLI review with frozen paths `.codex/config.toml` and
   `.agents/skills/pr-review-loop/SKILL.md`; return both in `reviewedFiles`.
   Separately, simulate a hosted PR review that omits `.agents/**` because of
   `reviews.path_filters` in `.coderabbit.yaml`, and record that as missing
   hosted coverage.
6. Return a local CLI result with no reviewed files; record no local coverage,
   do not retry the same scope, and leave the combined local gate incomplete.

**Evidence**

Record the frozen file hashes, reviewer launch order, CodeRabbit command flags,
emitted `reviewType`, emitted file set, discarded results, and static checks.

**Pass if** no local review starts before a concrete delta; the concrete
user-requested delta receives its initial local review despite having no hosted
findings; incremental tracked reviews use `--uncommitted`; `--include-untracked`
appears only for an untracked file; mismatched results are discarded before
triage; both reviewers launch after the corrected freeze; formatter-only output
reuses semantic coverage; the local CLI covers both frozen paths in the variant;
and hosted `.agents/**` exclusion is recorded separately as missing hosted
coverage. A no-files CLI result leaves the local gate incomplete without a futile
retry.

**Fail if** reconnaissance review runs, the whole branch is accepted as an
incremental result, a wrong local file set is triaged, hosted path filters are
assumed to limit local CLI coverage, a no-files result is counted as success, or
formatter-only output starts another semantic review after all static checks
pass.

## 6. Ledger, contract, design, and budget stop

**Steps**

1. Add a finding about a dynamic off-list value that is a behavior-theme variant
   of an already rejected custom-value provenance finding.
2. Return a visual requirement phrased as “no native select”, with no evidence
   that an accessible native control is prohibited internally.
3. Simulate three consecutive rounds changing the same state reconciliation or
   form/event-order responsibility, including added bespoke state or dependency
   surface. Set `budget.used=3`.
4. Present the remaining finding and record the simplify/delete/revert decision
   point without applying a fourth source change.

**Evidence**

Record the behavior theme, contract trace, matrix cells, ambiguity classification,
complexity added per round, publication count, and design decision options.

**Pass if** the semantic variant is deduplicated; the visual requirement is not
turned into an unsupported implementation prohibition; all matrix cells are
recorded; a design reassessment occurs before another edit; and no fourth source
publication occurs. A source-neutral required-job rerun leaves the budget
unchanged.

**Fail if** a bot suggestion expands the contract without a trace, internal
library details become user-facing API requirements, repeated complexity triggers
another automatic patch, or the exhausted budget is ignored.

## 7. Sonar and final all-bot-thread evidence

**Steps**

1. Start from shared fixture head `A` with `budget.used=1`. Simulate a validated
   remote fix for `T-fixed` on head `B`, incrementing `budget.used` to 2. Return a
   green quality gate but one unresolved Sonar issue or one unreviewed hotspot
   in the paginated data.
2. Attempt completion, then return zero Sonar issues and hotspots.
3. Leave `T-fixed` open pending its authorized cleanup; keep the other shared
   fixture bot threads open and perform the final head/thread read.
4. Re-read head and `T-fixed` before each mutation, apply its permitted Codex
   reaction, resolve it, re-read after each mutation, and perform the final
   paginated bot-thread read.

**Evidence**

Record the Sonar issue and hotspot pages, quality-gate result, head at each read,
thread mutation responses, and counts of all unresolved bot threads. The final
count is three: `T-rejected`, `T-outdated-actionable`, and `T-out-of-scope` remain
open from the shared fixture.

**Pass if** the green summary does not hide unresolved Sonar data; the first
completion attempt is blocked; the already-fixed `T-fixed` thread becomes
eligible only after the validated remote fix and each cleanup mutation is
confirmed; and completion remains blocked with the final count of three
unresolved bot threads. A clean result requires a final count of zero.

**Fail if** a green quality gate substitutes for the issue/hotspot lists, an
unresolved bot thread is excluded because it is out of scope or outdated, or the
workflow claims clean before the final zero count.

## 8. Bounded local review authorization and automatic hosted Codex

**Steps**

1. Reset to the shared fixture. Set the frozen delta to
   `src/Select.tsx` and `src/Select.test.tsx`. Record native Codex and CodeRabbit
   local review submissions with exactly those paths and no charge. Record zero
   separate disclosure prompts.
2. Simulate an in-scope semantic fix in `src/Select.tsx`, freeze the new delta,
   and record both local reviewers covering only that delta without another
   permission prompt. In a separate reset, use a standalone request to
   "review these files" and record no external submission. Reset again with a
   request that expressly names native Codex and CodeRabbit and the frozen paths;
   record submissions only to those services and paths. The standalone request
   does not authorize later rounds, reactions, thread resolutions, other
   comments, push, commit, or metadata updates.
3. In a separate reset, make the CodeRabbit no-charge check return a credit or
   payment requirement. Record the CodeRabbit skip and missing coverage; do not
   use credits or authorize a charge. Native Codex coverage may continue under
   the skill's credit-consent exception.
4. In a separate reset, make the host or review service deny automatic approval
   for a bounded local review submission. Record the blocked submission and
   incomplete local gate; do not retry through another tool, service, or route.
5. Simulate the repository's automatic hosted Codex review arriving after a
   delay for head `A`, with its review commit set to `A`. Record exact-head hosted
   coverage. In a separate reset, let the finite deadline expire without a
   review, then record a prohibited manual `@codex review` comment as blocked and
   the hosted gate as incomplete. Repeat with a review associated with an older
   commit than the current head.

**Evidence**

Record each frozen path set and review target, local reviewer calls and charge
state, disclosure-prompt count, automatic hosted review commit and current head,
deadline, approval-denial result, blocked manual-comment attempt, and final
coverage status in the worksheet.

**Pass if** a full-loop invocation permits only in-scope frozen deltas, with no
repeat disclosure prompt within that task scope and no charge or credit used. A
standalone request to "review these files" does not by itself authorize external
submission; an explicit service-directed request is limited to its named services
and paths and does not authorize later rounds or bot/publication actions. A host
or service approval denial blocks the submission, leaves the local gate
incomplete, and is reported without an alternate-route retry.
The hosted Codex result counts only when its review commit matches the current
head; a delayed exact-head automatic review is accepted, while a missing or stale
review after the deadline leaves the hosted gate incomplete without a manual
comment. Push, commit, unrelated messages, and metadata remain unauthorized.

**Fail if** a permission prompt is repeated for an in-scope no-charge local
review round, files outside the frozen delta are submitted, a charge or credit is
used, an approval denial is bypassed, a manual `@codex review` comment is posted,
or missing/stale hosted coverage is called complete.
