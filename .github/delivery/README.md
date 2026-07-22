# Deployment Catalog

`catalog.json` is the source of truth for delivery topology. It records only stable Deployment Unit identifiers, owning workspaces and their paths, supported targets, direct delivery dependencies that cannot be inferred from workspace manifests, expected CloudFormation stacks, and justified exceptions. Identity/Auth0 and accounts data restore are deliberately outside this catalog.

The generator reads every workspace manifest to infer ordinary `workspace:` relationships. Do not copy those relationships into `dependsOn`; validation rejects that duplication. Use `dependsOn` only for runtime infrastructure relationships established by imports, exports, or existing delivery ordering.

## Regenerate and review

From the repository root:

```sh
node .github/delivery/generate.mjs
node .github/delivery/generate.mjs --check
node --test .github/delivery/*.test.mjs
```

The files in `templates/` own operational commands, environment variables, permissions, and other non-topology workflow details. The generator owns stable job identifiers, target inclusion, and `needs` edges. Never edit a generated workflow directly. After regeneration, review the ordinary workflow diff for unit visibility, permissions, target eligibility, direct dependency edges, and reverse teardown ordering.

## Preview planning

The Preview Environment workflow compares the pull-request base and head commits, then passes the changed paths to `generate.mjs --preview-impact`. Documentation-only changes produce explicit not-applicable `Preview` and `Playwright` results. Runtime changes under a workspace select that workspace; runtime files that cannot be scoped safely, such as the root lockfile or a newly added workspace, select the full workspace graph.

New, reopened, and newly ready runtime pull requests deploy the complete preview-capable topology. Later synchronisations read CloudFormation stack names and use `generate.mjs --preview-plan` to combine changed workspaces, workspace and delivery dependants, and missing-stack repair. The generated deployment jobs use the plan output as their selection gate. Preview and teardown share a non-cancelling concurrency group scoped to the pull request.

Teardown checks each catalogued stack before cleanup, skips units whose resources are already absent, and preserves AWS errors that are not a missing-resource response. S3 cleanup likewise tolerates a missing bucket while reporting permission and deletion failures.

## Deployment Unit lifecycle

- To add a unit, confirm its workspace deploy/teardown commands and Release tag prefix, inspect CloudFormation imports and exports, add the smallest catalog entry, record a planning fixture, regenerate, and verify every supported target has one separately visible job.
- To rename a unit, prefer retaining its stable id because GitHub Deployment task history uses that id. A true id change requires an explicit Environment State migration.
- To remove a unit, decide and perform any required resource teardown before deleting the catalog entry. Do not infer authorization to destroy retained resources from a source-code deletion.

See `docs/agents/platform-delivery.md` and the Platform Delivery ADRs for the full maintenance and review checklist.
