# Pull-request quality gates

Pull requests are the only blocking quality-gate path. The protected `main` branch requires every context in `required-status-checks.json`; a failed check, or a required context that is not reported, prevents merging.

The Quality assurance workflow starts linting, type-checking, unit tests with SonarCloud, Chromatic, and delivery-catalog drift validation independently. Unit-test workspaces run with at most three concurrent processes. Individual Jest workspaces continue to use `--runInBand` in their own `test-ci` scripts.

`UI Tests` and `UI Review` are Chromatic-native checks. Keep both features enabled for the linked Chromatic project. The Actions `Chromatic` job exits after upload so a runner does not wait for review; the native checks remain pending until visual differences have been accepted and the Visual Review checklist is complete. A pull-request author may accept their own snapshots and approve their own Visual Review. Assigned default reviewers, if any, must still complete their approvals.

## Apply and verify branch protection

Apply the checked-in contexts only after a pull request has reported the new workflow job names:

```sh
gh api \
  --method PUT \
  repos/motech-development/platform/branches/main/protection/required_status_checks/contexts \
  --input .github/required-status-checks.json
```

Verify that GitHub and the checked-in contract contain the same contexts:

```sh
test "$(gh api repos/motech-development/platform/branches/main/protection/required_status_checks/contexts | jq -c 'sort')" = "$(jq -c '.contexts | sort' .github/required-status-checks.json)"
```

Do not remove `Playwright` or alter its workflow, configuration, shards, workers, retries, or commands as part of quality-gate maintenance.

## Visual-change proof

Before completing the cutover, use a pull request with a genuine visible Storybook change to verify the provider boundary:

1. Confirm `UI Tests` reports the visual differences and remains pending before the snapshots are accepted.
2. Confirm `UI Review` remains pending before the Visual Review checklist is approved.
3. Have the pull-request author accept the snapshots and approve the Visual Review.
4. Confirm `UI Tests` and `UI Review` pass, then confirm every context in `required-status-checks.json` is present and successful.

Delivery and Storybook publication workflows must not repeat linting, type-checking, unit tests, SonarCloud analysis, or Chromatic validation. Accepted Chromatic baselines and any other retained post-merge reporting must not gate Release or environment delivery.
