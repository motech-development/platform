# Pass client configuration as job outputs

The accounts API deployment exposes its public AppSync URL and AWS region as explicit job outputs, and dependent client jobs recreate `.env.production` from those values. Actions cache is not used to transfer the tiny generated file: caches are not workflow hand-off artifacts, add disproportionate latency, and conceal the runtime dependency between the API and client jobs. These outputs contain public client configuration only; credentials and other secrets must not be transported this way.
