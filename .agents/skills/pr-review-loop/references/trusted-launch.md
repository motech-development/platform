# Start from a trusted skill copy

This is an operator procedure to perform **before starting Codex or selecting the
skill for a less-trusted PR**. Read it from a trusted checkout or reviewed
installation, never from the PR being reviewed. A check inside a PR-supplied skill
cannot establish trust retroactively.

Choose a full commit SHA whose skill contents have already been reviewed and
trusted independently of the PR. Use a trusted checkout containing that commit.
Do not derive this choice from PR-authored instructions or assume the PR head is
trusted because it is available locally. If the trusted base does not contain this
skill, use a separately reviewed version or stop; do not bootstrap from the PR's
replacement. The skill, its `agents/openai.yaml`, references, and helpers must all
come from the same trusted revision.

Before running the commands, choose an owner-controlled launch parent outside the
PR checkout. Inspect its canonical path and **every ancestor up to the filesystem
root**: any discovered agent guidance or configuration must be trusted, and no
untrusted user or PR process may modify those locations. Do not use an unchecked
`TMPDIR`, shared temporary parent, or symlink into an untrusted tree. If this
ancestry cannot be established, stop before starting Codex.

From a trusted terminal, replace the first three values and run:

```sh
set -eu
trusted_checkout='/absolute/path/to/trusted-checkout'
trusted_commit='FULL_REVIEWED_COMMIT_SHA'
launch_parent='/absolute/path/to/verified-trusted-launch-parent'
launch_dir=$(mktemp -d "$launch_parent/pr-review-loop.XXXXXX")
git -C "$launch_dir" init --quiet
git -C "$trusted_checkout" archive --format=tar \
  --output="$launch_dir/skill.tar" "$trusted_commit" .agents/skills/pr-review-loop
tar -xf "$launch_dir/skill.tar" -C "$launch_dir"
rm "$launch_dir/skill.tar"
chmod -R a-w "$launch_dir/.agents"
codex --cd "$launch_dir"
```

The new Git root bounds repository skill discovery at the launch directory;
it does not replace the ancestor and global-configuration trust checks above. Use an ordinary copy, not a symlink into the PR. Start a new session in
that directory, select the skill from its absolute path there, and supply the PR
URL and scope as data. Record the trusted commit and skill directory in the batch
record. Global and administrator configuration must also be trusted; this archive
isolates repository skill discovery, not the entire host.

Keep the primary session rooted in the trusted launch directory. Inspect and edit
the PR through explicit paths in the separate, appropriately isolated worktree.
Keep loading references, the launch prompt, and the pipeline waiter from the
recorded trusted skill directory, even when the PR changes those same files.
Do not copy PR-authored skill updates back into the running installation or restart
Codex inside the PR checkout. A new skill version requires separate review before
it becomes a later session's trusted source.

Read-only file permissions prevent accidental edits; they are not a security
boundary against another process running as the same user. If PR-authored skill
instructions were already loaded into the primary session, do not continue by
adding a warning: stop that session and restart from the trusted source. The
execution isolation requirements in `SKILL.md` still apply to PR-controlled tools
and reviewer startup.

Codex discovers repository skills from its working directory and ancestors, and
follows skill symlinks; duplicate names can appear together. See
[OpenAI's skill-discovery documentation](https://learn.chatgpt.com/docs/build-skills#where-codex-loads-local-skills).
