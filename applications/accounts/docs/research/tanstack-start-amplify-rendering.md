# TanStack Start rendering on AWS Amplify Hosting

## Research question

Which rendering modes can current TanStack Start use on AWS Amplify Hosting? How does SPA mode on the `WEB` platform compare with SSR or hybrid rendering on `WEB_COMPUTE`? The comparison covers build and deploy shape, previews and branch deploys, cold starts and latency, cost, authentication (browser tokens or server sessions, with Auth0 now and Cognito later), and changes to the existing `accounts-web-hosting` CDK stack.

This note resolves [Research: TanStack Start rendering on Amplify](https://github.com/motech-development/platform/issues/1650), part of map [#1649](https://github.com/motech-development/platform/issues/1649). It lays out facts and trade-offs only. The decision belongs to [Choose the rendering mode for Accounts web](https://github.com/motech-development/platform/issues/1655). The earlier decision [#1533](https://github.com/motech-development/platform/issues/1533) (SPA mode on `WEB`) is treated as prior art.

Researched on 2026-10-13 against these versions (npm registry, same day):

| Package | Version |
| --- | --- |
| `@tanstack/react-start` | 1.169.1 (depends on `@tanstack/start-plugin-core` 1.171.52) |
| `@tanstack/react-router` | 1.170.44 |
| `nitro` | 3.0.260903-beta (the `latest` dist-tag is still a v3 beta) |
| `@auth0/auth0-react` | 2.28.2 |
| `@auth0/auth0-tanstack-start-react` | `latest` 1.0.0-beta.0, `beta` 1.0.0-beta.2 |
| `aws-amplify` | 6.22.1 |
| `vite` | 8.3.4 (the workspace pins 8.1.5) |

## Result

TanStack Start can run on Amplify in three shapes:

1. **SPA mode on `WEB`.** Start prerenders a static `/_shell.html`, and Amplify serves it as plain static hosting. This is the smallest change from today's stack. It has no server runtime, so server functions and server routes are not available.
2. **SSR, selective SSR, or hybrid on `WEB_COMPUTE`.** This uses Nitro's `aws_amplify` preset, which writes Amplify's deployment-spec bundle (`.amplify-hosting/` with `static/`, `compute/default/` and `deploy-manifest.json`). It is a supported Amplify path for any framework with an adapter. Neither TanStack nor AWS documents TanStack Start on Amplify specifically, and the Nitro Vite plugin that Start uses is still a v3 beta.
3. **Fully static prerendering on `WEB`.** This only helps public pages. Every Accounts screen is per-user, so it gives no benefit here beyond the SPA shell.

The choice between options 1 and 2 depends on authentication more than on hosting:

- **SSR only renders user data if the server holds the user's credentials.** That means a server session (a cookie) and an Auth0 Regular Web Application flow.
- **The Accounts API needs a browser token for live updates.** It is AppSync with `OPENID_CONNECT` auth, and live updates use AppSync's realtime WebSocket from the browser. A server-held-token model therefore needs a token bridge or a proxy for live updates.

Amplify compute brings undocumented memory sizing and cold starts, a 5.72 MB response limit (documented for Next.js), no documented response streaming, per-request charges, an IAM service role, and restrictions on public repositories. SPA mode on `WEB` has none of these.

## Mode matrix

| Concern | SPA mode on `WEB` | SSR / selective SSR / hybrid on `WEB_COMPUTE` |
| --- | --- | --- |
| Start config | `tanstackStart({ spa: { enabled: true } })` | `tanstackStart()` plus `nitro()` from `nitro/vite` with `preset: 'aws_amplify'` (zero-config on Amplify), optionally with per-route `ssr` or `defaultSsr` |
| Build output | `dist/client/` containing `_shell.html` and hashed assets | `.amplify-hosting/{static,compute/default,deploy-manifest.json}` |
| `amplify.yml` `baseDirectory` | `dist/client` | `.amplify-hosting` (relative to `appRoot`) |
| Routing | App-level custom rewrite of non-file paths to `/_shell.html` (200) | `deploy-manifest.json` routes: `/*.*` goes to Static with fallback to Compute, and `/*` goes to Compute. The current SPA rewrite would have to go, because custom rules run before routing rules. |
| Server functions and server routes | None, because there is no server | Available |
| First HTML | Static shell with the pending UI, edge-cached | Server-rendered per request (or `data-only` / shell) from Amplify compute |
| Runtime limits | None beyond CDN | 220 MB bundle, Node 20/22/24, port 3000, 15-minute maximum instance lifetime, 5.72 MB response limit (documented for Next.js), streaming not documented as supported |
| Cold start | None | Exists, but AWS does not document it. Users report multi-second Next.js cold starts in AWS's own tracker. |
| Cost driver | Build minutes, storage, data transfer | The same, plus $0.30 per million SSR requests and $0.20 per GB-hour |
| Auth fit | Browser tokens (`@auth0/auth0-react`, Auth0 SPA app, PKCE) | Server session cookie (`@auth0/auth0-tanstack-start-react`, beta, Regular Web App with client secret) or browser tokens (SSR then renders only the shell for private data) |
| CDK change | None to the platform. The rewrite target changes from `/index.html` to `/_shell.html`. | Platform, service role, rewrite removal, optional compute role and cache config. See [Changes to `accounts-web-hosting`](#changes-to-accounts-web-hosting). |

## TanStack Start rendering options

**SPA mode.** Setting `spa.enabled` adds a build step that prerenders only the root route, with the router's pending fallback in place of matched routes. The default output is `/_shell.html` ([SPA mode guide](https://tanstack.com/start/latest/docs/framework/react/guide/spa-mode)). In current source, the default `spa.prerender.outputPath` is `/_shell`, with `crawlLinks: false` and `retryCount: 0` (`@tanstack/start-plugin-core@1.171.52`, `dist/esm/schema.js`). The client build goes to `dist/client` unless overridden (`dist/esm/vite/output-directory.js`).

The guide sets these requirements for a client-only deployment:

- Serve static assets first, then rewrite remaining 404s to the shell.
- Server functions and server routes still work in SPA mode, but only where a server exists, and they need allow-list rules such as `/_serverFn/*` and `/api/*`.
- Root-route loaders run at build time, so their data is baked into the shell.
- Content below the shell waits for the full JavaScript download.

**Prior SPA config in this repo.** The `755aa976` skeleton used `spa.enabled: true` with `prerender.outputPath: '/_shell'` (`git show 755aa976:applications/accounts/web/vite.config.ts`). It published `dist/client` (`git show 755aa976:amplify.yml`) and rewrote non-asset paths to `/_shell.html` on platform `WEB` (`git show 755aa976:applications/accounts/web/infrastructure/stack.ts`).

**Selective SSR.** Each route can set `ssr: true | false | 'data-only'`, or a function evaluated on the server. Child routes can only become more restrictive. A global `defaultSsr` is set in `createStart` ([Selective SSR guide](https://tanstack.com/start/latest/docs/framework/react/guide/selective-ssr)). The root `shellComponent` is always server-rendered. Unlike SPA mode, selective SSR needs a server runtime for the initial request. A hybrid is possible: `defaultSsr: false` (server sends the shell, and the client loads data), with SSR or `data-only` enabled only where it pays off.

**Static prerendering.** `prerender.enabled` with `crawlLinks`, `pages` and `autoStaticPathsDiscovery` generates static HTML for known paths. Routes with path parameters are excluded from auto-discovery ([Static prerendering guide](https://tanstack.com/start/latest/docs/framework/react/guide/static-prerendering)). Accounts pages are per-user and per-company, so this adds nothing beyond the SPA shell.

**Hosting adapters.** The hosting guide lists Cloudflare, Netlify and Railway as partners. Its targets include `nitro`, `vercel`, `node-server` and `bun`. It does not mention AWS or Amplify. It deploys other hosts through the `nitro/vite` plugin (`plugins: [tanstackStart(), nitro(), viteReact()]`) and warns that the plugin "is still under active development" ([Hosting guide](https://tanstack.com/start/latest/docs/framework/react/guide/hosting); [source](https://github.com/TanStack/router/blob/main/docs/start/framework/react/guide/hosting.md)). The `nitro` package's `latest` tag is `3.0.260903-beta` (npm registry). The older `@tanstack/nitro-v2-vite-plugin` (1.155.2) also exists, but the Start hosting guide does not reference it.

**Environment variables.** Server code reads unprefixed `process.env` at runtime and should read it per request, not at module scope. `VITE_` variables are inlined into the client at build time ([Environment variables guide](https://tanstack.com/start/latest/docs/framework/react/guide/environment-variables)).

## Amplify platforms and the deployment specification

**Platform values.** `AWS::Amplify::App.Platform` accepts `WEB | WEB_DYNAMIC | WEB_COMPUTE`: "For a static app, set the platform type to `WEB`. For a dynamic server-side rendered (SSR) app, set the platform type to `WEB_COMPUTE`." Changing it is an update with *No interruption* to the CloudFormation resource ([AWS::Amplify::App](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-amplify-app.html)). Platform is app-level, so Develop, production and every `pr-*` branch share one mode.

**SSR framework support.** Amplify supports Next.js natively and "any Javascript based SSR framework with an open source build adapter" that produces its expected structure. It names Nuxt, Astro and SvelteKit ([Deploying SSR apps](https://docs.aws.amazon.com/amplify/latest/userguide/server-side-rendering-amplify.html)). TanStack Start is not listed. It qualifies through Nitro's adapter.

**Deployment specification** ([source](https://docs.aws.amazon.com/amplify/latest/userguide/ssr-deployment-specification.html)):

- **Bundle layout.** The bundle is `.amplify-hosting/static/`, `.amplify-hosting/compute/default/` and `deploy-manifest.json`.
- **Compute contract.** The compute entry point is a Node module that "must start an HTTP server that listens on port 3000". The `default` directory must be self-contained.
- **Compute limits.** Each compute resource gets 512 MB of ephemeral storage, has a 15-minute maximum execution time, and can write only to `/tmp`. The uncompressed bundle can't exceed 220 MB.
- **Runtimes.** `nodejs20.x`, `nodejs22.x` and `nodejs24.x`.
- **Routes.** At most 25. They must include the `/*` catch-all, and they are "applied after the request has been transformed by rewrite and redirect rules". Fallback applies only to body-less `GET` requests.

**Nitro `aws_amplify` preset** (`nitro@3.0.260903-beta`, `dist/_presets.mjs` and `dist/presets/aws-amplify/runtime/aws-amplify.mjs`; [Nitro docs](https://nitro.build/deploy/providers/aws-amplify)):

- **Output.** It writes `{rootDir}/.amplify-hosting`, with the server in `compute/default` and public assets in `static`.
- **Runtime.** The runtime is a `node:http` server on port 3000.
- **Manifest.** It generates `deploy-manifest.json` with a `/*.*` Static route (falling back to Compute), a `/*` Compute catch-all, and `computeResources[0].runtime` defaulting to **`nodejs20.x`** unless `awsAmplify.runtime` is set. Node 20 reached end of life on 2026-04-30 ([Node.js releases](https://nodejs.org/en/about/previous-releases)), and this repo's `.nvmrc` is `24`, so the runtime would need setting explicitly.
- **Zero-config.** On Amplify it works without configuration, and `awsAmplify` options cover `catchAllStaticFallback`, image optimisation and `runtime`.
- **Docs example.** The documented monorepo `amplify.yml` sets `appRoot`, `buildPath: /` and `baseDirectory: <app>/.amplify-hosting`, and runs `nvm use 24`.

**Runtime environment variables.** Amplify does not expose build environment variables to the SSR runtime by default ("intentional to protect any secrets"). The documented pattern writes selected variables into an env file during the build. AWS recommends against storing secrets in environment variables "as any user with access to deployment artifacts can read them" and recommends an SSR Compute IAM role instead ([SSR environment variables](https://docs.aws.amazon.com/amplify/latest/userguide/ssr-environment-variables.html)). An SSR Compute role can be set per app or per branch. AWS recommends branch-level roles where previews or auto-branch creation exist ([SSR Compute role](https://docs.aws.amazon.com/amplify/latest/userguide/amplify-SSR-compute-role.html); `AWS::Amplify::Branch.ComputeRoleArn` in [AWS::Amplify::Branch](https://docs.aws.amazon.com/AWSCloudFormation/latest/TemplateReference/aws-resource-amplify-branch.html)).

**Logging and service role.** SSR logs go to CloudWatch through an IAM service role. Apps on `WEB_COMPUTE` "require an IAM service role" ([SSR supported features](https://docs.aws.amazon.com/amplify/latest/userguide/ssr-supported-features.html); [Web previews](https://docs.aws.amazon.com/amplify/latest/userguide/pr-previews.html)).

**Caching.** Static content and `WEB_COMPUTE` static routes use the `Amplify-StaticContent` policy. Compute routes use `Amplify-Default` (all cookies in the cache key) or `Amplify-DefaultNoCookies`, both with a default TTL of 0 ([Cache configuration types](https://docs.aws.amazon.com/amplify/latest/userguide/cache-configuration-type.html)). Each deployment clears the cache, static assets default to one year, and framework `Cache-Control` on dynamic routes is respected ([Caching](https://docs.aws.amazon.com/amplify/latest/userguide/caching.html)).

**Skew protection** works for both static and SSR apps at no extra cost. It covers one week of deployments for static apps and up to eight previous deployments for SSR apps ([Skew protection](https://docs.aws.amazon.com/amplify/latest/userguide/skew-protection.html)).

## Build and deploy shape

Today's repo shape is unchanged in both modes: GitHub Actions or `infrastructure/deploy.ts` pushes `amplify/<stage>`, calls `start-job --job-type RELEASE --commit-id`, waits, and verifies the commit (`applications/accounts/web/infrastructure/deploy.ts`). Amplify runs the build from the root `amplify.yml` (`amplify.yml`). The differences:

- **SPA on `WEB`:**
  - `yarn build` emits `dist/client`.
  - `artifacts.baseDirectory: dist/client`.
  - Public config (Auth0 domain, client ID, audience, AppSync URL) is baked in through `VITE_` variables at build time, which was the #1533 plan.
  - Per-branch config means a per-branch build, which already happens.
- **SSR on `WEB_COMPUTE`:**
  - `yarn build` with Nitro emits `applications/accounts/web/.amplify-hosting`, and `artifacts.baseDirectory` becomes `.amplify-hosting`.
  - The compute bundle must be self-contained under 220 MB. Nitro bundles and traces server dependencies, but this is not yet verified with this repo's Yarn 4 workspaces and `hoistingLimits: workspaces`.
  - Server-only config (Auth0 client secret, session secret) must not go in branch env vars, per AWS. The options are to read it at runtime from Secrets Manager or SSM through a branch-level SSR Compute role, or to write it into an env file at build time against AWS guidance.
  - `deploy.ts` currently clears branch environment variables (`update-branch --environment-variables '{}'`), so any runtime config path needs designing.

## Previews and branch deploys

- **Native PR previews and public repositories.** Native previews can't be enabled on `WEB_COMPUTE` apps when the repository is public: "apps that are deployed to the `WEB_COMPUTE` hosting platform require an IAM service role. Therefore, you can't enable web previews for these types of apps if their repository is public" ([Web previews](https://docs.aws.amazon.com/amplify/latest/userguide/pr-previews.html)). `motech-development/platform` is public (`gh repo view`). The current stack already disables native previews (`enablePullRequestPreview: false` in `infrastructure/stack.ts`), and `deploy.ts` creates `amplify/pr-<n>` branches itself, so this restriction does not block the repo's own preview flow. The same concern still applies, though: PR code would run with whatever compute role the branch has. AWS recommends branch-level compute roles in that case.
- **Branch quota.** Both modes share the limit of 50 branches per app, which is not adjustable ([Quotas](https://docs.aws.amazon.com/amplify/latest/userguide/quotas-chapter.html)).
- **Preview URLs and auth.** Preview URLs stay `https://amplify-pr-<n>.<appId>.amplifyapp.com` (`infrastructure/stage.ts`). In SPA mode, the Auth0 Develop SPA client needs the wildcard origin and callback, as in #1533. In server-session mode, the Auth0 Regular Web App needs `https://*.<appId>.amplifyapp.com/auth/callback` and logout URLs. The TanStack Start SDK then needs an `appBaseUrl` per branch, or an allow-list with `trustProxy: true` (`AUTH0_TRUST_PROXY`) so it reads `X-Forwarded-Host` ([auth0-tanstack-start-react README](https://github.com/auth0/auth0-tanstack-start-react)).

## Cold starts and latency

- **SPA on `WEB`.** The shell and assets come from Amplify's CDN, with no compute in the path. First paint is the shell, then the client runs the Auth0 redirect or silent token check, then the first API call. Data never appears in the first HTML ([SPA mode caveats](https://tanstack.com/start/latest/docs/framework/react/guide/spa-mode)).
- **SSR on `WEB_COMPUTE`:**
  - AWS documents no cold-start figures, memory size or concurrency for Amplify compute. The only startup guidance is a procedure for measuring Next.js initialisation locally ([Troubleshooting SSR](https://docs.aws.amazon.com/amplify/latest/userguide/troubleshooting-SSR.html); [amplify-hosting FAQ](https://github.com/aws-amplify/amplify-hosting/blob/main/FAQ.md)).
  - User reports in AWS's own issue tracker describe Next.js cold starts of 7 to 16 seconds on `WEB_COMPUTE` (2022 to 2023). These are anecdotal and framework-specific ([#3211](https://github.com/aws-amplify/amplify-hosting/issues/3211), [#3667](https://github.com/aws-amplify/amplify-hosting/issues/3667), [#3855](https://github.com/aws-amplify/amplify-hosting/issues/3855)). No TanStack Start or Nitro measurements were found.
  - An internal preview with sparse traffic would hit cold starts often.
  - Amplify lists "Next.js streaming" as unsupported ([Next.js support](https://docs.aws.amazon.com/amplify/latest/userguide/ssr-amplify-support.html)), and no doc states that streaming works for other compute apps. TanStack Start's SSR streaming should be assumed buffered (unverified).
  - The 5.72 MB response cap is documented for Next.js on Web Compute. Larger responses return 504 ([Troubleshooting SSR](https://docs.aws.amazon.com/amplify/latest/userguide/troubleshooting-SSR.html)).
  - For SSR to show data in the first HTML, the server must call AppSync during the request, which adds a compute-to-AppSync hop before first byte.
- Both modes keep hashed assets edge-cached for a year by default ([Caching](https://docs.aws.amazon.com/amplify/latest/userguide/caching.html)).

## Cost

Amplify Hosting pricing ([pricing page](https://aws.amazon.com/amplify/pricing/)):

| Item | Free tier | Rate |
| --- | --- | --- |
| Build minutes (Standard) | 1,000 min/month | $0.01/min |
| Storage | 5 GB/month | $0.023/GB-month |
| Data transfer out | 15 GB/month | $0.15/GB |
| SSR requests | 500,000/month | $0.30 per million |
| SSR duration | 100 GB-hours/month | $0.20/GB-hour |

SPA on `WEB` incurs only the first three. `WEB_COMPUTE` adds the SSR lines for every request routed to Compute, including the shell request when `defaultSsr: false`, server functions, and the `/auth/*` routes in server-session mode.

For an internal preview, both modes are likely to stay inside or near the free tier. As an illustration: 100,000 compute requests at 200 ms, if billed at 1 GB (AWS does not document the allocation), is about 5.6 GB-hours, roughly $1.11 plus $0.03 of requests above the free tier. Build minutes and storage are the same in both modes. A WAF, if wanted, is $15 per app per month either way.

## Authentication implications

**Current API constraint.** The `755aa976` data client authenticates to AppSync with `AUTH_TYPE.OPENID_CONNECT` and a browser `getAccessToken()`. It uses the same token for `createSubscriptionHandshakeLink`, so live updates run over AppSync's realtime WebSocket from the browser (`git show 755aa976:applications/accounts/web/src/data/client.ts`). Any mode that keeps tokens server-only must solve subscriptions separately.

**Browser tokens (Auth0 SPA, any mode):**

- `@auth0/auth0-react` 2.28.2 with an Auth0 SPA application (public client, PKCE, no secret). This is what #1533 and the skeleton used (`git show 755aa976:applications/accounts/web/package.json`).
- It works on `WEB` with no server.
- On `WEB_COMPUTE` it still works, but the server never has the user's token, so SSR can render only the shell or public data. That removes most of the SSR benefit for Accounts.

**Server session (Auth0 Regular Web App, `WEB_COMPUTE` only):**

- TanStack Start's guide recommends server sessions in encrypted HTTP-only cookies, with authorisation checked in server functions. It notes that `beforeLoad` "is not the security boundary". It lists Clerk, WorkOS, Better Auth and Auth.js as options, not Auth0 ([Authentication guide](https://tanstack.com/start/latest/docs/framework/react/guide/authentication)).
- Auth0 publishes `@auth0/auth0-tanstack-start-react` (built on `@auth0/auth0-server-js`) with a quickstart ([Auth0 quickstart](https://auth0.com/docs/quickstart/webapp/tanstack-start)). Per its README, it is "Status: early development" and targets Regular Web Applications. Sessions are a stateless encrypted cookie by default, and back-channel logout needs a stateful store. "Access, refresh, and ID tokens stay on the server and are never exposed to the browser". Client-side token access is not provided, and SPA users are pointed to `@auth0/auth0-react` ([README](https://github.com/auth0/auth0-tanstack-start-react)).
- The SDK requires a client secret and a session secret, which brings back the runtime-secret question on Amplify (see [Build and deploy shape](#build-and-deploy-shape)). The npm `latest` tag is a beta.
- AppSync realtime subscriptions from the browser would need one of these:
  - a server function that hands the access token to the client, which weakens the server-only property;
  - a server-side proxy, which Amplify compute cannot hold open as a long-lived connection (15-minute instance limit, no documented streaming or WebSocket support);
  - a different live-update transport.
- Cookie sessions interact with caching. `Amplify-Default` keys on all cookies and the default TTL is 0, so per-user SSR is not cached unless the app sets `Cache-Control` ([Cache configuration types](https://docs.aws.amazon.com/amplify/latest/userguide/cache-configuration-type.html)).

**Cognito later:**

- In SPA mode, the seam is a client-side token provider. Swapping Auth0 for a Cognito public app client (OIDC with PKCE) keeps AppSync's `OPENID_CONNECT` flow (or `AMAZON_COGNITO_USER_POOLS`) and needs no server.
- In server-session mode, the seam is server-side (session cookie plus server functions). The Auth0 TanStack SDK is Auth0-specific. Amplify JS documents server-side Cognito auth only for Next.js through `@aws-amplify/adapter-nextjs`, and its server-side sign-in is experimental ([Amplify SSR docs](https://docs.amplify.aws/react/build-a-backend/server-side-rendering/)). A Cognito swap in server mode would need a generic OIDC server library or custom code.

## Changes to `accounts-web-hosting`

Current stack (`applications/accounts/web/infrastructure/stack.ts`):

- `CfnApp` with `platform: 'WEB'`, one custom rule rewriting non-asset paths to `/index.html` (200), and `AMPLIFY_MONOREPO_APP_ROOT=applications/accounts/web`.
- No `iamServiceRole`, `computeRoleArn` or `cacheConfig`.
- Two `CfnBranch` resources (`amplify/develop`, `amplify/production`) with auto-build and native previews off, plus a `CfnDomain` for `accounts-develop`.
- Preview branches are created by `deploy.ts`, outside CDK.

**SPA on `WEB`:**

- Change the custom rule target from `/index.html` to `/_shell.html`, as the `755aa976` stack did.
- Root `amplify.yml`: set `baseDirectory: dist/client` and add the build-time public config.
- No IAM, platform or branch changes.
- Optional: add cache headers for `_shell.html` and the service worker. #1533 wanted HTML not stored.

**`WEB_COMPUTE`:**

- `platform: 'WEB_COMPUTE'` (no interruption to the resource, but every branch switches at once).
- Remove the SPA custom rule, because custom rules run before deploy-manifest routing and would shadow the Compute catch-all.
- Add an `iamServiceRole`, required for `WEB_COMPUTE` and CloudWatch SSR logs.
- If the server reads secrets from Secrets Manager or SSM, add a role trusted by `amplify.amazonaws.com` and attach it as a branch-level `computeRoleArn` on `CfnBranch`. Preview branches created by `deploy.ts` would need the role passed on `create-branch`, or none.
- Optionally set `cacheConfig` (`AMPLIFY_MANAGED` keeps cookies in the compute cache key) and `enableSkewProtection` on branches.
- Root `amplify.yml`: set `baseDirectory: .amplify-hosting`, select Node 22 or 24, and set `awsAmplify.runtime` to match, because the preset defaults to `nodejs20.x`.
- `deploy.ts` and its tests: decide how runtime config reaches the compute bundle. Today it wipes branch environment variables.
- Stack and deploy tests (`stack.test.ts`, `deploy.test.ts`) need updating for these assertions.

## Open points not settled by primary sources

- Whether TanStack Start's server handler, in SPA mode with Nitro on Amplify, serves `_shell.html` for page routes from Compute or Static. This needs a spike.
- Whether Amplify compute buffers or streams TanStack Start's streamed SSR responses, and the real cold-start time for a Start and Nitro bundle.
- Amplify compute memory allocation, which drives the GB-hour cost. AWS does not document it.
- Whether Nitro's dependency tracing yields a self-contained `compute/default` under Yarn 4 with `hoistingLimits: workspaces`.

## Effect on other tickets in the map

- **[#1656](https://github.com/motech-development/platform/issues/1656) (keep AppSync) and [#1658](https://github.com/motech-development/platform/issues/1658) (data client and live updates):** server-held tokens conflict with browser AppSync subscriptions.
- **[#1657](https://github.com/motech-development/platform/issues/1657) (auth seam):** the seam is client-side in SPA mode and server-side in server-session mode, and the only Auth0 server SDK for Start is in beta.
- **[#1653](https://github.com/motech-development/platform/issues/1653) and [#1664](https://github.com/motech-development/platform/issues/1664) (delivery):** `WEB_COMPUTE` adds IAM roles, runtime-secret handling and public-repository preview constraints.
- **[#1666](https://github.com/motech-development/platform/issues/1666) (PWA and offline):** the SPA shell is a natural service-worker navigation fallback. Offline use with SSR still needs a cached shell.

## Source index

TanStack:

- [Hosting guide](https://tanstack.com/start/latest/docs/framework/react/guide/hosting) and [its source](https://github.com/TanStack/router/blob/main/docs/start/framework/react/guide/hosting.md)
- [SPA mode](https://tanstack.com/start/latest/docs/framework/react/guide/spa-mode)
- [Selective SSR](https://tanstack.com/start/latest/docs/framework/react/guide/selective-ssr)
- [Static prerendering](https://tanstack.com/start/latest/docs/framework/react/guide/static-prerendering)
- [Environment variables](https://tanstack.com/start/latest/docs/framework/react/guide/environment-variables)
- [Authentication](https://tanstack.com/start/latest/docs/framework/react/guide/authentication)
- `@tanstack/start-plugin-core@1.171.52` package source: `dist/esm/schema.js`, `dist/esm/vite/output-directory.js`

Nitro:

- [AWS Amplify provider](https://nitro.build/deploy/providers/aws-amplify)
- `nitro@3.0.260903-beta` package source: `dist/_presets.mjs` (`writeAmplifyFiles`, `aws-amplify` preset), `dist/presets/aws-amplify/runtime/aws-amplify.mjs`

AWS Amplify Hosting:

- [Deploying SSR apps](https://docs.aws.amazon.com/amplify/latest/userguide/server-side-rendering-amplify.html)
- [Deployment specification](https://docs.aws.amazon.com/amplify/latest/userguide/ssr-deployment-specification.html)
- [SSR supported features](https://docs.aws.amazon.com/amplify/latest/userguide/ssr-supported-features.html)
- [Next.js support](https://docs.aws.amazon.com/amplify/latest/userguide/ssr-amplify-support.html)
- [SSR environment variables](https://docs.aws.amazon.com/amplify/latest/userguide/ssr-environment-variables.html)
- [SSR Compute role](https://docs.aws.amazon.com/amplify/latest/userguide/amplify-SSR-compute-role.html)
- [Web previews](https://docs.aws.amazon.com/amplify/latest/userguide/pr-previews.html)
- [Caching](https://docs.aws.amazon.com/amplify/latest/userguide/caching.html)
- [Cache configuration types](https://docs.aws.amazon.com/amplify/latest/userguide/cache-configuration-type.html)
- [Skew protection](https://docs.aws.amazon.com/amplify/latest/userguide/skew-protection.html)
- [Troubleshooting SSR](https://docs.aws.amazon.com/amplify/latest/userguide/troubleshooting-SSR.html)
- [Quotas](https://docs.aws.amazon.com/amplify/latest/userguide/quotas-chapter.html)
- [Pricing](https://aws.amazon.com/amplify/pricing/)
- [amplify-hosting FAQ](https://github.com/aws-amplify/amplify-hosting/blob/main/FAQ.md)
- [AWS::Amplify::App](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-amplify-app.html)
- [AWS::Amplify::Branch](https://docs.aws.amazon.com/AWSCloudFormation/latest/TemplateReference/aws-resource-amplify-branch.html)

Auth:

- [Auth0 TanStack Start quickstart](https://auth0.com/docs/quickstart/webapp/tanstack-start)
- [auth0/auth0-tanstack-start-react](https://github.com/auth0/auth0-tanstack-start-react)
- [Amplify JS server-side rendering](https://docs.amplify.aws/react/build-a-backend/server-side-rendering/)

Repository:

- `applications/accounts/web/infrastructure/stack.ts`, `deploy.ts`, `stage.ts`
- `amplify.yml`
- `applications/accounts/web/package.json`
- `git show 755aa976:applications/accounts/web/vite.config.ts`
- `git show 755aa976:amplify.yml`
- `git show 755aa976:applications/accounts/web/infrastructure/stack.ts`
- `git show 755aa976:applications/accounts/web/src/data/client.ts`
- [Issue #1533 resolution](https://github.com/motech-development/platform/issues/1533)
