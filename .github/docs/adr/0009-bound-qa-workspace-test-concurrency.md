# Bound QA workspace test concurrency

The QA unit-test job runs up to three workspace `test-ci` scripts concurrently while each Vitest suite uses `--no-file-parallelism`. Coverage remains in one job for SonarCloud analysis. This removes unnecessary workspace-level serialization without creating an unbounded process fan-out, and it does not alter the Playwright suites, their configuration, or their execution model.
