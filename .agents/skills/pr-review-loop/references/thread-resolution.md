# Resolve handled review threads

Use GitHub's `resolveReviewThread` GraphQL mutation, through an available GitHub
tool or `gh api graphql`. Reactions and replies do not change resolution state.
Use the review-thread node ID, not an inline comment's numeric ID or a review ID.
An explicit `$pr-review-loop` invocation authorizes routine Codex reactions, eligible
bot-thread resolution, and the limited written explanation for a conclusively
rejected CodeRabbit finding after the checks below, unless the user explicitly
narrows the request to code fixes only, inspection, one batch, or local review.
Record that authorization or narrowing in the batch ledger and carry it across
batches; do not ask again for each routine resolution. The explanation tags
`@coderabbitai` in a top-level message or uses the integration's supported inline
mechanism. Other text replies require explicit authorization even during a full
loop. Push, commit, and PR metadata permissions remain separate as well.

Codex findings receive reactions only: 👍 for accepted findings and 👎 for
conclusive false positives. CodeRabbit receives no reactions. Under the full-loop
default, explain a conclusively rejected CodeRabbit finding with evidence and tag
`@coderabbitai` in a top-level message, or use the supported inline mechanism;
accepted findings receive no acknowledgement. Other text replies need separate
explicit authorization.

## Eligibility

Resolve a bot thread only after every actionable finding and follow-up in it has
been assessed against the current remote head:

- **Fixed or already addressed:** the relevant fix is present on the PR branch
  and the checks needed to establish that fix have passed. A local-only fix is
  insufficient. If a particular CI result is needed to prove the fix, wait for it.
- **Rejected:** the finding is conclusively incorrect, with evidence recorded in
  the batch record and user-facing outcome. Under the full-loop authorization,
  CodeRabbit gets the required written rejection explanation before its thread is
  marked handled or resolved; tag `@coderabbitai` in a top-level message or use
  the supported inline mechanism. If posting fails, leave the thread open and
  report the failure. Without that authorization, record the evidence without
  posting and do not inherit bot-interaction permission from a narrower request.
  Codex gets the appropriate reaction. Pending questions or disputes stay open.
- **Obsolete:** the relevant change was removed or superseded and the reported
  problem no longer applies. GitHub's `isOutdated` flag alone is not proof.

Do not resolve a still-valid problem simply because it is outside scope, low
priority, or expensive. Leave pending fixes and unresolved scope decisions open.
Preserve threads resolved by other actors. Do not dismiss an entire review,
delete comments, or resolve human feedback without the corresponding user
instruction. Existing authorization to handle bot threads includes correcting
this batch's own stale resolution as described below.

## Read current state

Fetch `headRefOid` and paginate the PR's `reviewThreads`, collecting `id`,
`isResolved`, `isOutdated`, `viewerCanResolve`, `path`, and the comments with their
IDs, authors, bodies, and URLs. Paginate comments within each thread too; a recent
follow-up can change whether the original finding is settled. For example:

```graphql
query ReviewThreads(
  $owner: String!
  $name: String!
  $number: Int!
  $after: String
) {
  repository(owner: $owner, name: $name) {
    pullRequest(number: $number) {
      headRefOid
      reviewThreads(first: 100, after: $after) {
        pageInfo {
          hasNextPage
          endCursor
        }
        nodes {
          id
          isResolved
          isOutdated
          viewerCanResolve
          path
          comments(first: 100) {
            pageInfo {
              hasNextPage
              endCursor
            }
            nodes {
              id
              databaseId
              author {
                login
              }
              body
              url
            }
          }
        }
      }
    }
  }
}
```

For another comments page, query the thread with `node(id: $threadId)` and the
`... on PullRequestReviewThread` fragment, using `comments(after: $after)`.
Match threads to the recorded findings, including any replies. Resolve only
the eligible IDs from this batch. If the remote head changed since verification,
reassess affected findings against the new revision before resolving them.

For an eligible Codex finding, re-read the head and thread immediately before
applying the recorded reaction, then use the comment node or database ID required
by the available GitHub API. Re-read the head and thread after the reaction before
proceeding to resolution. Do not react to CodeRabbit findings, human comments, or
a disputed finding.

## Resolve and confirm

Immediately before each mutation, re-read the remote head and that thread,
including follow-ups. If the head differs from the verified revision or new
feedback changes eligibility, reassess and verify before proceeding. Record the
head, thread state, and mutation result for this batch. GitHub does not provide
an atomic head-conditional resolution: the checks below detect races rather
than preventing them.

For each still-eligible, unresolved thread with `viewerCanResolve: true`, send:

```graphql
mutation ResolveThread($threadId: ID!) {
  resolveReviewThread(input: { threadId: $threadId }) {
    thread {
      id
      isResolved
    }
  }
}
```

Check GraphQL `errors` even when HTTP succeeds, and require the returned ID to
match and `isResolved` to be true. After an uncertain response, read the thread
before retrying; another actor may already have resolved it. Do not retry a
permission failure in a loop. Complete unaffected resolutions and report the
specific remaining thread links and blocker.

Immediately after each mutation, read the remote head and thread again. If the
head changed, or the response was uncertain, do not claim the finding settled
until eligibility is reassessed against the current head. If a confirmed
resolution made by this batch now hides a still-valid finding, use
`unresolveReviewThread` for that thread and verify the result under the existing
bot-thread authorization. Do not undo another actor's resolution: when ownership
or current state cannot be established safely, leave it unchanged and report
the thread and race as unresolved work. Recheck the head after any correction
and retain uncertainty if concurrent changes continue.

Finally, paginate a fresh read of the head and all bot threads. Confirm every
mutation's final state and count **all unresolved bot review threads**, not only
the eligible set, including threads marked outdated. Eligible handled threads
must have been reacted to and resolved when authorized. Still-valid, actionable,
disputed, or out-of-scope bot threads remain open and prevent a clean full-loop
completion; `isOutdated` alone never qualifies a thread for cleanup. Report
resolved threads separately from findings embedded in CodeRabbit's main review:
those embedded findings may have no resolvable thread, so track their disposition
without pretending to close one. No scheduled monitor or extra hosted review is
needed merely to perform this end-of-batch cleanup.
