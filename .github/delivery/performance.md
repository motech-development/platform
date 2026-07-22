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

| Path                       | Post-change run                                                                      |       Duration |
| -------------------------- | ------------------------------------------------------------------------------------ | -------------: |
| Exact installed cache hit  | First repeated run with unchanged installation inputs                                | Pending CI run |
| Archive fallback           | First run after a manifest-only installation-input change with an unchanged lockfile | Pending CI run |
| Cold install               | First run with a new dependency-cache and archive-cache key                          | Pending CI run |
| Workspace package build    | The accounts API and one leaf Deployment Unit                                        | Pending CI run |
| Small-value transfer       | Accounts API `Client configuration transfer` summary                                 | Pending CI run |
| Overall representative job | Accounts API and accounts storage job timestamps                                     | Pending CI run |

Do not compare queued time or unrelated deployment time. Use step timestamps for cache/build/transfer rows and job `startedAt`/`completedAt` for the overall row.

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

| Path                    | Pre-change evidence                | Post-change evidence source                                    |
| ----------------------- | ---------------------------------- | -------------------------------------------------------------- |
| ClamAV source build     | Included in the 325s combined step | `ClamAV source build (<route>)` job-summary row                |
| ClamAV cache restore    | Not present                        | `ClamAV cache restore` job-summary row                         |
| ClamAV cache validation | Not present                        | `ClamAV cache validation` job-summary row                      |
| Anti-virus packaging    | Included in the 325s combined step | `Anti-virus packaging` job-summary row                         |
| Anti-virus overall job  | 385s                               | Actions job `startedAt` and `completedAt`                      |
| Package equivalence     | Not tested                         | Cached/uncached archive inspection: six equivalent Lambda zips |

The first post-change source-build run establishes the miss baseline and saves the versioned binary cache. The next unchanged run establishes the hit baseline. Copy the four job-summary durations and the Actions overall-job timestamps into this section after those remote runs; queued time and definitions-update time are excluded from the comparison. Local package inspection is intentionally treated as correctness evidence, not a substitute for runner timing.
