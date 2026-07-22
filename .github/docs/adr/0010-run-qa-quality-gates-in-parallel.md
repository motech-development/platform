# Run QA quality gates in parallel

The QA workflow has no shared setup job. Lint, unit tests with SonarCloud, and Chromatic are independent jobs that start together and invoke the common dependency setup themselves; PR labelling remains independent. The unit-test job alone builds the packages and prepares the Breeze UI browser dependency it needs, while Chromatic and lint avoid that work. A lockfile cache miss may cause concurrent installs on that uncommon run, but normal pull requests no longer serialize all quality gates behind lint and all-package preparation.
