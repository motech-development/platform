# Standardise unit tests on Vitest

All workspaces with unit-test quality gates use Vitest 4 and the V8 coverage provider. Each workspace owns a complete `vitest.config` file that preserves its test discovery, Node or jsdom environment, setup files, module aliases, coverage inputs, and exclusions.

The workspace scripts are:

- `test`: `vitest --no-file-parallelism`
- `test-ci`: `vitest run --coverage --no-file-parallelism`

The QA job may run up to three workspace scripts concurrently, but test files remain serial within each workspace. This preserves suites that share mocks, fake time, process state, or other mutable fixtures while retaining the existing bounded workspace-level concurrency.

Tests use Vitest's native mocks, timers, assertions, and snapshot format. Global test APIs remain enabled to minimise incidental test churn. DOM suites load `@testing-library/jest-dom/vitest`, and AWS SDK client mocks use their Vitest matcher integration. V8 continues to emit LCOV files in each workspace's `coverage/` directory for SonarCloud.

## Consequences

- Unit-test discovery, case names, environments, snapshot payloads, coverage inputs, and setup behaviour must remain equivalent to the pre-migration baseline.
- Complete package-local configuration is intentionally preferred over a shared abstraction so each autonomous workspace exposes its full contract.
- Serial test-file execution costs some local parallelism, but prevents multiplying QA's three-workspace concurrency by runner-managed file workers.
- Browser and end-to-end suites keep their existing runners and execution model.
- The previous unit-test runner and its runner-specific transforms, environments, matchers, lint plugin, types, watch plugins, and date helpers are removed rather than maintained in parallel.

## Rejected alternatives

- A dual-runner transition was rejected because it would duplicate configuration and allow discovery or coverage behaviour to diverge.
- A shared root Vitest configuration was rejected because workspace environments, aliases, setup, and coverage contracts differ, and centralising them would obscure those boundaries.
- Enabling file-level parallelism was rejected because several suites deliberately depend on serial mutable state and the QA workflow already supplies bounded concurrency across workspaces.
