# Delivery performance measurements

This document records the pre-change reference and the measurement protocol for the dependency and workflow-transfer optimisation. Step durations come from GitHub Actions timestamps; cache post-save time is included where the old cache incurred it.

## Pre-change reference

| Path                       |                                                                                                          Representative observation | Source                                                                                                               |
| -------------------------- | ----------------------------------------------------------------------------------------------------------------------------------: | -------------------------------------------------------------------------------------------------------------------- |
| Exact installed cache hit  | 11s restore + 10s post-save for installed dependencies; the separate package-output cache added another 11s restore + 10s post-save | [Preview run 29852527144](https://github.com/motech-development/platform/actions/runs/29852527144), accounts storage |
| Archive fallback           |                                                                    71s dependency install after the setup-node Yarn archive restore | [Release run 29858869933](https://github.com/motech-development/platform/actions/runs/29858869933), Packages         |
| Cold install               |                                              Not distinguishable in the old workflow because setup-node hid the archive-cache route | Same Release workflow limitation                                                                                     |
| Workspace package build    |                                                                                   33s for the old all-workspace `yarn package` step | [QA run 29916667526](https://github.com/motech-development/platform/actions/runs/29916667526), Type check            |
| Small-value transfer       |                                                  1s restore for the cache-backed `.env.production` file, plus cache post-processing | [Preview run 29852527144](https://github.com/motech-development/platform/actions/runs/29852527144), client shard 1   |
| Overall representative job |                                                                                    145s for accounts API; 150s for accounts storage | [Preview run 29852527144](https://github.com/motech-development/platform/actions/runs/29852527144)                   |

## Post-change capture

The reusable dependency action writes `Dependency setup (<route>)` to the job summary and distinguishes exact installed cache hit, archive fallback, and cold install. Every selected Deployment Unit records its manifest-rooted workspace package build, and the API job records the small-value client configuration transfer. GitHub's job timestamps remain the source for overall representative job timing.

Capture the first post-change run for each route in this table:

| Path                       | Post-change run                                                                                                                                  |               Duration |
| -------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------ | ---------------------: |
| Exact installed cache hit  | [Preview run 29937430985](https://github.com/motech-development/platform/actions/runs/29937430985), accounts API and storage                     |   14s API; 13s storage |
| Archive fallback           | First run after a manifest-only installation-input change with an unchanged lockfile                                                             |         Pending CI run |
| Cold install               | First run with a new dependency-cache and archive-cache key                                                                                      |         Pending CI run |
| Workspace package build    | [Preview run 29937430985](https://github.com/motech-development/platform/actions/runs/29937430985), accounts API and storage                     |     5s API; 6s storage |
| Small-value transfer       | [Preview run 29937430985](https://github.com/motech-development/platform/actions/runs/29937430985), accounts API `Client configuration transfer` |                     1s |
| Overall representative job | [Preview run 29937430985](https://github.com/motech-development/platform/actions/runs/29937430985), accounts API and storage                     | 140s API; 186s storage |

Do not compare queued time or unrelated deployment time. Use step timestamps for cache/build/transfer rows and job `startedAt`/`completedAt` for the overall row.

The completed Preview jobs restored exact installed dependencies; their Yarn archive restore and immutable install steps were skipped. Archive-fallback and cold-install measurements therefore remain outstanding.

## Representative workflow timings

Pull-request QA and Preview duration are measured from the Actions run `createdAt` and `updatedAt` timestamps because their workflow boundaries remain comparable. Release duration is the `Packages` job, and each long-lived environment is measured from the start of its setup job to its last completed delivery job. These like-for-like phase boundaries avoid counting Develop and production inside the post-change Release total while still including the duplicate quality work removed from the pre-change production path. The runs are representative scenarios rather than identical workloads, so the comparison demonstrates observed critical-path movement rather than a universal runtime guarantee.

| Scenario         | Pre-change evidence                                                                                | Post-change evidence                                                                               | Observed change  |
| ---------------- | -------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------- | ---------------- |
| Pull-request QA  | [Run 29852527127](https://github.com/motech-development/platform/actions/runs/29852527127): 12m30s | [Run 29936655234](https://github.com/motech-development/platform/actions/runs/29936655234): 7m31s  | -4m59s (-39.9%)  |
| Complete Preview | [Run 29852527144](https://github.com/motech-development/platform/actions/runs/29852527144): 71m55s | [Run 29937430985](https://github.com/motech-development/platform/actions/runs/29937430985): 58m29s | -13m26s (-18.7%) |
| Release          | [Run 29858869933](https://github.com/motech-development/platform/actions/runs/29858869933): 3m56s  | [Run 30030810456](https://github.com/motech-development/platform/actions/runs/30030810456): 2m50s  | -1m06s (-28.0%)  |
| Develop          | [Run 29858869878](https://github.com/motech-development/platform/actions/runs/29858869878): 27m59s | [Run 30030810456](https://github.com/motech-development/platform/actions/runs/30030810456): 15m13s | -12m46s (-45.6%) |
| Production       | [Run 29858869881](https://github.com/motech-development/platform/actions/runs/29858869881): 47m49s | [Run 30030810456](https://github.com/motech-development/platform/actions/runs/30030810456): 18m01s | -29m48s (-62.3%) |

The post-change Preview created the complete preview-capable topology and passed both unchanged Playwright shards. Its longest application step was the accounts warm-up command, which ran for 27m11s and remains part of the observed Preview critical path.

The post-change Release published and resolved exact owning-workspace tags before starting Develop and production independently from the same Release Plan. Release duration is the `Packages` job. Environment duration is measured from the start of that environment's setup job to its last completed delivery job. Develop and production setup began one second apart, and successful GitHub Deployments recorded matching shared-unit tags including `@core/anti-virus@1.7.1` and `@accounts/api@1.13.1`.

This was the first complete post-cutover reconciliation, so it establishes Release, Develop, production, exact-tag, parallel-launch, and Environment State timing evidence. It does not replace the outstanding selective Release scenario.

## Delivery maintenance evidence

The parent specification measures the hand-maintained delivery model at the catalog-and-generator boundary; generated workflow YAML may remain verbose. At the pre-cutover commit [`958404b4`](https://github.com/motech-development/platform/commit/958404b4d4b4761eafca7f05cec508af46ebf6ff), the four environment delivery workflows contained 3,196 lines. The current catalog and generator contain 2,044 lines, a reduction of 1,152 lines (36.0%).

| Maintenance source                   | Pre-cutover lines | Current lines |
| ------------------------------------ | ----------------: | ------------: |
| Preview delivery workflow            |               919 |             — |
| Develop delivery workflow            |               674 |             — |
| Production delivery workflow         |             1,030 |             — |
| Teardown workflow                    |               573 |             — |
| Deployment Catalog                   |                 — |           119 |
| Dependency-free workflow generator   |                 — |         1,925 |
| **Measured delivery model boundary** |         **3,196** |     **2,044** |

Line counts use `wc -l` against the four workflows at `958404b4` and the current `.github/delivery/catalog.json` and `.github/delivery/generate.mjs`. Generated workflows are excluded from both sides.

The current target-specific templates contain a further 2,075 hand-maintained lines. They preserve explicit operational overrides for credentials, cleanup, publication, validation, and other non-standard behaviour; they are not topology duplicated from the catalog. Including those templates produces 4,119 lines of current delivery source, so the 36.0% result is specifically a reduction in the measured catalog-and-generator model, not an overall repository line reduction.

The maintenance contract was also checked for consistent terminology and ownership across the [Platform Delivery glossary](../CONTEXT.md), [release planning](../docs/adr/0001-release-driven-main-deployments.md), [generated job graph](../docs/adr/0002-generate-the-deployment-job-graph.md), [Preview reconciliation](../docs/adr/0003-complete-preview-plans-from-aws-state.md), [parallel long-lived environments](../docs/adr/0013-deploy-develop-and-production-in-parallel.md), [Environment State reconciliation](../docs/adr/0014-reconcile-superseded-main-deployments.md), [delivery README](./README.md), [agent guide](../../docs/agents/platform-delivery.md), and [parent specification #1492](https://github.com/motech-development/platform/issues/1492). They consistently assign topology to the Deployment Catalog, dependency and job-graph derivation to the generator, target-specific exceptions to templates, and the generated workflows to generated output rather than a second maintenance surface.

## Ordinary Lambda packaging evidence

Webpack baselines and esbuild candidates were packaged sequentially on macOS arm64 with Node 24.14.1, Yarn 4.14.1, and osls 3.63.2. Each command used `serverless package --stage benchmark --package <temporary-directory>` with equivalent placeholder deployment variables. Wall-clock time is `/usr/bin/time -p` real time; it includes dependency materialisation performed by the packaging plugin.

| Deployment Unit        | Handler archives | Webpack baseline | Esbuild candidate | Time change | Handler archive bytes, baseline → candidate | Size change |
| ---------------------- | ---------------: | ---------------: | ----------------: | ----------: | ------------------------------------------: | ----------: |
| Accounts API           |                2 |           18.04s |             9.79s |      -45.7% |                     30,685,744 → 18,305,893 |      -40.3% |
| Accounts queue         |               11 |           60.70s |            20.85s |      -65.7% |                   194,252,640 → 162,753,656 |      -16.2% |
| Accounts notifications |                1 |            7.75s |             4.67s |      -39.7% |                       3,400,270 → 1,083,126 |      -68.1% |
| Accounts reports       |                7 |           40.35s |            17.54s |      -56.5% |                   122,777,679 → 103,197,515 |      -15.9% |
| Accounts warm-up       |                2 |           16.49s |            11.46s |      -30.5% |                     38,260,458 → 30,368,308 |      -20.6% |
| Accounts storage       |                4 |           25.10s |             9.70s |      -61.4% |                     38,267,270 → 31,389,935 |      -18.0% |
| Accounts data          |                6 |           57.49s |            15.54s |      -73.0% |                    113,029,481 → 90,756,282 |      -19.7% |

All seven accepted candidates retain `package.individually: true`, one separately named archive per configured handler, and source maps. Accounts storage also retains the plugin-generated `custom-resources.zip` byte-for-byte. Normalised compiled CloudFormation templates are equivalent to the Webpack baselines after excluding time-derived API Gateway deployment identifiers and Lambda code hashes/keys. This covers the accounts API schemas and mapping templates as well as the other non-code resources.

Every accepted archive exposes its configured handler when loaded from the archive. Bundled code that uses `@sentry/profiling-node` keeps that package external so its dynamic native-module selection remains intact; inspection confirmed the Node 24 Linux x64 glibc profiler binary in every affected archive. Targeted Jest suites and blocking TypeScript checks passed for every evaluated workspace. The Preview Environment and unchanged Playwright gate remain required remote validation before cutover.

Core communications remains on Webpack. Its 11.66s baseline produced one 17,716,027-byte archive; repeated esbuild candidates took 9.99s and 14.31s and produced a 14,806,797-byte archive. The inconsistent timing does not establish a material packaging improvement, so the safer native-profiler-compatible Webpack path is retained. Removing only the redundant Fork TypeScript Checker reduced the retained Webpack package to 10.49s without changing its archive mapping or runtime dependencies.

Core anti-virus is not an ordinary candidate: ADR 0005 and ADR 0011 retain its specialised Webpack plugins for conditional files, compiled binaries, and executable permissions.

## Anti-virus cache evidence

The pre-change reference is the anti-virus job in [Preview run 29852527144](https://github.com/motech-development/platform/actions/runs/29852527144). It ran from 17:44:06 to 17:50:31 UTC (385s overall). Its combined `Deploy` step ran from 17:44:40 to 17:50:05 UTC (325s), but the old command did not distinguish the ClamAV source build, Webpack packaging, and CloudFormation deployment. It had no ClamAV binary restore or validation steps.

| Path                    | Pre-change evidence                | Post-change evidence                                                                                                                                                                                                       |
| ----------------------- | ---------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| ClamAV source build     | Included in the 325s combined step | [Miss run 29937430985](https://github.com/motech-development/platform/actions/runs/29937430985): 183s; [hit run 29943128323](https://github.com/motech-development/platform/actions/runs/29943128323): 1s cached predeploy |
| ClamAV cache restore    | Not present                        | [Miss run 29937430985](https://github.com/motech-development/platform/actions/runs/29937430985): under 1s; [hit run 29943128323](https://github.com/motech-development/platform/actions/runs/29943128323): 3s              |
| ClamAV cache validation | Not present                        | [Miss run 29937430985](https://github.com/motech-development/platform/actions/runs/29937430985): under 1s; [hit run 29943128323](https://github.com/motech-development/platform/actions/runs/29943128323): under 1s        |
| Anti-virus packaging    | Included in the 325s combined step | [Miss run 29937430985](https://github.com/motech-development/platform/actions/runs/29937430985): 88s; [hit run 29943128323](https://github.com/motech-development/platform/actions/runs/29943128323): 75s                  |
| Anti-virus overall job  | 385s                               | [Miss run 29937430985](https://github.com/motech-development/platform/actions/runs/29937430985): 549s; [hit run 29943128323](https://github.com/motech-development/platform/actions/runs/29943128323): 209s                |
| Package equivalence     | Not tested                         | Cached/uncached archive inspection: six equivalent Lambda zips                                                                                                                                                             |

The first post-change source-build run establishes the miss baseline and saved the versioned binary cache. Its overall time includes a 19s definitions update that the pre-change reference did not run. The repeated deployment restored and validated the 72 MB binary cache, bypassed the 183s source build, and reduced the overall job by 340s (61.9%) against the miss run. Local package inspection remains correctness evidence rather than a substitute for runner timing.
