# Resolve handled review threads

Use GitHub's `resolveReviewThread` GraphQL mutation, through an available GitHub
tool or `gh api graphql`. Reactions and replies do not change resolution state.
Use the review-thread node ID, not an inline comment's numeric ID or a review ID.
The user's request to handle feedback under this workflow includes resolving
eligible bot threads; carry forward any narrower permissions or exclusions.
Do not ask for separate confirmation for each routine resolution.

## Eligibility

Resolve a bot thread only after every actionable finding and follow-up in it has
been assessed against the current remote head:

- **Fixed or already addressed:** the relevant fix is present on the PR branch
  and the checks needed to establish that fix have passed. A local-only fix is
  insufficient. If a particular CI result is needed to prove the fix, wait for it.
- **Rejected:** the finding is conclusively incorrect, with evidence recorded in
  the batch record and user-facing outcome. Follow the skill's response policy:
  CodeRabbit gets a rejection explanation; Codex gets the appropriate reaction
  unless a text discussion was requested. Pending questions or disputes stay open.
- **Obsolete:** the relevant change was removed or superseded and the reported
  problem no longer applies. GitHub's `isOutdated` flag alone is not proof.

Do not resolve a still-valid problem simply because it is outside scope, low
priority, or expensive. Leave pending fixes and unresolved scope decisions open.
Do not reopen resolved threads, dismiss an entire review, delete comments, or
resolve human feedback without the corresponding user instruction.

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

## Resolve and confirm

For each eligible, unresolved thread with `viewerCanResolve: true`, send:

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

Finally, re-read the handled threads and confirm their state. Report resolved
threads separately from findings embedded in CodeRabbit's main review: those
embedded findings may have no resolvable thread, so track their disposition
without pretending to close one. No scheduled monitor or extra hosted review is
needed merely to perform this end-of-batch cleanup.
