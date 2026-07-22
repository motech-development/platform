# Do not cache generated Serverless output

Deployment jobs do not cache `.serverless` directories or the existing per-application cache paths. Current deployments still perform their full Webpack build and packaging after a cache hit, the Webpack configurations do not enable a persistent filesystem cache, and commit-keyed output can cross environment boundaries even though generated Serverless state is stage-specific. A future tool-native compiler cache may be introduced only after an isolated benchmark demonstrates a benefit, and it must not share stage-specific output.
