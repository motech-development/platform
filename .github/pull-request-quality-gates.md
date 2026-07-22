# Pull-request quality gates

Pull requests are the only blocking quality-gate path. The protected `main` branch requires every context in `required-status-checks.json`; a failed check, or a required context that is not reported, prevents merging.

The Quality assurance workflow starts formatting, linting, type-checking, unit tests with SonarCloud, Chromatic, and delivery-catalog drift validation independently. Unit-test workspaces run with at most three concurrent processes. Individual Jest workspaces continue to use `--runInBand` in their own `test-ci` scripts. The Preview Environment workflow reports `Preview` for deployment and `Playwright` for the unchanged end-to-end suite; both report a successful not-applicable result for non-runtime changes.

`Storybook Publish` is the required Storybook health check. It confirms that Chromatic successfully built and published Storybook. The Actions `Chromatic` job exits after upload so a runner does not wait for provider-side processing. Chromatic-native `UI Tests`, `UI Review`, and manual visual review remain optional and informational: usage limits or provider configuration may prevent those statuses from being reported, so they must not block merging.

## Apply and verify branch protection

Apply the checked-in contexts only after a pull request has reported the new workflow job names and a successful `Storybook Publish` status:

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

## Storybook publication proof

Before completing the cutover, use a pull request that exercises Storybook publication to verify the provider boundary:

1. Confirm the independent Actions `Chromatic` job uploads the Storybook build successfully.
2. Confirm Chromatic reports a successful `Storybook Publish` status.
3. Confirm `UI Tests` and `UI Review` are absent from `required-status-checks.json`, regardless of whether Chromatic reports them.
4. Confirm every context in `required-status-checks.json` is present and successful.

Delivery and Storybook publication workflows must not repeat formatting, linting, type-checking, unit tests, SonarCloud analysis, or Chromatic validation. Storybook publication is a pull-request health check only; optional visual-review activity and any other retained post-merge reporting must not gate Release or environment delivery.
