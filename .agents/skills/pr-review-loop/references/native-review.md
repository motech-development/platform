# Native Codex review mechanics

Read this reference for the Codex half of the local review gate. Use an
available native Codex review tool, or the installed official Codex CLI. Check
its local help for supported arguments; do not hard-code a cached installation
path or a workaround from a previous machine. The model pin below is an explicit
user choice for this workflow.

## Choose the delta

For a follow-up fix, the initial baseline is the local revision before that fix,
not the PR's merge-base. Limit the review to the batch's paths and hunks. Review
the full PR only when that is the user's requested scope or required context
reveals a concrete need for broader inspection.

- Include staged and unstaged edits and inspect untracked files separately:
  `git diff BASE -- PATHS` omits untracked additions. Stage only authorized batch
  files or include new files explicitly in the review input.
- Record the exact in-scope file contents before each review, including added,
  deleted, and renamed files. A saved diff plus its base revision identifies the
  first snapshot; a temporary copy of the scoped files can identify later ones.
- If fixes remain uncommitted between passes, compare the new file snapshot with
  the preceding snapshot, for example using `git diff --no-index` between two
  temporary trees with matching relative paths. Exit status 1 means a diff exists.
  Do not compare two patch files and mistake that for a source-code diff.
- Give the reviewer the delta, its baseline, current source locations, and the
  earlier dispositions needed to avoid reopening resolved findings. Earlier code
  may be read for context without becoming a new full-PR review target.

## Invoke and verify

Pin **`gpt-6-astra`** and **`low` reasoning effort** for each invocation. Override
both the main model and `review_model`, which can otherwise select a different
reviewer. Do not change the user's global settings, raise effort automatically,
or silently fall back to another model. A later explicit user choice can override
this default. For a CLI that supports custom review prompts on stdin:

```sh
codex --model gpt-6-astra \
  -c 'review_model="gpt-6-astra"' \
  -c 'model_reasoning_effort="low"' \
  -s read-only review - < "$review_prompt_file"
```

Write the prompt with a structured file tool or a quoted heredoc. Avoid shell
interpolation of review comments. Check `codex review --help` before combining a
custom prompt with selectors such as `--base`, `--commit`, or `--uncommitted`;
supported combinations vary. The prompt must contain the actual scope and
snapshot, not leave the reviewer to choose a baseline.

Adapt this review brief:

> Review the supplied delta against the recorded snapshot. Follow the agreed
> scope record and repository contracts; inspect relevant callers to verify each
> claim. The attached original outcome, acceptance criteria, exclusions, and
> user-approved amendments define scope. Flag unrequested behavior or unnecessary
> expansion introduced by this delta, explaining the mismatch. Do not propose
> optional enhancements or turn review feedback into new requirements.
> Report actionable defects introduced by these edits with the path and line,
> triggering condition, and observed or well-supported consequence. Distinguish
> uncertain claims from established findings; do not invent issues to fill a
> quota or reopen recorded rejections without new evidence. Complete this review
> autonomously using the supplied context. Report a missing fact only when it
> prevents a reliable conclusion. Keep the result concise. The fixing agent has
> already run the attached checks: do not rerun tests, edit files, access GitHub,
> start subagents, or start another review loop. Return findings or state that no
> actionable findings were found, with any concrete verification limitation.

Confirm `gpt-6-astra`, `low`, and the intended scope in the run header or tool
metadata. A conflicting effective model or effort must be corrected before the
review is counted; do not infer the result from the parent task's model alone.
Launch this tracked run alongside CodeRabbit before waiting for either result.
Do not triage its findings until both final reports are available. Wait for
completion without leaving an unattended nested review process. Keep
the final result and snapshot together. A timed-out, interrupted, unavailable,
or failed review is not a clean review; report the limitation and continue
independent fixes and checks. Do not silently replace a required native review.

Once clean, freeze the final result through commit. Compare the post-hook content
to the reviewed snapshot. Review new substantive edits against that snapshot;
formatting-only hook changes need the corresponding static checks, not another
full model pass. Keep this result while CodeRabbit runs or waits for a cooldown;
do not rerun Codex on unchanged content. Both reviewers must cover subsequent
review-driven fixes before the combined gate is complete.

The prompt and execution boundaries follow the
[Astra guidance](https://developers.openai.com/api/docs/guides/latest-model?model=gpt-6-astra#gpt-6-astra-migrate-with-codex):
preserve low effort, make autonomy and instruction priority explicit, constrain
delegation to the intended workflow, and avoid redundant validation. API request
parameters are managed by the native CLI; do not add an API migration, sampling
settings, or cache configuration to this skill merely to mirror the guide.
