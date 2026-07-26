# Accounts client framework and rendering options

Research snapshot: 26 July 2026

## Question

Which modern React framework or routing stack is credible for a parallel,
authenticated Accounts PWA when:

- framework-supported file routing is mandatory and the nested route folders
  must mirror the URL hierarchy;
- the default deployment remains static S3/CloudFront, with Amplify Hosting as
  the only alternative;
- runtime SSR is not intrinsically required;
- navigation should be type-safe and routes need loading, error, and
  code-splitting boundaries;
- the existing APIs and Playwright smoke-test contract cannot change; and
- performance gains must come from measurable client or perceived-performance
  improvements rather than assumed framework effects?

This note evaluates the framework/routing layer only. It does not choose the
GraphQL client or wider client-state approach.

## Finding

The decision-useful shortlist has two variants of one routing foundation:

1. **TanStack Router with Vite as a client-only SPA** is the smallest complete
   fit. It is not a full-stack framework, but its official Vite plugin generates
   the route tree from nested directories, provides end-to-end typed routing,
   route loading/error boundaries, automatic route code splitting, and
   preloading without introducing a runtime server.
2. **TanStack Start in SPA mode** provides the same Router foundation plus a
   framework-owned document shell and a path to server functions or hybrid
   rendering. Its own documentation says SPA mode needs only a CDN, but this
   application does not currently have evidence that Start's additional
   server-capable build/runtime surface creates user-visible value.

**React Router Framework Mode** is a capable reserve candidate for SPA
rendering, typed links, route modules, and automatic code splitting. It does
not, however, meet the literal folder-tree requirement with its first-party
filesystem convention: URL nesting is encoded in dot-delimited route names,
and route folders are organizational containers whose names define the whole
route path. Selecting it would require relaxing that requirement or introducing
custom route configuration, which recreates the manual routing concern.

**Next.js App Router** is screened out for the default hosting model. Its static
export does not support dynamic routes without `generateStaticParams()` or
routes with `dynamicParams: true`; Accounts routes contain company, client, and
transaction identifiers known only at runtime. Moving Next.js to Amplify
compute would solve that hosting mismatch at the cost of adopting a runtime
server before one has demonstrated a benefit.

The later architecture decision should therefore compare **Router-only SPA**
against **Start SPA**, not conduct a broad framework popularity contest. The
walking skeleton should build both candidates only far enough to measure their
production output and integration risks; choose Start only if a concrete
framework capability justifies its added surface.

## Repository evidence

The relevant baseline is already close to the Router-only option:

- The current client uses Vite, React 18, hand-authored nested React Router
  trees, Vitest, Playwright, and `vite-plugin-pwa`; its production build is a
  static `build` directory
  ([client package](../../client/package.json),
  [Vite configuration](../../client/vite.config.mts)).
