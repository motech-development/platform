# Use a two-tier dependency cache

Deployment jobs first restore an exact installed-dependencies cache keyed by the lockfile, Node version, Yarn configuration, and Yarn release. A hit bypasses both installation and Yarn's separate archive cache; only a miss restores the Yarn archive cache and runs `yarn install --immutable`. This avoids transferring both the installed tree and the much larger archive cache during the common path while retaining a fast, deterministic recovery path when dependency inputs change.
