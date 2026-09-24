# Review-loop regression scenarios

Use this document as a reproducible manual dry-run protocol when changing the
`pr-review-loop` skill. It exercises workflow decisions through recorded GitHub,
CodeRabbit, Sonar, and CI responses; it does not send messages, mutate threads,
push commits, spend review credits, or require a live PR.

## Dry-run setup

Run each scenario from a fresh temporary directory outside the PR checkout.
Load the trusted skill copy and this document into that directory, and use a
recording adapter for GitHub, CodeRabbit, Sonar, and CI calls. The adapter must:

1. return the fixture responses below;
2. record each read and attempted mutation with its head, thread, actor, and
   arguments;
3. reject any call not explicitly allowed by the current scenario; and
4. keep a ledger snapshot after each phase.

Use no host credentials and deny network writes. Simulate an authorized mutation
by returning the documented post-mutation state from the adapter. Reset the call
log and ledger before each scenario. Record this evidence for every run:

```text
phase, head, event, actor, target, arguments, result, ledger change, mutation count
```

A scenario passes only when its recorded event order, blocked operations, ledger
state, and final status match the pass condition. A final sentence that merely
contains the expected words is not a passing result.

## Shared fixture

Seed every run with this ledger and remote state:

```text
request: explicit "$pr-review-loop" invocation
narrowing: none
head: A
contract: controlled and uncontrolled values are supported; custom values are excluded
authorization: reactions/resolutions=default, CodeRabbit rejection explanations=default,
               other text replies=no, push/commit=no, metadata=no
budget: initial=1, remediation_republishes=2, used=0
matrix: loading-defaults=supported, unavailable=excluded, form-reset=supported,
        autofill=unresolved, disabled=supported, read-only=supported
reviews[A]: Codex=COMMENTED, CodeRabbit=CHANGES_REQUESTED (terminal feedback)
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
2. Simulate a verified remote fix on head `B` for `T-fixed`.
3. Read the head and all paginated bot threads. Apply the Codex reaction to
   `T-fixed`, resolve it, and read the head and thread after each mutation.
4. Record conclusive rejection evidence for `T-rejected`, post its required
   evidence-backed explanation with a top-level `@coderabbitai` tag (or the
   supported inline mechanism), confirm the post, then resolve the thread and
   read it after the mutation.
5. Leave `T-outdated-actionable`, `T-out-of-scope`, and `T-human` unchanged.
6. Perform the final paginated thread read. Repeat the `T-rejected` branch with
   the explanation post returning a failure, and verify that the thread remains
   open and the failure is reported.

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

1. Reset to a concrete frozen delta and run CodeRabbit in the credentialless
   sandbox adapter. Return a sanitized authentication or missing-session error.
2. Record the environment and perform exactly one normal outside-sandbox retry.
3. For the primary run, return a successful authenticated review from the host.
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
   remote head `B`, clean eligible handled threads, and only then return
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

1. Reset with a hosted finding but no local implementation delta. Invoke the local
   gate and record the attempted reviewers.
2. Apply and validate a concrete delta in `src/Select.tsx` and
   `src/Select.test.tsx`, freeze its file snapshot, then launch native Codex and
   CodeRabbit concurrently.
3. Return a CodeRabbit result with `reviewType=uncommitted` and exactly those
   `reviewedFiles`. Repeat once with a whole-branch result and once with an extra
   file, then correct the selector and return the exact result.
4. Run a formatter-only hook change with an unchanged semantic snapshot and
   passing formatter, lint, tests, and hooks.

**Evidence**

Record the frozen file hashes, reviewer launch order, CodeRabbit command flags,
emitted `reviewType`, emitted file set, discarded results, and static checks.

**Pass if** no local review starts before a concrete delta; incremental tracked
reviews use `--uncommitted`; `--include-untracked` appears only for an untracked
file; mismatched results are discarded before triage; both reviewers launch after
the corrected freeze; and formatter-only output reuses semantic coverage.

**Fail if** reconnaissance review runs, the whole branch is accepted as an
incremental result, a wrong file set is triaged, or formatter-only output starts
another semantic review after all static checks pass.

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

1. Reset to head `B` with a green quality gate but one unresolved Sonar issue or
   one unreviewed hotspot in the paginated data.
2. Attempt completion, then return zero Sonar issues and hotspots.
3. Leave one valid bot thread open and perform the final head/thread read.
4. Resolve the eligible handled thread, re-read before and after the mutation,
   and perform the final paginated bot-thread read.

**Evidence**

Record the Sonar issue and hotspot pages, quality-gate result, head at each read,
thread mutation responses, and counts of all unresolved bot threads.

**Pass if** the green summary does not hide unresolved Sonar data; the first
completion attempt is blocked; each thread mutation is confirmed; and completion
is blocked until the final count of all unresolved bot threads is zero.

**Fail if** a green quality gate substitutes for the issue/hotspot lists, an
unresolved bot thread is excluded because it is out of scope or outdated, or the
workflow claims clean before the final zero count.
