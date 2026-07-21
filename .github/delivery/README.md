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

## Deployment Unit lifecycle

- To add a unit, confirm its workspace deploy/teardown commands and Release tag prefix, inspect CloudFormation imports and exports, add the smallest catalog entry, record a planning fixture, regenerate, and verify every supported target has one separately visible job.
- To rename a unit, prefer retaining its stable id because GitHub Deployment task history uses that id. A true id change requires an explicit Environment State migration.
- To remove a unit, decide and perform any required resource teardown before deleting the catalog entry. Do not infer authorization to destroy retained resources from a source-code deletion.

See `docs/agents/platform-delivery.md` and the Platform Delivery ADRs for the full maintenance and review checklist.