- The new Breeze UI package is built and tested on Vite, React 19, TypeScript,
  Vitest, and Playwright, and declares React 19 as a peer dependency
  ([Breeze UI package](../../../../packages/breeze-ui/package.json)). Both
  shortlisted TanStack packages declare React 19 support
  ([Router package](https://www.npmjs.com/package/@tanstack/react-router),
  [Start package](https://www.npmjs.com/package/@tanstack/react-start)); this
  framework decision does not require holding the new app on React 18.
- The current route table is distributed through several components rather
  than derived from the filesystem. For example, company routes and account
  routes manually pair path strings with lazy components
  ([company routes](../../client/src/pages/MyCompanies/index.tsx),
  [account routes](../../client/src/pages/MyCompanies/Accounts/index.tsx)).
- Static assets are uploaded into the existing Accounts bucket. CloudFront
  turns an origin 403 into `/index.html` with a 200 response, so direct SPA
  deep links already have the required infrastructure pattern
  ([client deployment](../../client/serverless.yml),
  [Accounts CloudFront distribution](../../infrastructure/serverless.yml)).
- The PWA already uses an injected Workbox service worker with an app-shell
  navigation fallback, precaching, and runtime caches
  ([service worker](../../client/src/service-worker.ts)). PWA installability is
  therefore a build-and-deployment capability that should be preserved, not a
  reason by itself to add a server framework.
- Auth0 currently stores tokens in browser local storage. The authenticated
  Apollo client obtains an access token through the React Auth0 SDK in the
  browser before calling AppSync
  ([application bootstrap](../../client/src/index.tsx),
  [Apollo integration](../../client/src/components/ApolloClient.tsx)).
  Consequently, runtime SSR cannot preload authenticated AppSync data without a
  separate authentication/token-handling redesign. SSR would otherwise
  pre-render only the unauthenticated shell.
- The existing browser gate is a Chromium Playwright project against a served
  production build
  ([Playwright configuration](../../client/playwright.config.ts)). Both
  shortlisted options can continue to expose a static production server to the
  unchanged suite.

## Comparison

| Concern | TanStack Router + Vite SPA | TanStack Start SPA mode | React Router Framework SPA |
| --- | --- | --- | --- |
| Literal URL/folder mirroring | **Direct fit.** Nested directory routes such as `routes/app/users/$userId/edit.tsx` generate the corresponding nested URL and component tree. A `route.tsx` file can define the layout at each directory path. | **Direct fit.** Start uses TanStack Router's file routing, so the same directory-only convention can be required. | **Does not meet the literal constraint.** `@react-router/fs-routes` is official, but nesting is expressed with dot-delimited names. A route folder contains `route.tsx`, yet the folder name defines the entire route path; nested folders do not represent nested URL segments. |
| Static S3/CloudFront output | Ordinary Vite SPA assets and `index.html`; this matches the present deployment shape. Existing CloudFront fallback can remain conceptually unchanged. | Official SPA mode prerenders a root shell to `/_shell.html` and documents CDN-only hosting plus a catch-all rewrite. CloudFront would need to target the configured shell rather than assume `/index.html`. | Official SPA mode emits `build/client/index.html`; all URLs must rewrite to that file. This maps cleanly to the current CloudFront rule. |
| Type safety | Generated route tree provides typed navigation, params, search parameters, loader data, and route context. | Same Router type system. | Framework type generation covers route module params/data, and the `href()` utility validates paths and parameters. |
| Loading and error boundaries | Pending, error, and not-found components are route configuration. Automatic code splitting separates non-critical route components, pending UI, and error UI. | Same route capabilities, with a build-prerendered pending shell available in SPA mode. | Route modules provide loading/hydration fallbacks and nearest error boundaries. Route modules are automatic bundler entry points, and client loader/action exports can be split from components. |
| Perceived performance tools | Intent, viewport, and render-based preloading can warm route chunks and loaders. Router caching can defer to a separate server-state cache rather than duplicate it. | Same Router preload model; Start adds a build-time HTML shell, not faster authenticated AppSync responses. | Automatic route splitting and route-module splitting reduce initial JavaScript. Client loaders/actions can expose route-level pending UI, but authenticated API latency remains unchanged. |
| PWA fit | The existing Vite PWA/Workbox pattern is directly reusable. | Vite plugins remain available, but Start produces multiple build environments and a different SPA shell. PWA output, service-worker scope, precache contents, and updates must be proved in the walking skeleton rather than assumed. | It uses a Vite plugin and static client output, so `vite-plugin-pwa` is plausible. Integration still needs a build proof because React Router prerenders the root even with runtime SSR disabled. |
| Authentication | Official Router guidance supports passing React auth state through typed router context and guarding a pathless layout with `beforeLoad`, which matches Auth0's hook-based SDK. | Same Router approach; Start's server authentication primitives are unnecessary in SPA mode. | Client middleware/loaders can guard routes, but Auth0 browser state still needs an explicit hydration boundary. |
| Testability | Official guidance uses Vitest/Testing Library with browser or memory history. Generated file routes should be exercised mostly through integration tests, with feature components kept independently testable. | Same route test primitives, plus build-shell and hydration tests. | `createRoutesStub` supports reusable components, but the official guide warns that it is incompatible with directly testing Framework Mode route components using generated `Route.*` types and recommends integration/E2E coverage for whole routes. |
| Hybrid/runtime runway | Router itself is client-first. Migrating to Start later is possible but is still an architectural change that should not be claimed as free. | Native runway to SSR, server functions, and routes. On Amplify, non-Next SSR frameworks need an adapter or post-build output conforming to Amplify's deployment specification. | Runtime SSR is a configuration switch, but would require Amplify compute and a server-readable auth design to improve authenticated data loading. |
| Added surface | Lowest: React, Vite, Router plugin, generated route tree, PWA tooling. | Higher: framework document/build conventions and server-capable concerns remain present even in SPA mode. | Moderate, but fails the hard route-folder convention unless scope changes. |

### Primary-source support for the comparison

- TanStack describes file-based routes as files and directories that mirror the
  URL structure and shows nested directory layouts, dynamic segments, and
  `route.tsx` layout files
  ([file-based routing](https://tanstack.com/router/latest/docs/routing/file-based-routing),
  [routing concepts](https://tanstack.com/router/latest/docs/routing/routing-concepts)).
  The bundler plugin generates the route configuration during development and
  builds; the generated route tree is runtime source and is intended to be
  committed
  ([Router FAQ](https://tanstack.com/router/latest/docs/faq)).
- TanStack's Vite plugin can automatically split non-critical route
  configuration, including route, pending, error, and not-found components
  ([code splitting](https://tanstack.com/router/latest/docs/guide/code-splitting)).
  Automatic splitting is opt-in in Router v1, so the walking skeleton must
  enable and inspect it rather than assume it
  ([file-routing API](https://tanstack.com/router/latest/docs/api/file-based-routing)).
- TanStack Router documents intent, viewport, and render preloading, and
  explicitly explains how to let an external server-state cache own freshness
  ([preloading](https://tanstack.com/router/latest/docs/guide/preloading)).
  Its authentication guide shows hook-based React auth passed through router
  context and checked by a pathless layout's `beforeLoad`
  ([authenticated routes](https://tanstack.com/router/latest/docs/guide/authenticated-routes)).
- TanStack Start documents SPA mode specifically for applications that do not
  need SSR. It says a CDN is sufficient, records the slower-time-to-content
  trade-off, emits `/_shell.html`, and requires unmatched URLs to rewrite to
  that shell
  ([Start SPA mode](https://tanstack.com/start/latest/docs/framework/react/guide/spa-mode)).
- React Router documents `ssr: false` SPA mode, build-time root prerendering,
  client loaders/actions, static `build/client` output, and a catch-all
  `index.html` rewrite
  ([React Router SPA mode](https://reactrouter.com/how-to/spa)).
  Route modules provide automatic code splitting, data/loading APIs, and error
  boundaries
  ([route modules](https://reactrouter.com/start/framework/route-module),
  [code splitting](https://reactrouter.com/explanation/code-splitting)).
  Its generated types and typed `href()` cover route params/data and navigation
  ([type safety](https://reactrouter.com/explanation/type-safety),
  [`href`](https://reactrouter.com/api/utils/href)).
- React Router's filesystem guide explicitly says `@react-router/fs-routes`
  uses dot delimiters for URL nesting and that, when a route is represented by
  a folder, the path is completely defined by the folder name
  ([file-route conventions](https://reactrouter.com/how-to/file-route-conventions)).
  Its testing guide recommends E2E/integration tests for Framework Mode route
  components because `createRoutesStub` does not align with their generated
  route types
  ([testing](https://reactrouter.com/start/framework/testing)).
- `vite-plugin-pwa` can generate and inject a manifest, service worker, and
  registration into a Vite build; its `injectManifest` strategy builds a
  custom Workbox service worker
  ([Vite PWA setup](https://vite-pwa-org.netlify.app/guide/),
  [service-worker strategies](https://vite-pwa-org.netlify.app/guide/service-worker-strategies-and-behaviors)).
  This is evidence that each Vite option can support a PWA, not proof that every
  framework/plugin combination emits the correct production artifacts.
- Next.js's App Router static-export guide lists dynamic routes without
  `generateStaticParams()` and dynamic routes with `dynamicParams: true` as
  unsupported
  ([Next.js static exports](https://nextjs.org/docs/app/guides/static-exports)).
  Next can build a PWA, but its official guide treats offline caching as a
  separate service-worker integration and notes that static export moves
  server features back to external APIs
  ([Next.js PWA guide](https://nextjs.org/docs/app/guides/progressive-web-apps)).
- Amplify can host arbitrary JavaScript SSR frameworks only when an adapter or
  post-build process produces its `.amplify-hosting` static/compute/manifest
  contract
  ([Amplify SSR frameworks](https://docs.aws.amazon.com/amplify/latest/userguide/server-side-rendering-amplify.html),
  [deployment specification](https://docs.aws.amazon.com/amplify/latest/userguide/ssr-deployment-specification.html)).
  Amplify's documented SPA rewrite is straightforward for a purely static
  candidate
  ([Amplify SPA rewrites](https://docs.aws.amazon.com/amplify/latest/userguide/redirect-rewrite-examples.html)).

## Rendering and performance conclusion

Use **client-side rendering on static hosting as the default hypothesis**.
Neither runtime SSR nor a hybrid runtime can reduce AppSync's underlying
latency. With the current browser-held Auth0 token, a server cannot start the
authenticated AppSync request on the user's behalf without an additional auth
design.

Both Start SPA and React Router SPA demonstrate a useful middle ground:
build-time rendering of a stable application/pending shell. That can improve
the first visual response while keeping authenticated content client-rendered.
The same outcome can be designed deliberately in a Router-only Vite
`index.html`, so it is not by itself sufficient reason to add Start.

Client-controlled performance should instead be measured through:

- route and feature chunk size, including whether Breeze UI imports tree-shake;
- time from navigation intent to usable route;
- whether route preloading overlaps AppSync requests safely;
- stable shell and route-specific pending UI during API latency;
- duplicate GraphQL operations introduced by loaders, auth readiness, or React
  transitions;
- cold network launch versus service-worker-controlled repeat launch; and
- responsiveness while large transaction, PDF, and report features load.

Server or hybrid rendering should graduate from a future option only if a
measured flow identifies an improvement that cannot be achieved by chunking,
prefetching, caching, optimistic feedback, or progressive client rendering.
That decision must include the cost of moving from static S3/CloudFront to
Amplify compute and proving a supported build adapter.

## Walking-skeleton evidence required before selection

Build the same minimal vertical slice with Router-only SPA and Start SPA. It
does not need production UI, but each candidate must prove:

1. A strictly directory-based tree such as
   `routes/companies/$companyId/accounts/transactions/$transactionId`, with a
   route layout and error/pending boundary at meaningful levels. Do not use
   flat dot notation or virtual/manual route configuration.
2. Compile-time failures for an invalid destination, missing path parameter,
   and invalid typed search state.
3. Auth0 redirect, callback restoration, refresh-token readiness, and a
   protected pathless layout without rendering protected content early.
4. One existing AppSync query, mutation, and subscription through the chosen
   data client, with operation counts recorded to detect duplicate loading.
5. A production build whose chunk graph demonstrates route-level splitting and
   whose deep dynamic URL loads correctly through the actual S3/CloudFront
   fallback.
6. Manifest installability, Workbox app-shell precaching, direct navigation
   while service-worker controlled, and a deterministic update path. Inspect
   the emitted service worker and precache manifest.
7. A representative existing Playwright smoke path without altered test data
   or assertions.
8. Comparable cold-load, route-transition, and repeat-PWA-launch measurements
   under the same network and CPU profile.

## Decision boundary

Choose **TanStack Router + Vite** if the application needs a modern,
file-routed, type-safe SPA and the Start candidate cannot demonstrate a
present-tense benefit. This keeps the architecture aligned with the actual
static authenticated system and makes every additional state/data library an
explicit choice.

Choose **TanStack Start in SPA mode** only if its framework-owned shell,
route/document conventions, or a near-term, evidenced server capability
outweigh the larger build and hosting surface. “We might want SSR later” is not
enough: authenticated SSR presently needs a separate auth decision and
Amplify-hosted compute.

Keep **React Router Framework Mode** out of the final choice unless the
folder-to-URL rule is deliberately relaxed. Keep **Next.js** out unless the
default static-hosting requirement is replaced by a runtime-hosting decision
and its dynamic authenticated routes are proved on the permitted Amplify
platform.
