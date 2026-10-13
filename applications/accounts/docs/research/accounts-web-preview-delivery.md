# Delivering Accounts web to preview and Develop only

## Research question

What does it take to bring `@accounts/web` back into automated delivery with Preview Environment and Develop targets but no production target? This covers removing `"private": true` and how Release tags then apply, re-adding an `accounts-web` Deployment Unit to `.github/delivery/catalog.json` (whether a unit may omit production, what `dependsOn` and `expectedStacks` need, and whether the Amplify exception from `755aa976` still applies), the hosting stack's production branch and domain, and changes to `amplify.yml`.

This note resolves [Research: Delivering Accounts web to preview and Develop only](https://github.com/motech-development/platform/issues/1653), part of map [#1649](https://github.com/motech-development/platform/issues/1649). It lays out facts and options only. The decision belongs to [Decide delivery targets and releases](https://github.com/motech-development/platform/issues/1664). It follows `docs/agents/platform-delivery.md`.

Researched on 2026-10-13 against `main` at `dbc0296b4`, `@qiwi/multi-semantic-release` 7.1.2 (root `package.json:40`), the walking skeleton at `755aa976`, and the reset in [#1579](https://github.com/motech-development/platform/pull/1579) (rebased onto `main` as `97379a162`, `64bea7454` and `3354829dc`). AWS state was not readable (no valid session), so statements about deployed AWS resources come from the repository and Git refs only.

## Result

1. **Removing `private` is enough to make `@accounts/web` release again, but the first Release continues the old version line.** Tags `@accounts/web@1.0.0` to `@accounts/web@1.3.6` already exist. `1.3.6` points at `13ca46195`, the pre-reset skeleton. The unreleased `fix(accounts-web): …` commit `3354829dc` alone produces `1.3.7` on the next `main` push.
2. **The catalog accepts a unit with `targets: ["preview", "develop"]`, but Develop delivery then breaks.** The Release Plan is always computed for the `production` target, so its `desiredTags` never contains a develop-only workspace. Develop reconciliation then throws for the whole Develop run, not just Accounts web. A generator change is required. Every existing unit is either production-only or on all three targets, so this case has never been exercised.
3. **The hosting stack cannot be catalogued as it was in `755aa976`.** The reset removed the generator's support for literal (shared) stack names such as `accounts-web-hosting`, and today's validator rejects them. With `expectedStacks: []` instead, the generated preview teardown never runs.
4. **A standard generated job cannot deploy this unit.** `deploy.ts` force-pushes a commit to an `amplify/<stage>` branch. That needs write-capable Git credentials and full history, but the standard job has `contents: read` and a shallow checkout. The unit therefore needs a catalogued `exception` and per-target template overrides, as it had before. The old exception text is only partly accurate now.
5. **Production can be dropped from delivery without touching AWS.** The stack's `amplify/production` branch and its Git ref (at the old `1.3.6` commit) are separate decisions. The only custom domain maps `accounts-develop` to `amplify/develop`. No production hostname exists.
6. **`amplify.yml` needs no change for today's placeholder.** It does change when the app becomes TanStack Start (SPA: `dist/client`; `WEB_COMPUTE`: `.amplify-hosting`). Root-file edits currently neither trigger an `@accounts/web` Release nor select a preview.

## Releases and tags

### How `private` excludes the workspace today

- `@accounts/web` has `"private": true` (`applications/accounts/web/package.json:4`), added by `3354829dc` so that "the root release command excludes it" (README line 32).
- The root `release` script runs `multi-semantic-release` (`package.json:21`). `ignorePrivate` defaults to `true` (`node_modules/@qiwi/multi-semantic-release/lib/getConfigMultiSemrel.js:89`). Private manifests are filtered out before any analysis (`lib/multiSemanticRelease.js:103`). See the [README options table](https://github.com/qiwi/multi-semantic-release#configuration).
- No root multi-release config overrides this. The workspace's `.releaserc.json` extends `@motech-development/semantic-release/application`, which runs commit-analyzer, release-notes, `@semantic-release/npm` with `npmPublish: false`, and GitHub (`packages/semantic-release/application.js`, `src/utils.js:13-21`). So an application Release is a Git tag plus a GitHub Release. Nothing is published to npm.

### What happens when `private` is removed

- **Tag format:** `${name}@${version}` (`getConfigMultiSemrel.js:91`), giving `@accounts/web@x.y.z`. This matches the platform rule that a unit's Release tag prefix is its exact workspace name (`docs/agents/platform-delivery.md`, "Add a Deployment Unit" step 2).
- **Existing tags:** `git ls-remote` shows 11 tags, `@accounts/web@1.0.0` to `@accounts/web@1.3.6`. All are published GitHub Releases, the last on 2026-09-02. `1.3.6` is commit `13ca46195`, the pre-reset skeleton (TanStack Start, `dist/client`, required `VITE_*` env, Sentry token in `amplify.yml`).
- **Next version:** semantic-release continues from the highest reachable tag. Commits are filtered to those touching the package directory (`lib/getCommitsFiltered.js`). Since `1.3.6` the directory has `97379a162 refactor`, `64bea7454 ci`, `3354829dc fix` and `5b85d0f13 style`. The `fix` gives at least `1.3.7`, and a `feat` in the same change gives `1.4.0`. A fresh major needs a `BREAKING CHANGE` footer. Dependency releases also bump it, because `deps.release` defaults to `patch` (`getConfigMultiSemrel.js:95`).
- **Ordering risk:** if the catalog entry lands on `main` before a new `@accounts/web` Release exists, the planner falls back to the latest reachable tag (`successfulRelease`, `generate.mjs:522-540`). That is `1.3.6`, and its `deploy.ts` throws on missing `VITE_*` variables. Removing `private` in the same change as (or before) adding the catalog entry makes the first planned tag a post-reset Release. A manual full delivery at a boundary earlier than that Release would still resolve `1.3.6`.
- **Root files:** multi-semantic-release only sees changes inside `applications/accounts/web`. A change only to root `amplify.yml` therefore produces no `@accounts/web` Release (see [`amplify.yml`](#amplifyyml)).

## Catalog entry

### What validation enforces

`validateCatalog` (`.github/delivery/generate.mjs:1784-1928`) enforces these rules:

- **Fields:** only `id`, `workspace`, `path`, `targets`, `dependsOn`, `expectedStacks` and `exception` are allowed (lines 11-19).
- **Targets:** `targets` must be a non-empty, duplicate-free subset of `preview`, `develop` and `production` (lines 20, 1840-1856). **Nothing requires `production`.** Production-only units already exist (`component-library`, `core-infrastructure`, `accounts-client`).
- **Identifiers:** `accounts-client` is reserved for the preview target (lines 21-26). `accounts-web` is not reserved.
- **`dependsOn`:** must reference known units and must not repeat a dependency already inferred from `workspace:` manifest entries (lines 1863-1922).
- **Stack names:** each `expectedStacks` entry must match `/^[A-Za-z][A-Za-z0-9-]*\{stage\}[A-Za-z0-9-]*$/` (line 28). **A literal name such as `accounts-web-hosting` is rejected.** A probe of `validateCatalog` returned `deployment unit "accounts-web" has invalid expected stack "accounts-web-hosting"`.
- **`exception`:** must be a non-empty string when present. Any unit with an `exception` must have explicit template jobs, because `standardDeploymentJob` throws otherwise (lines 1305-1309, `.github/delivery/README.md:17`).

### Omitting production: what the generator does

A scratch probe added `{ "id": "accounts-web", "targets": ["preview", "develop"], "dependsOn": ["accounts-api"], "expectedStacks": [] }` to the catalog in memory. It then called the exported planner and generator functions.

| Step | Result |
| --- | --- |
| `validateCatalog` | Passes. |
| `generateWorkflows` | Adds an `accounts-web` job to the preview, Develop and teardown workflows and none to production. |
| `createPreviewPlan` (opened PR) | Includes `accounts-web` after `accounts-api`. |
| `createReleasePlan` | Succeeds, but `desiredTags` has **no** `@accounts/web` entry. |
| `createReconciliationPlan` (develop) | **Throws** `deployment unit "accounts-web" requires Release "@accounts/web@<version>"`. |

The cause is that `createRepositoryReleasePlan` hard-codes `target: 'production'` (`generate.mjs:741`). `createReleasePlan` builds its graph and `desiredTags` from that target's units (`dependencyGraph`, lines 134-164). The Develop setup job then plans with `target: develop` against those production-only `desiredTags` (`environmentReconciliationSteps`, lines 1097-1131). `plannedUnits` throws on any develop unit without a tag (lines 501-519). Because the throw happens in Develop `setup`, every Develop deployment in that run stops, not just Accounts web.

Options to make a develop-only unit plannable:

- **A. One union plan.** Compute the Release Plan over the union of `develop` and `production` units, so `desiredTags` covers both. Develop and production keep receiving one immutable plan. This needs ADR 0001's wording "both Develop and production build that unit from the tag" read per target.
- **B. Per-target plans.** Compute one plan per long-lived target in `release.yml` and pass each workflow its own plan. This touches `release.yml`, the planner CLI and fixtures.
- **C. Keep a production target and gate it off.** This conflicts with the map's "no production deployment" and leaves a production job in the graph.

For any of these, `.github/CONTEXT.md` defines **Develop Environment** as using "the same Releases as their production counterparts". `docs/agents/platform-delivery.md:20` says "Develop and production build shared Deployment Units from the same exact Release tags". A develop-only unit has no production counterpart. The invariant still holds for shared units, but the wording and possibly an ADR need an update. The "Accounts web reset" section of `.github/CONTEXT.md` (lines 63-65) also needs updating once the unit returns.

### `dependsOn`

- **`755aa976`:** `dependsOn: ["accounts-api"]`. The deploy jobs consumed `needs.accounts-api.outputs.appsync-url` and `aws-region` as `VITE_*` build config. `deploy.ts` then wrote these to Amplify branch environment variables (`git show 755aa976:applications/accounts/web/infrastructure/deploy.ts`, lines 132-195).
- **Validation:** `@accounts/web` has no `workspace:` dependency on `@accounts/api`, so `accounts-api` is a legal delivery-only dependency. Targets filter the graph (lines 157-160), so production-only units such as `accounts-infrastructure` are ignored for preview and Develop anyway.
- **Placeholder:** today's placeholder consumes no API output, and its CDK stack has no `ImportValue`. `dependsOn: []` is valid until the app reads API config. Adding `accounts-api` later also makes every Accounts API change redeploy the web unit (delivery dependant expansion).
- **Develop config gap:** when the unit needs the API URL, Develop also lacks a fallback source if `accounts-api` is not selected in that run. The reset removed the long-lived `current-api-config` fragment and the `api-appsync-url` / `api-aws-region` setup outputs (`64bea7454`, generator `decorateLongLivedWorkflow`). Only the preview setup still exposes them (`.github/workflows/deploy-to-environment.yml:25`). These would need restoring, per ADR 0008 (pass client configuration as job outputs).

### `expectedStacks`

`accounts-web-hosting` is one shared, stage-less stack (`infrastructure/app.ts:10`). Preview and Develop deploy branches into it and never own it. The options:

- **A. Restore literal shared-stack support** removed by `64bea7454`:
  - the validator regex `(?:\{stage\}…)?`;
  - `createPreviewPlan` failing closed when a shared stack is missing;
  - reconciliation and teardown ignoring literal stacks for Preview State;
  - the teardown guard running the teardown command when a unit has no stage-owned stack;
  - the README, platform-delivery and ADR 0003 paragraphs.

  This brings back "previews are consume-only and fail closed" for the shared app.
- **B. `expectedStacks: []`.** This passes validation today, but `injectTeardownGuard` (lines 1014-1049) emits `for stack in ; do` with `found=false`. The probe confirmed the `Teardown` step is then always skipped, so preview Amplify branches and `amplify/pr-<n>` Git refs leak. It also loses missing-stack repair and fail-closed checks. Option B would need at least the teardown-guard fix from A.

### Exception and template overrides

The `755aa976` exception text is in `git show 755aa976:.github/delivery/catalog.json`, lines 111-117. Each clause against today's repository:

| Clause | Status now |
| --- | --- |
| "Deploys an exact Git commit to one branch of the shared GitHub App-connected Amplify Hosting app" | Still true (`infrastructure/deploy.ts:103-126`, `stack.ts:9-29`). |
| "Release serializes shared-stack reconciliation before Develop and production deploy their branches under independent environment locks" | Stale. The `reconcile-accounts-web-hosting` job was removed from `release.yml` by `64bea7454`. It was gated on `desiredTags['@accounts/web']`, which a no-production unit never gets under today's production-only plan. Production is also out of scope. |
| "previews require the shared stack and remain consume-only" | Only true if literal shared-stack support (option A above) returns. |
| "Hosted builds inherit the app-level Amplify-managed `SENTRY_AUTH_TOKEN`; branch deployment never owns the credential" | Not true of the placeholder (no Sentry, and `amplify.yml` no longer writes the token). It depends on the observability decision for the new app. |

The unit still needs an `exception`, for these reasons:

- **Credentials and checkout:** `deploy.ts` runs `git push origin <sha>:refs/heads/amplify/<stage> --force` (`deploy.ts:122-126`), and `teardown.ts` deletes the remote branch (`teardown.ts:79-81`). The generated standard job grants `contents: read` with a default shallow checkout (`standardDeploymentJob`, lines 1310-1344). The removed `accounts-web-deployment-checkout` fragment used a GitHub App token with `contents: write` and `workflows: write` and `fetch-depth: 0` (`64bea7454`).
- **Deployment URL:** the preview job exposed `deployment-url` from `deploy.ts` output for later validation (removed template at `13ca46195:.github/delivery/templates/deploy-to-environment.yml`).
- **Build config:** when the app needs config, the job needs API config and Auth0 and observability values. They come from the job's `env` and are passed into Amplify branch variables.

Overrides are therefore needed in `templates/deploy-to-environment.yml`, `deploy-to-develop.yml` and `teardown-environment.yml`, mapped in `workflowDefinitions` (lines 810-878). No production template is needed. `teardown.ts` already refuses non-preview stages (lines 40-44).

### Shared stack reconciliation

`reconcile` (`cdk deploy accounts-web-hosting`) is outside every generated job. The options:

- **A.** Restore a Release-level reconcile job keyed on the Develop desired tag. It needs a target-aware plan (see above).
- **B.** Have the Develop `accounts-web` override run `reconcile` before deploying its branch. Develop is the only long-lived target, so no separate lock is needed for production, but previews could see a stack mid-update.
- **C.** Reconcile manually when `infrastructure/stack.ts` changes.

Any stack change from [#1650](https://github.com/motech-development/platform/issues/1650) needs one of these to reach AWS. That includes even the SPA rewrite target `/index.html` → `/_shell.html`. `1.3.6` used `/_shell.html` and `main` uses `/index.html`, but the live rule is unknown because no reconcile has run since the reset.

### Preview impact and validation

- `createPreviewImpact` maps files to workspaces by path (lines 240-282). The pre-reset generator also mapped `amplify.yml` and `customHttp.yml` to `@accounts/web`; `64bea7454` removed that. A probe with only `amplify.yml` changed returns `runtimeAffected: false`.
- The `preview-status` job's `needs` are generated from the graph, so the unit is included automatically.
- Playwright validation (`validate:playwright`) covers only the legacy client today. Browser validation for the new app is a separate decision (the map's parity ticket). `platform-delivery.md` forbids changing Playwright configuration as part of delivery work.

## Hosting stack: production branch and domain

What exists (`applications/accounts/web/infrastructure/stack.ts`):

- **App:** `CfnApp` `accounts-web`, `platform: 'WEB'`, `enableBranchAutoDeletion: true`, with one SPA rewrite to `/index.html` (lines 9-29).
- **Develop branch:** `amplify/develop`, stage `DEVELOPMENT` (lines 30-38).
- **Production branch:** `amplify/production`, stage `PRODUCTION`, described as an "Isolated Accounts production candidate without legacy traffic" (lines 39-48).
- **Domain:** `CfnDomain` on `motechdevelopment.co.uk` with one sub-domain, `accounts-develop` → `amplify/develop` (lines 49-58). **No production sub-domain exists.** Production would be reachable only at `https://amplify-production.<appId>.amplifyapp.com` (`stage.ts:28-34`).
- **Stage parsing:** `stage.ts` still accepts `production` (lines 1-22), so `yarn workspace @accounts/web deploy --stage production` remains possible by hand.

Remote Git refs (`git ls-remote origin 'amplify/*'`):

- `amplify/develop` and `amplify/production` both point at `13ca46195` (`@accounts/web@1.3.6`). The skeleton was therefore pushed to production before the reset. Whether its Amplify job succeeded and is still served could not be checked without AWS access.
- `amplify/pr-1579` still exists. Preview teardown stopped managing the unit in the same PR, so that preview's Git ref and probably its Amplify branch were left behind.

Options for the production branch:

- **A. Keep it dormant.** No change to AWS. Any build already on it stays publicly reachable on the default domain. It would be the pre-reset skeleton, built with production Auth0 and AppSync config at the time. `stage.ts` still allows a manual production deploy.
- **B. Remove it from the stack.** Delete `AccountsWebProductionBranch` and drop `production` from `HostedStage`, `parseStage` and `hostedUrlForStage`. The next `reconcile` deletes the Amplify branch, because a removed resource is deleted by CloudFormation. Then delete the `amplify/production` Git ref. With `enableBranchAutoDeletion`, deleting the Git ref alone would also disconnect the Amplify branch, outside CloudFormation's knowledge ([`EnableBranchAutoDeletion`](https://docs.aws.amazon.com/AWSCloudFormation/latest/TemplateReference/aws-resource-amplify-app.html)). The CDK change is the cleaner path. `platform-delivery.md` ("Remove a Deployment Unit") says not to infer authorization to destroy retained production resources, so this needs explicit approval.
- **C. Keep the branch but clear it.** Keep the resource for a future cutover, but stop or replace what it serves, for example by deploying the placeholder to it once by hand. This is still a manual production action.

The domain needs no change for preview and Develop. If a later cutover map wants a production hostname, it adds a sub-domain then. Leftover `amplify/pr-1579` cleanup is independent of the choice above.

## `amplify.yml`

Today's file (`amplify.yml:1-21`) has one monorepo application with `appRoot: applications/accounts/web`, matching the app's `AMPLIFY_MONOREPO_APP_ROOT` (`stack.ts:20-25`). It installs, builds required workspace packages, runs `yarn build`, and publishes `dist`. Amplify uses a repository `amplify.yml` in preference to console build settings ([Configuring build settings](https://docs.aws.amazon.com/amplify/latest/userguide/build-settings.html), [monorepo build settings](https://docs.aws.amazon.com/amplify/latest/userguide/monorepo-configuration.html)). Because `deploy.ts` starts a `RELEASE` job for an exact commit (lines 172-189), Amplify builds with the `amplify.yml` at that commit, which is the Release tag for Develop.

| Shape | `amplify.yml` changes |
| --- | --- |
| Placeholder (now) | None needed. |
| TanStack Start SPA on `WEB` (#1650) | `baseDirectory: dist/client` (as in `1.3.6`). Add `yarn codegen.graphql` only if GraphQL codegen returns. Write a Sentry token only if the observability decision needs source-map upload. Build-time `VITE_*` values arrive as branch environment variables set by `deploy.ts`. Today `deploy.ts` instead clears them (`update-branch --environment-variables {}`, lines 161-171). |
| TanStack Start on `WEB_COMPUTE` (#1650) | `baseDirectory: .amplify-hosting`, produced by Nitro's `aws_amplify` preset. Pin the Node runtime. Amplify reads `deploy-manifest.json` from that directory. |

A delivery gap in all cases: root `amplify.yml` changes neither cut an `@accounts/web` Release (outside the package path) nor select the unit for preview (`runtimeAffected: false`). The options:

- Restore the pre-reset preview-impact mapping of `amplify.yml` to `@accounts/web`, and accept that the Release side still needs an in-workspace change.
- Move the build spec into the CDK app's `BuildSpec` property ([`AWS::Amplify::App`](https://docs.aws.amazon.com/AWSCloudFormation/latest/TemplateReference/aws-resource-amplify-app.html)). This makes it workspace-owned, but it is then applied by `reconcile`, not per commit, and a repository `amplify.yml` would still override it.
- Accept the gap and pair any `amplify.yml` change with a workspace change.

## Where `WEB_COMPUTE` changes the answer

Per #1650, `WEB_COMPUTE` changes these delivery facts:

- **Stack:**
  - `platform: 'WEB_COMPUTE'`. This is an in-place update ([`Platform`](https://docs.aws.amazon.com/AWSCloudFormation/latest/TemplateReference/aws-resource-amplify-app.html), "No interruption").
  - The SPA custom rule must be dropped.
  - An `IAMServiceRole` is required.
  - An optional SSR compute role can be set at app level or per branch ([`ComputeRoleArn`](https://docs.aws.amazon.com/AWSCloudFormation/latest/TemplateReference/aws-resource-amplify-branch.html)).
  - Skew protection is optional (`EnableSkewProtection`).

  These are IAM resources in the shared stack. Reconciliation (see above) must run before the first compute deploy, and the GitHub Actions role must be able to create and pass them.
- **`deploy.ts`:**
  - Preview branches are created with `create-branch` (lines 146-157) and would need `--compute-role-arn` if the role is per branch.
  - The unconditional `--environment-variables {}` reset would erase any runtime configuration kept on branches. AWS advises against secrets in branch variables, so runtime secrets would come through the compute role.
- **Exception text:** it would have to describe the compute role and secret boundary, because "AWS permissions and secrets are limited to the owning unit" is a generated-workflow review item (`platform-delivery.md`).
- **`amplify.yml`:** `.amplify-hosting` artifacts (table above).
- **Previews:** each `amplify/pr-<n>` branch is a compute deployment with per-request and GB-hour cost (#1650). Teardown is unchanged (`delete-branch`).
- **Unchanged:** the catalog shape, the release behaviour, the production-target planning gap, and the production-branch options are the same on `WEB` and `WEB_COMPUTE`.

## Minimum change set (facts, not a recommendation)

Whatever #1664 decides, bringing the unit back for preview and Develop touches these areas:

1. **Manifest and docs:** remove `"private": true` from `applications/accounts/web/package.json`, in the same change as the catalog entry or before it. Update the workspace README and the "Accounts web reset" section of `.github/CONTEXT.md`.
2. **Planner:** a generator change so a Release Plan covers develop-only units (option A or B under "Omitting production"), with fixtures and tests (`generate.test.mjs`, `fixtures/`).
3. **Catalog entry:** add `accounts-web` with `targets: ["preview", "develop"]`, a decided `dependsOn` (`[]` or `["accounts-api"]`), a decided `expectedStacks` strategy (restore literal shared stacks, or `[]` plus a teardown-guard fix), and a rewritten `exception`.
4. **Templates:** override templates for preview, Develop and teardown with write-capable checkout. Add API config restoration for Develop when the app consumes it.
5. **Shared stack:** a decided shared-stack reconcile path.
6. **Production branch:** a decided treatment of `amplify/production` and the stale `amplify/pr-1579`.
7. **Regenerate and verify:** run `node .github/delivery/generate.mjs`, `--check`, and `node --test .github/delivery/*.test.mjs`.

## Open points not settled by primary sources

- **Live AWS state:** whether `accounts-web-hosting` currently has `/index.html` or `/_shell.html`, whether `amplify/production` has a successful build being served, and whether the `amplify/pr-1579` Amplify branch still exists. AWS access is needed to check.
- **GitHub token permissions:** whether pushing an `amplify/<stage>` ref whose commit contains `.github/workflows` changes needs the GitHub App `workflows` permission in every case. The pre-reset fragment requested it. GitHub's docs were not conclusive in the pages read.

## Effect on other tickets in the map

- **#1664:** the production-only Release Plan is a prerequisite generator change, not just a catalog edit. #1664 also has to choose the `expectedStacks` strategy and the production-branch treatment.
- **#1655 (rendering):** whichever mode is picked, the hosting stack change needs a reconcile path, which today does not exist in automation. `WEB_COMPUTE` adds IAM to the shared stack and changes `deploy.ts` env handling.
- **Local development and config tickets:** Develop needs the removed long-lived API config outputs restored once the app reads the AppSync URL.

## Source index

Repository (at `dbc0296b4` unless noted):

- `docs/agents/platform-delivery.md` — invariants (line 20), catalog responsibilities (86-104), adding a unit (122-160), removing a unit (161-169).
- `.github/CONTEXT.md` — Develop Environment definition and the "Accounts web reset" section (63-65).
- `.github/delivery/catalog.json`, `.github/delivery/README.md`.
- `.github/delivery/generate.mjs` — fields and regexes (11-28), `dependencyGraph` (134-164), `createPreviewImpact` (240-282), `createPreviewPlan` (374-499), `plannedUnits` (501-519), `createReleasePlan` (572-633), `createRepositoryReleasePlan` (711-745), `createReconciliationPlan` (779-808), `injectTeardownGuard` (1014-1049), `environmentReconciliationSteps` (1051-1135), `standardDeploymentJob` (1298-1345), `validateCatalog` (1784-1928).
- `.github/workflows/release.yml`, `.github/workflows/deploy-to-develop.yml`, `.github/workflows/deploy-to-environment.yml`.
- `.github/docs/adr/0001-release-driven-main-deployments.md`, `0003-complete-preview-plans-from-aws-state.md`, `0008-pass-client-configuration-as-job-outputs.md`.
- Root `package.json`, `amplify.yml`. `packages/semantic-release/{application.js,src/utils.js}`. `applications/accounts/web/{package.json,README.md,.releaserc.json,infrastructure/*}`.
- `node_modules/@qiwi/multi-semantic-release` 7.1.2 — `lib/getConfigMultiSemrel.js`, `lib/multiSemanticRelease.js`, `lib/getCommitsFiltered.js`.
- `755aa976` — catalog entry `accounts-web` and pre-reset `deploy.ts`. `13ca46195` (`@accounts/web@1.3.6`) — `amplify.yml`, `stack.ts`, templates.
- PR [#1579](https://github.com/motech-development/platform/pull/1579) — `97379a162`, `64bea7454` (pipeline restore: generator, templates, `release.yml`, docs, Sonar module), `3354829dc` (`private: true`).
- Git refs: `git ls-remote origin 'refs/tags/@accounts/web@*'` and `'amplify/*'`. GitHub Releases list for `@accounts/web@*`.
- Scratch probes of `validateCatalog`, `generateWorkflows`, `createReleasePlan`, `createReconciliationPlan`, `createPreviewPlan` and `createPreviewImpact` with an in-memory preview+develop `accounts-web` unit (not committed).

External:

- [qiwi/multi-semantic-release README](https://github.com/qiwi/multi-semantic-release#configuration) — `ignorePrivate`, `tagFormat`.
- [AWS::Amplify::App](https://docs.aws.amazon.com/AWSCloudFormation/latest/TemplateReference/aws-resource-amplify-app.html) — `Platform`, `EnableBranchAutoDeletion`, `IAMServiceRole`, `ComputeRoleArn`, `CustomRules`, `BuildSpec`.
- [AWS::Amplify::Branch](https://docs.aws.amazon.com/AWSCloudFormation/latest/TemplateReference/aws-resource-amplify-branch.html) — `Stage`, `ComputeRoleArn`, `EnableSkewProtection`, `BranchName` replacement.
- [Amplify build settings](https://docs.aws.amazon.com/amplify/latest/userguide/build-settings.html) and [monorepo build settings](https://docs.aws.amazon.com/amplify/latest/userguide/monorepo-configuration.html).
- [Research: TanStack Start rendering on Amplify (#1650)](https://github.com/motech-development/platform/blob/research/tanstack-start-amplify-rendering/applications/accounts/docs/research/tanstack-start-amplify-rendering.md).
