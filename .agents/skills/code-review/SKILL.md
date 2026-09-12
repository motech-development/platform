---
name: code-review
description: Review a PR, branch, commit range, or uncommitted changes for repository standards and conformance to the requested behaviour.
---

# Code Review

Review two axes: **Standards** (repository conventions and maintainability) and **Spec** (requested behaviour and scope). Keep their conclusions separate so success on one cannot hide failure on the other. A review request authorizes inspection, not automatic fixes.

## Establish the change set

Honor the user's explicit comparison and exclusions. Otherwise infer the base from the supplied PR's base branch or established task context. For a request limited to uncommitted work, compare tracked changes with `HEAD` and inspect untracked files. Ask only when available evidence leaves materially different review scopes unresolved.

Resolve references before reviewing and record the base, current head, paths, and whether local changes are included:

- For a PR or branch, use `git diff <base>...HEAD` for the merge-base comparison and `git log <base>..HEAD --oneline` for commit context.
- For an explicitly requested exact range, use the specified endpoints rather than silently substituting a merge-base comparison.
- For uncommitted work, use `git diff HEAD` for staged and unstaged tracked changes, plus `git ls-files --others --exclude-standard` and read the relevant untracked files. For staged-only requests use `git diff --cached`.
- For branch work including local edits, resolve `git merge-base <base> HEAD` and compare that commit with the working tree using `git diff <merge-base>`, plus relevant untracked files. This shows the combined result without double-counting intermediate changes.

Do not treat an empty committed diff as an empty review until requested local additions have been checked. Report an empty change set directly. Keep the reviewed snapshot consistent; if it changes during review, identify and inspect the new delta.

## Establish requirements and standards

Use the user's supplied specification and conversation requirements first. Supplement with linked PR/commit issues, using `docs/agents/issue-tracker.md` when available, and clearly matching repository specifications. Do not treat a bot suggestion as a new requirement.

If no specification is available, continue the standards and correctness inspection and label Spec coverage as unavailable. Ask only when missing requirements prevent a material conclusion; do not invent acceptance criteria or block all useful review.

Use applicable repository guidance, including shared code-style guidance and the affected package section. Read [standards heuristics](references/standards.md) when assessing maintainability. Repository rules override heuristics; flag a smell only with concrete evidence and a useful explanation, not as a mechanical refactoring demand. Skip findings already enforced by tooling.

## Review and report

For a small change, delegate one `standards_reviewer` agent configured as
`gpt-5.6-luna` with `high` reasoning effort to cover both Standards and Spec.
For a substantial change where independent passes add value, delegate these
two named agents in parallel, each configured as `gpt-5.6-luna` with `high`
reasoning effort:

- `standards_reviewer`: repository conventions, maintainability, and the
  applicable standards guidance.
- `spec_reviewer`: requested behaviour, acceptance criteria, and scope.

Give each reviewer the same resolved change set (including requested
local/untracked content), relevant requirements, and standards. Reviewers only
inspect and report; they do not edit, commit, delegate, or start another review
loop. The parent orchestrator aggregates their reports, owns finding triage,
and assigns any approved fixes separately. If delegation is unavailable, the
parent performs both axes locally with the same separation and reports the
missing independent reviewer coverage.

For Standards, cite the applicable rule and affected code; distinguish violations from judgement calls. For Spec, identify missing, incorrect, or unrequested behaviour and connect it to a requirement. Check relevant callers when needed to substantiate a finding.

Report actionable findings with file locations, impact, and evidence under Standards and Spec. Within each axis, put the most consequential findings first. Consolidate duplicate reports of the same defect while retaining both classifications when relevant. State which scope and snapshot were reviewed and any coverage gaps; do not call unavailable Spec coverage a pass. Completion is a grounded report covering the requested change set, not a requirement to find issues or run a separate PR feedback loop.
