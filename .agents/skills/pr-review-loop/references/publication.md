# Publication and batch closure

Read before commits, pushes, bot interactions, thread resolution, or PR-body updates. The [main skill](../SKILL.md) credit-consent exception applies throughout.

## Publish and close the batch

Carry forward existing authorization for commits, pushes, reactions, and replies;
do not ask again for it. This skill does not itself grant permission to send
messages, push, merge, or deploy.

- **Do not push while the inner local review loop has pending reviews, unreviewed
  fixes, unresolved actionable findings, or an unresolved scope mismatch.** Once
  both local reviewers are clear and the cumulative scope check passes, and when
  authorized, commit with normal hooks and push the existing PR branch.
  For less-trusted PRs, follow [execution-isolation.md](execution-isolation.md)
  before committing or publishing.
  Compare the committed result with the reviewed snapshot after hooks; inspect
  and validate any substantive hook changes, then send that delta through both
  local reviewers in parallel before publishing. The committed snapshot must
  retain complete coverage from both reviewers.
  Check CodeRabbit's no-charge boundary before pushing when a push triggers its
  hosted review; automatic hosted overages are subject to the same spending ban.
- For authorized Codex feedback, use 👍 for accepted findings and 👎 for verified
  false positives. Use reactions only unless text replies were explicitly
  requested. Do not label an obsolete, previously valid finding a false positive.
- When CodeRabbit replies are authorized, reply only to findings you reject,
  explaining the concrete reason and supporting evidence. Do not post replies
  acknowledging accepted findings or announcing their fixes. For rejected
  findings embedded in the main review, identify the relevant section and file
  in the response so the disagreement is unambiguous. Preserve user-resolved
  threads. Do not request a new hosted review just because a bot suggests doing so.
- Resolve handled bot review threads as part of completing the batch, using
  [thread-resolution.md](thread-resolution.md). Do not leave routine
  resolution to the user or depend on Codex doing it automatically. Verify the
  pushed fix, or record conclusive rejection/obsolescence evidence, before
  resolving. Keep disputed findings and pending fixes open. If CodeRabbit has
  already resolved a thread, leave it alone; apply the same verification to any
  eligible bot threads that remain open. Preserve human reviewers' threads unless
  the user explicitly included them in this workflow.
- When PR-description edits are authorized and behavior, scope, or material
  validation changes, re-read the current body immediately before editing it.
  Apply a targeted update, preserving human-maintained content, the closing issue
  reference, and the current bot-owned summary. Reconcile concurrent changes
  instead of replacing the body with an older copy. Describe the final
  implementation, omitting abandoned approaches. Existing authorization carries
  forward; permission to inspect or push alone does not authorize metadata edits.
  GitHub does not document conditional PR-body writes; do not invent an atomic
  compare-and-swap guarantee. If concurrent editing is observed, hold the metadata
  update until the writers are coordinated and retain the proposed targeted edit.
  A fresh read alone does not eliminate the race. See GitHub's
  [conditional-request limitations](https://docs.github.com/en/rest/using-the-rest-api/best-practices-for-using-the-rest-api#use-conditional-requests).
- Verify the remote head, then wait for that revision's pipelines and hosted
  reviews using [hosted-loop.md](hosted-loop.md). Use measured workflow
  durations and a sleeping process for routine waiting, rather than repeated
  model turns. Collect the completed hosted feedback batch before changing code.
- If new valid findings or in-scope pipeline failures remain, return to the fix
  step with those findings and the latest head. Keep prior dispositions and
  review coverage. Complete the entire inner local loop again before the next
  push. Push again only for an actual change; do not create empty
  commits or repeatedly request reviews to provoke a different answer.
- Finish only when Codex has no unresolved actionable findings, CodeRabbit has
  approved the latest PR head or the credit-consent skip is recorded, Sonar's
  current PR analysis has zero open issues
  and a passing quality gate, the required pipelines pass, and the final changes
  still satisfy the recorded task scope. Apart from that explicit CodeRabbit
  exception, missing, skipped, stale, or pending evidence is not success. Stop
  on cancellation,
  or a concrete issue that cannot be resolved within the existing authorization.

End with what was fixed or rejected, the validation performed, the published
revision when applicable, threads resolved, and any remaining open threads with
their reasons, plus any CodeRabbit credit-consent skip and its missing coverage.
Report permission or API failures explicitly; never claim a thread
was resolved without confirmation. While the full loop is active, new feedback
starts the next batch automatically, preserving prior scope decisions. Once the
completion conditions are verified, end the task; do not monitor indefinitely
for hypothetical future feedback.
