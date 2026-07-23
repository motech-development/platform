# Build publishable libraries with Vite

The libraries that previously invoked Rollup, together with Breeze UI, use Vite 8 and its Rolldown-based library mode. Each library owns its complete Vite configuration so that workspaces remain autonomous; similar configuration is deliberately not centralised. Builds emit JavaScript and source maps to `lib/`, TypeScript emits declarations separately, and runtime dependencies, peer dependencies, their subpaths, and Node.js built-ins remain external.

Browser libraries consumed by Vite applications are ESM-only: `appsync-apollo`, `auth`, `axios-hooks`, `ga-web-vitals`, and `query-string-hook`, alongside the already ESM-only Breeze UI. Libraries used by Node.js applications or CommonJS-loaded tooling continue to publish both ESM and CommonJS with their existing filenames: `api-gateway-handler`, `node-logger`, `s3-file-operations`, `serverless-outputs-env`, `webpack-conditional-plugin`, and `webpack-permissions-plugin`. This selective contract modernises packages whose known consumers support ESM without forcing CommonJS consumers to migrate.

## Consequences

- Breeze UI emits to `lib/`, uses `rolldownOptions`, and publishes JavaScript source maps.
- Libraries use Vite's default build target.
- Only libraries containing React TSX use `@vitejs/plugin-react`.
- Package tests remain on Jest for this migration. Moving them to Vitest is a separate decision so build and test-runner changes can be verified independently.
- A successful migration requires every library and in-repository consumer to build and pass its existing tests.
