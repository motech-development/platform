# Platform delivery agent guide

Use this guide when changing an application, infrastructure relationship, delivery workflow, Release behaviour, Preview Environment, or the Deployment Catalog.

The delivery catalog and generator described here are outputs of the agreed specification and may not exist until that implementation is complete. During implementation, create them at the specified paths; afterwards, absence or drift is an error.

## Read first

1. [`../../CONTEXT-MAP.md`](../../CONTEXT-MAP.md)
2. [`../../.github/CONTEXT.md`](../../.github/CONTEXT.md)
3. Relevant ADRs in [`../../.github/docs/adr/`](../../.github/docs/adr/)
4. [`../../AGENTS.md`](../../AGENTS.md)

The normative implementation specification is [GitHub issue #1492](https://github.com/motech-development/platform/issues/1492). ADRs explain decisions; do not silently contradict them.

## Non-negotiable invariants

- Pull requests own all blocking quality gates.
- Post-merge SonarCloud and Chromatic reporting do not gate delivery.
- Develop and production build shared Deployment Units from the same exact Release tags.
- Preview Environment creation is complete for runtime-affecting pull requests; later updates may be selective and must repair missing stacks.
- Different previews may run concurrently. A running deployment for one preview is never cancelled.
- Shared Develop resources are consume-only from previews.
- Each Lambda handler keeps an individual archive.
- Production and Develop build from Release tags, not deployment build artifacts.
- A package tag cannot substitute for an application tag when deploying an application.
- Running long-lived environment deliveries are never cancelled; newer waiting plans reconcile from GitHub Deployments.
- Do not cache `.serverless` or use Actions cache to transfer generated environment files.
- Do not modify Playwright tests or configuration as part of delivery optimization.
- Do not change Auth0 dependencies or `applications/id` without explicit authorization.

## Authoritative files

After implementation, expect:

| File                                          | Ownership                                                     |
| --------------------------------------------- | ------------------------------------------------------------- |
| `.github/delivery/catalog.json`               | Hand-maintained delivery-specific inventory and dependencies. |
| `.github/delivery/generate.mjs`               | Hand-maintained dependency-free generator.                    |
| `.github/delivery/*.test.mjs`                 | Generator and planning regression tests.                      |
| `.github/workflows/deploy-to-environment.yml` | Generated preview job graph.                                  |
| `.github/workflows/deploy-to-develop.yml`     | Generated Develop job graph.                                  |
| `.github/workflows/deploy-to-production.yml`  | Generated production job graph.                               |
| `.github/workflows/teardown-environment.yml`  | Generated reverse teardown graph.                             |
| `.github/workflows/quality-assurance.yml`     | Small hand-maintained QA workflow.                            |
| `.github/workflows/release.yml`               | Small hand-maintained Release workflow.                       |

Never edit a generated job block directly. Change the catalog or generator and regenerate.

## Exact commands

Run from the repository root:

```sh
node .github/delivery/generate.mjs
node .github/delivery/generate.mjs --check
node --test .github/delivery/*.test.mjs
```

Inspect delivery-specific CloudFormation relationships with:

```sh
rg -n 'ImportValue|Export' applications --glob 'serverless*.yml' --glob 'serverless*.yaml'
```

Inspect active workflow dependencies with:

```sh
rg -n -A8 '^    needs:' .github/workflows/*.yml
```

Inspect workspace relationships from manifests with:

```sh
jq -r '[.name, ((.dependencies // {}) + (.devDependencies // {}) | to_entries | map(select(.value | startswith("workspace:"))) | map(.key) | join(","))] | @tsv' applications/*/*/package.json packages/*/package.json
```

Build the transitive package outputs for one workspace using the command validated by the generator tests, expected to be:

```sh
yarn workspaces foreach -Rpt --from '<workspace-name>' run package
```

Do not run root `yarn test` locally merely to validate generator changes. Follow the root testing guidance and run targeted tests.

## Catalog responsibilities

The catalog stores only facts that cannot be derived reliably from workspace manifests:

- stable Deployment Unit id;
- owning workspace and path;
- supported targets;
- direct delivery dependencies;
- expected CloudFormation stack names;
- justified cleanup or non-standard command exceptions.

Do not add:

- ordinary `package.json` dependency relationships;
- secret values;
- formatting, lint, type-check, unit-test, SonarCloud, Chromatic, or Playwright commands;
- generated YAML fragments;
- speculative future targets or extension fields.

Unknown catalog fields must fail validation.

## When application or infrastructure code changes

An agent is authorized to update the Deployment Catalog in the same change when repository evidence shows the delivery relationship changed.

1. Read the affected workspace manifests.
2. Inspect Serverless/CDK imports, exports, stack names, and stage interpolation.
3. Decide whether the relationship is a code dependency inferred from manifests or a delivery dependency that belongs in the catalog.
4. Update the catalog only for delivery-specific facts.
5. Regenerate workflows.
6. Run generator tests and `--check`.
7. Inspect the generated diff for unexpected jobs, permissions, targets, or ordering.
8. Update the Platform Delivery context, ADR, specification, or this guide if behaviour or language changed.

Do not ask for confirmation merely because a catalog consumer must be updated to keep an authorized application/infrastructure change consistent. Ask when the evidence cannot establish the intended dependency, target, or security boundary.

## Add a Deployment Unit

1. Confirm the workspace has an appropriate `deploy` script and, where supported, `teardown` script.
2. Confirm its GitHub Release tag prefix is the exact workspace name.
3. Add a stable kebab-case catalog id, workspace path, targets, delivery dependencies, and expected stacks.
4. Inspect every `ImportValue` it consumes and every export its consumers reference.
5. Add only direct delivery dependencies; the generator computes transitive ordering.
6. Add generator fixtures covering selection, dependency expansion, target filtering, and reverse teardown.
7. Regenerate and verify each target contains one separately visible job.
8. Exercise a Preview Plan if preview is supported.

Example shape:

```json
"accounts-api": {
  "workspace": "@accounts/api",
  "path": "applications/accounts/api",
  "targets": ["preview", "develop", "production"],
  "dependsOn": [
    "accounts-data",
    "accounts-queue",
    "accounts-reports",
    "accounts-storage"
  ],
  "expectedStacks": ["accounts-{stage}-api"]
}
```

## Rename a Deployment Unit

A catalog id is part of GitHub Deployment task history. Treat a rename as a state migration.

1. Prefer keeping the stable id when only the display name, workspace path, or package name changes.
2. If the id must change, add explicit planner compatibility for the previous `deploy:<old-id>` task until every long-lived environment has a successful record under the new id.
3. Update all direct `dependsOn` references and tests.
4. Regenerate and inspect every workflow.
5. Remove compatibility only in a later change with evidence that both environments migrated.

## Remove a Deployment Unit

1. Determine whether its runtime resources must be torn down or intentionally retained.
2. If teardown is required, deploy the catalog change only after the old unit has been removed through the supported teardown path.
3. Remove inbound delivery dependencies or replace them with the new source of imports/exports.
4. Remove the catalog entry, regenerate, and verify no generated job remains.
5. GitHub Deployment history may remain; do not delete it merely to tidy the UI.

Never infer authorization to destroy retained production resources from deletion of an application directory alone.

## Preview State checks

- Query GitHub Deployments by environment `pr-<number>` and task `deploy:<unit-id>` only after acquiring the preview concurrency lock.
- Treat a unit deployment as Preview State only when its latest status is `success`, its history contains `in_progress`, and its `ref` is a readable pull-request commit.
- Compare each unit's own Preview State with the current head. Include workspace dependencies, delivery dependants, and missing expected stacks.
- Select the complete preview topology when recorded state is unrelated to the current pull-request history.
- Record Playwright independently as task `validate:playwright`. Only a pass or explicit non-runtime result receives `success`.
- Allow runtime validation with no selected Deployment Units. Read the current Accounts API URL and region from its existing stack when API is not selected.
- Fail before mutation when GitHub Deployment state, AWS stack state, or required Git history cannot be read reliably.

## Release and Environment State checks

- Run selective delivery from the `Release` workflow only after the unfiltered monorepo release command succeeds.
- For manual full delivery, dispatch `Release` with one successfully released main commit SHA; never add caller-supplied application version inputs.
- Resolve desired state from the latest owning-workspace Release tag reachable from the successfully released main boundary.
- Query GitHub Deployments by `environment` and `task=deploy:<unit-id>`.
- Use only a deployment whose latest status is `success`.
- Treat absent or malformed history as not deployed.
- Also check catalogued CloudFormation stacks exist.
- Expand selected units to delivery dependants after comparing state.
- Create the audit deployment with the exact tag as its `ref`, but treat it as Environment State only after the real deployment receives a `success` status.
- Use `auto_merge: false`, `required_contexts: []`, and successful status `auto_inactive: false`.

## Generated-workflow review checklist

- Generated-file warning and regeneration command are present.
- Every Deployment Unit is a separate named job.
- `needs` includes direct delivery dependencies only; redundant transitive edges are unnecessary.
- A selected job runs past intentionally skipped dependencies and stops after a selected dependency fails.
- Preview concurrency is scoped to the pull request with no cancellation of running jobs.
- Develop and production have independent non-cancelling concurrency locks.
- Environment planning occurs after acquiring its lock.
- Tag checkouts use the Release Plan, not `main`.
- Preview checkouts use the pull-request head commit.
- AWS permissions and secrets are limited to the owning unit.
- Sentry stage is `production`, `develop`, or `pr-<number>`.
- GitHub Deployment writes have `deployments: write`; unrelated jobs do not.
- Teardown reverses delivery dependencies and tolerates missing resources.
- No `.serverless`, package-output, or environment-file cache exists.
- Playwright commands, shard count, and configuration are unchanged.

## Packaging optimization evidence

For each ordinary Node service considered for esbuild:

1. Record baseline Webpack package time and archive inventory.
2. Package every handler as a separate esbuild entry.
3. Compare handler names, archive contents, sizes, assets, source maps, Sentry behaviour, and dynamic module loading.
4. Run targeted tests and the blocking type-check.
5. Validate the full Preview Environment and existing Playwright gates.
6. Adopt the candidate only when all checks pass and timing materially improves.
7. Leave a failed service on Webpack and document why; continue with other services.

Anti-virus is not a candidate because its custom Webpack plugins manage conditional files and executable permissions.

## Final verification

Before handing off a delivery change:

```sh
node --test .github/delivery/*.test.mjs
node .github/delivery/generate.mjs --check
git diff --check
```

Also run proportionate targeted formatting, lint, type-check, package, and workflow validation for affected files. Report:

- catalog and generated files changed;
- scenarios tested;
- before/after timing evidence when performance changed;
- Deployment Units intentionally left on Webpack;
- any validation that can only occur in GitHub Actions or AWS.
