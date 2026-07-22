# Cache the anti-virus toolchain output

Anti-virus deployments reuse the compiled ClamAV binaries in `applications/core/anti-virus/bin` instead of rebuilding ClamAV in Amazon Linux for every deployment. `build-inputs.env` pins the container, toolchain packages, CMake options, ClamAV source revision, and source checksum. The cache key hashes those inputs together with the build and validation scripts rather than an application commit.

A successful source build records its input revision and a checksum manifest for every cached file. A restored directory is accepted only when its revision matches, its entries and checksums exactly match the manifest, and `clamscan` and `freshclam` are regular executable files. Any absent or invalid restoration is removed before `predeploy` rebuilds it.

The existing conditional copy and permissions Webpack plugins remain the packaging seam. Delivery runs `predeploy` and `serverless package` as separately timed steps, writes the package to a runner-temporary directory, and deploys it without rebuilding. Cache metadata is excluded from the Lambda archives, Serverless output is not cached across stages, and this optimization does not introduce a Lambda layer or change the individual function topology.
