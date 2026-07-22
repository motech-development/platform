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
