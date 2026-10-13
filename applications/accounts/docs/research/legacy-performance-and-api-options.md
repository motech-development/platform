# Legacy Accounts performance and API options

## Research question

Judging from architecture and code only, where does the legacy Accounts client (`applications/accounts/client`) lose load and response time? For each cause, is it inherent to AppSync/GraphQL or fixable within it? How do the realistic alternatives compare on speed, migration cost, real-time support, auth fit (Auth0 now, Cognito later), and fit with the repository's delivery model?

This note resolves [Research: Why the legacy Accounts client is slow, and alternatives to AppSync](https://github.com/motech-development/platform/issues/1651), part of [#1649](https://github.com/motech-development/platform/issues/1649). It feeds [Keep AppSync/GraphQL or replace it?](https://github.com/motech-development/platform/issues/1656), which makes the decision. This note lays out facts and trade-offs only. It audits `main` at `dbc0296b4`.

No instrumentation, profiling or timing runs were done. Bundle sizes come from reading an existing local build (`applications/accounts/client/build`, dated 2026-08-25). Client source has changed since then (last source commit 2026-09-06), so treat those sizes as directional.

## Result

Most of the slowness the code can explain sits in the client and the login flow, not in AppSync:

1. **Login friction.** Production signs users out after 10 minutes idle, so they often go through a full Auth0 redirect and a second full boot. A deep link after sign-out also loses its target and lands on the log-in page, which costs a second redirect.
2. **Boot weight.** One entry chunk of about 272 KB gzipped carries Sentry (with Session Replay), FontAwesome, luxon, styled-components and more. The GraphQL and AppSync client code adds roughly 120 KB gzipped more before the first query can run.
3. **Request waterfall.** Data is fetched on render, behind nested `React.lazy` chunks and Suspense translation loads. On a cold deep link, about seven sequential fetches happen before the first GraphQL request.
4. **The live balance path is long.** A saved transaction updates the balance through two DynamoDB stream hops, two Lambdas and an IAM mutation back into AppSync. The stream has six Lambda readers, three times the two that AWS recommends.

The AppSync read path itself is lean. Every query is a single VTL resolver that talks to DynamoDB directly (`GetItem`, or `Query` on one GSI), with no Lambda and so no cold starts. Each screen batches its root fields into one request. Lambda sits only behind attachments, reports and the stream-driven live updates.

Nearly every cause is fixable while keeping AppSync. The few costs that are truly inherent to AppSync GraphQL are small or apply to any cross-origin, token-authorised API:

- a GraphQL client runtime;
- subscriptions that fire only from AppSync mutations, which is why the "beacon" mutations exist;
- CORS preflights.

Replacing AppSync would not remove the main causes on its own. A REST API on API Gateway would put Lambda, and its cold starts, on every read. It would also need a separate real-time channel.

## How a cold deep link loads today

Path: `/my-companies/accounts/:companyId`, on a first visit or the first visit after a deploy.

| Step | What happens | Source |
| --- | --- | --- |
| 1 | `index.html` (`no-store`) | `client/serverless.yml:26-28` |
| 2 | Entry chunk, about 894 KB minified (about 272 KB gzipped). It initialises Sentry with tracing and Replay, Universal Analytics, and i18next | `client/src/index.tsx:41-66`, local build `assets/index-*.js` |
| 3 | `global` locale chunk (dynamic import), in parallel with Auth0 `checkSession` | `client/src/i18n.ts:18`, `auth0-react` `auth0-provider.tsx:167` |
| 4 | `pages` route chunk (`lazy`), then `ProtectedRoute` | `client/src/pages/index.tsx:5-7` |
| 5 | `MyCompanies` routes chunk (`lazy`), with the shared Apollo/`graphql` chunk (about 63 KB gzipped) and the AppSync link chunk (about 59 KB gzipped) | `client/src/pages/MyCompanies/index.tsx`, local build |
| 6 | `Accounts/index` chunk (`lazy`), then the `Accounts` chunk (`lazy`) | `client/src/pages/MyCompanies/Accounts/index.tsx:4-7` |
| 7 | `accounts` locale chunk. `useTranslation` suspends before `useQuery` runs | `Accounts.tsx:92-104`; [react-i18next `useTranslation`](https://react.i18next.com/latest/usetranslation-hook) |
| 8 | GraphQL `POST` (`getBalance` + `getTransactions(count: 100)`), with a CORS preflight when one is not cached | `Accounts.tsx:25-57` |
| 9 | WebSocket handshake and `start` for `onNotification` and `onTransaction` | `UserNotifications.tsx:129`, `Accounts.tsx:148-170` |

In parallel, the shell's `UserNotifications` suspends on its own namespace and then queries `getNotifications`. `Connected` and `ErrorCard` load their own locale namespaces too.

On repeat visits, the service worker serves the HTML and precached chunks locally (`client/src/service-worker.ts`), so steps 1 to 7 become cache reads. What remains is the JavaScript parse and execute, the Auth0 check, and the API round trips.

## Where time is likely lost

### 1. Authentication flow (Auth0)

| Finding | Evidence | Inherent to AppSync? |
| --- | --- | --- |
| Production logs users out after 10 minutes idle (1 hour outside production). Coming back means a full `loginWithRedirect`: Universal Login, a code exchange, then a second full boot of the SPA | `client/src/App.tsx:14-28` | No. Product setting, independent of the API |
| A deep link while signed out loses its destination. `ProtectedRoute` stores `appState.targetUrl`, but `onRedirectCallback` reads only `appState.returnTo`, so the user returns to `/` (the log-in page) and must click through a second redirect | `packages/auth/src/ProtectedRoute.tsx:24-27`, `client/src/index.tsx:84-89`, `client/src/pages/LogIn.tsx:13-19` | No. Client bug |
| The whole app waits behind `isLoading` until `checkSession` finishes. With `cacheLocation="localstorage"` and a valid cached access token, no network call is made. If the token has expired, a refresh-token grant to Auth0 `/oauth/token` blocks first paint | `client/src/App.tsx:50-55`, `packages/auth/src/WithAuth.tsx:27-29`; spa-js `checkSession` heeds the `auth0.{clientId}.is.authenticated` cookie and pre-fills the cache ([Auth0Client typings](https://github.com/auth0/auth0-spa-js/blob/main/src/Auth0Client.ts)); `cacheMode` defaults to `on`, which "reads from the cache and sends a request to Auth0 as needed" ([global typings](https://github.com/auth0/auth0-spa-js/blob/main/src/global.ts)) | No. Same for any bearer-token API. Fixable by rendering the shell before auth resolves |
| Every GraphQL request calls `getAccessTokenSilently()` through the AppSync auth link. This is a cache read in the normal case | `packages/appsync-apollo/src/Apollo/Apollo.tsx:39-45` | No |
| Access-token lifetime and refresh-token rotation are set in the Auth0 tenant, not in this repository, so how often refreshes happen cannot be judged from code | `applications/id` has no token-lifetime config | Not applicable |

The spa-js token request uses form encoding by default (`useFormData` defaults to `true`, [global typings](https://github.com/auth0/auth0-spa-js/blob/main/src/global.ts)). The installed SDK is `@auth0/auth0-spa-js@2.23.0` under `@auth0/auth0-react@2.3.0`.

### 2. Client bundle and boot

| Finding | Evidence | Inherent? |
| --- | --- | --- |
| The entry chunk is about 894 KB minified (about 272 KB gzipped). By source-map attribution, its largest inputs are `@fortawesome/free-solid-svg-icons`, `@sentry/replay`, luxon, `@sentry/core`, react-router, react-dom, `polished` (styled-components), i18next, `@motech-development/breeze-ui` 2.4, lodash-es, formik and popper | local build `assets/index-*.js(.map)` | No |
| Sentry runs `BrowserTracing` at `tracesSampleRate: 1.0` and always bundles `Replay`, even though sessions are sampled at 0.1 | `client/src/index.tsx:41-62` | No |
| `react-ga` initialises Universal Analytics. Google stopped processing standard Universal Analytics hits on 1 July 2023, so this is load cost with no output | `client/src/index.tsx:64-66`; [Google Analytics help](https://support.google.com/analytics/answer/11583528) | No |
| GraphQL client weight: a shared chunk of about 63 KB gzipped (graphql-js, Apollo, the codegen document map in `src/graphql/gql.ts` and `graphql.ts`), plus an `@apollo/client` `useQuery` chunk | local build `assets/graphql-*.js`, `useQuery-*.js`; `client/codegen.ts` (client preset) | Partly. A GraphQL client is inherent to GraphQL, but Apollo's size is a client choice. Lighter clients or plain `fetch` with typed documents exist |
| AppSync transport weight: a chunk of about 59 KB gzipped, mostly `aws-appsync-subscription-link` with Node polyfills (`buffer`, `url`, `qs`, `punycode`) and `@aws-crypto/sha256-js` for SigV4, which this app never uses because it authorises with OIDC | local build `assets/MyCompanies-*.js`; `packages/appsync-apollo/package.json` | No. The real-time protocol is documented ([AppSync real-time WebSocket client](https://docs.aws.amazon.com/appsync/latest/devguide/real-time-websocket-client.html)) and a small client can implement it |
| Viewing attachments pulls `react-pdf` (about 105 KB gzipped) plus a 1.37 MB PDF worker | local build `assets/ViewAttachment-*.js`, `pdf.worker.min-*.mjs` | No |
| Hosting cache headers target CRA's `static/**/*.js`, but Vite emits `assets/`. Hashed chunks therefore get no `Cache-Control` header and fall back to CloudFront and browser defaults. The service worker hides this on repeat visits | `client/serverless.yml:24-36`, `client/vite.config.mts:39-41` | No |

### 3. Request waterfalls and data loading

| Finding | Evidence | Inherent? |
| --- | --- | --- |
| Fetch-on-render behind nested `lazy()` boundaries: shell, then `MyCompanies`, then the section index, then the screen. Each chunk is discovered only after its parent renders | `client/src/pages/index.tsx`, `pages/MyCompanies/index.tsx`, `pages/MyCompanies/Accounts/index.tsx` | No. Route loaders or preloading can start data and code in parallel |
| `useTranslation` suspends while a namespace loads. Many screens call it before `useQuery`, so the GraphQL request waits for the locale chunk | `Accounts.tsx:92-104`, `MyCompanies.tsx:44-46`, `UserNotifications.tsx:117-118`; [react-i18next](https://react.i18next.com/latest/usetranslation-hook) ("will trigger a Suspense if not ready") | No |
| Each screen sends one request that batches its root fields (for example `getClients + getSettings + getTransaction + getTypeahead`), so there is no per-entity N+1 over HTTP | `ViewTransaction.tsx:157-196`, `RecordTransaction.tsx:132-158`, `Clients.tsx:17-40`, `Settings.tsx:11-30` | A GraphQL strength. REST would need a composite endpoint per screen to match it |
| The Apollo cache is in memory only and uses the default `cache-first` policy. Navigating within a session is instant for already-loaded data, but nothing persists across reloads | `packages/appsync-apollo/src/Apollo/Apollo.tsx:46-67`; [Apollo fetch policies](https://www.apollographql.com/docs/react/data/queries) | No |
| Opening an attachment chains `requestDownload` (an AppSync pipeline of `getCompany` then an HTTP data source, then API Gateway, then a storage Lambda presign), then a fetch from S3, then PDF rendering | `api/serverless.yml` `Query.requestDownload`, `ViewAttachment.tsx:29-35,77` | Mostly no. The Lambda presign hop would exist under any API |

### 4. AppSync resolvers, Lambda and DynamoDB

| Finding | Evidence | Inherent? |
| --- | --- | --- |
| All client queries are VTL resolvers on the `Data` DynamoDB data source, with no Lambda and no cold start. `getBalance`, `getCompany`, `getSettings`, `getTransaction` and `getTypeahead` are `GetItem`. `getCompanies`, `getClients`, `getTransactions` and `getNotifications` are a `Query` on `__typename-data-index` with `begins_with(data, owner…)` | `api/serverless.yml:54-243`; `mapping-templates/*/get*/Query.*.req.vtl` | Not applicable. This is the fastest shape AppSync offers |
| Lambda appears only on: `getTransactionState` (unused by the legacy client); `createReport`, `requestUpload` and `requestDownload` (HTTP data source to API Gateway to Lambda); and the stream handlers | `api/serverless.yml` `dataSources`, `functions` | No |
| Every GSI query uses `__typename` as the partition key, so all tenants' transactions share one GSI partition-key value. That limits throughput at scale but is not a latency cost at current volume. GSI reads are eventually consistent only, so a refetch straight after a write can miss the new item | `data/serverless.yml:120-140`; [DynamoDB GSI](https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/GSI.html) ("updated asynchronously, using an eventually consistent model") | No. A data-model choice that applies under any API |
| Mutations use pipeline resolvers whose validation functions run on a `NONE` data source (in-process), then one DynamoDB write. `deleteCompany` and `deleteFile` enqueue to SQS | `api/serverless.yml:54-243` (resolvers), `260-332` (pipeline functions) | Not applicable |
| `xrayEnabled: true`. AWS does not document AppSync's own per-request overhead, so this note does not estimate it | `api/serverless.yml:53` | Unknown |
| The OIDC config sets only `issuer`. AppSync fetches discovery and JWKS from the issuer ([AppSync authorization](https://docs.aws.amazon.com/appsync/latest/devguide/security-authz.html)) but does not document how it caches keys. API Gateway JWT authorizers state they cache keys for up to two hours ([HTTP API JWT authorizers](https://docs.aws.amazon.com/apigateway/latest/developerguide/http-api-jwt-authorizer.html)) | `api/serverless.yml:44-48` | Unknown, and comparable either way |

### 5. Live updates (subscriptions)

| Finding | Evidence | Inherent? |
| --- | --- | --- |
| The balance does not update in the write's own response. The path is: `addTransaction` (VTL `PutItem`), then the table stream, then the `data` `Transactions` Lambda (recomputes and writes `Balance`), then the stream again, then the `api` `UpdateBalance` Lambda, then the IAM `transactionBeacon` mutation, then the `onTransaction` subscribers. That is two stream polls (Lambda polls "at a base rate of 4 times per second", [Lambda with DynamoDB](https://docs.aws.amazon.com/lambda/latest/dg/with-ddb.html)), two possible cold starts, and an AppSync call | `data/serverless.yml:90-99`, `data/src/transactions.ts`, `api/serverless.yml:404-417`, `api/src/shared/update-balance.ts` | Partly. AppSync GraphQL subscriptions fire only from AppSync mutations ("Subscriptions are triggered from mutations", [AppSync real-time data](https://docs.aws.amazon.com/appsync/latest/devguide/aws-appsync-real-time-data.html)), so a backend-computed value has to be pushed through a mutation. The double stream hop is a design choice |
| The application table stream has six Lambda readers: `Attachments`, `Transactions`, `Typeahead` and the `ScheduleTransactions` mapping in `data`, plus `PublishNotifications` and `UpdateBalance` in `api`. AWS says to "design for up to two" readers per shard, and that exceeding this "can result in request throttling" | `data/serverless.yml:40-108,160-170`, `api/serverless.yml:392-417`; [Lambda with DynamoDB](https://docs.aws.amazon.com/lambda/latest/dg/with-ddb.html) | No. Applies under any API that keeps this stream design |
| Stream Lambdas initialise Sentry with `nodeProfilingIntegration` (a native module) at a profile and trace sample rate of 1, which adds cold-start init on the live-update path | `api/src/handlers/publish-notifications.ts:14-19`, `data/src/transactions.ts:11-16`; [Lambda cold starts](https://docs.aws.amazon.com/lambda/latest/dg/lambda-runtime-environment.html) ("the largest contributor of latency … comes from initialization code") | No |
| One WebSocket carries all subscriptions, after `connection_init`/`connection_ack` and a `start`/`start_ack` per subscription. `Accounts` delays its `subscribeToMore` with a render-count workaround | [AppSync real-time WebSocket client](https://docs.aws.amazon.com/appsync/latest/devguide/real-time-websocket-client.html); `Accounts.tsx:90,143-176` | Handshake inherent to the protocol; the workaround is not |

Observed in passing (security, not performance): `onTransaction` and `onNotification` have no subscription resolver, so AppSync filters them only by the client-supplied `owner` argument. `onTransactionChange` does check `$ctx.identity.sub == owner`. AWS recommends attaching resolvers to subscription fields for fine-grained access ([AppSync real-time data](https://docs.aws.amazon.com/appsync/latest/devguide/aws-appsync-real-time-data.html)). See `api/schema/schema.graphql`, `api/serverless.yml:213-217`, `mapping-templates/transaction/onTransactionChange/*.req.vtl`. Report notifications carry presigned `downloadUrl` payloads (`client/src/components/ApolloClient.tsx:31-56`).

## Inherent vs fixable summary

| Cause | Inherent to AppSync/GraphQL | Fixable within AppSync |
| --- | --- | --- |
| 10-minute idle logout and redirect re-boot | No | Yes (product setting) |
| Deep-link `targetUrl`/`returnTo` mismatch | No | Yes (client bug) |
| Auth gate blocks first paint | No | Yes (render shell first; token lifetime in the tenant) |
| Large entry chunk (Sentry Replay, icons, styled-components, UA) | No | Yes (new client stack) |
| Apollo and graphql-js weight | Partly (some GraphQL client is needed) | Yes (lighter client, or typed `fetch`) |
| Legacy AppSync link libraries and polyfills | No | Yes (minimal WebSocket client for the documented protocol) |
| Lazy-chunk and translation-Suspense waterfall | No | Yes (route loaders, preloading, bundled copy) |
| Asset `Cache-Control` mismatch | No | Yes (new hosting, map #1649 targets Amplify) |
| Cross-origin preflight on every new request shape | No. Any cross-origin bearer API pays it | Partly (same-origin proxy). API Gateway HTTP APIs expose `maxAge` ([HTTP API CORS](https://docs.aws.amazon.com/apigateway/latest/developerguide/http-api-cors.html)); AppSync does not document its value |
| Read resolvers | Not a cause (direct DynamoDB, no Lambda) | Optional: AppSync server-side caching, or JS resolvers in place of VTL ([caching](https://docs.aws.amazon.com/appsync/latest/devguide/enabling-caching.html), [JS resolvers](https://docs.aws.amazon.com/appsync/latest/devguide/resolver-reference-overview-js.html)) |
| Live balance via two stream hops and a beacon mutation | Partly (subscriptions need a mutation) | Yes. Compute the balance in the write path, publish once, cut stream readers. Or use AppSync Events for push |
| Six stream readers | No | Yes (fan out through one reader, EventBridge Pipes, or merged handlers) |
| GSI eventual consistency and one partition key per type | No (data model) | Same under any API |

## Alternatives

All options keep DynamoDB, the stream processors, reports, storage and SQS. What changes is the client-facing edge.

### A. Keep AppSync GraphQL, fix the client and the live-update path

- **Speed.** Keeps the no-Lambda read path. Gains come from the client (bundle, route loaders, no translation Suspense before data) and from shortening the balance push. AppSync server-side caching is available but adds a billed ElastiCache instance, and its keys include identity ([caching](https://docs.aws.amazon.com/appsync/latest/devguide/enabling-caching.html)).
- **Migration cost.** The lowest. The schema, 122 VTL files and the delivery wiring stay. Optional follow-ups are moving VTL to `APPSYNC_JS` and adding subscription resolvers.
- **Real-time.** Native GraphQL subscriptions over one WebSocket with documented keep-alive, and connections that close after 24 hours ([real-time client](https://docs.aws.amazon.com/appsync/latest/devguide/real-time-websocket-client.html)). Pushing a backend-computed value still needs a mutation.
- **Auth fit.** OIDC with Auth0 today. Amazon Cognito user pools are native, and an API can run several OIDC and Cognito providers at once as additional modes ("You can use multiple Amazon Cognito User Pools and OpenID Connect providers", [AppSync authorization](https://docs.aws.amazon.com/appsync/latest/devguide/security-authz.html)). That would allow an overlap period during a Cognito move.
- **Delivery fit.** No change. `accounts-api` is already a catalogued Deployment Unit for preview, develop and production, and preview workflows read its `AccountsApiUrl` output (`.github/delivery/catalog.json`, `.github/delivery/templates/deploy-to-environment.yml:222`).

### B. REST on API Gateway HTTP API + Lambda

- **Speed.** Every read gains a Lambda invocation, with cold starts that AWS says "typically occur in under 1% of invocations" and last "from under 100 ms to over 1 second", and that are more common in rarely-invoked dev and test functions ([Lambda runtime environment](https://docs.aws.amazon.com/lambda/latest/dg/lambda-runtime-environment.html)). This matters for an internal preview with little traffic. Provisioned concurrency removes cold starts at a cost. HTTP APIs cannot integrate with DynamoDB directly; their first-class AWS integrations are EventBridge, SQS, AppConfig, Kinesis and Step Functions ([integration reference](https://docs.aws.amazon.com/apigateway/latest/developerguide/http-api-develop-integrations-aws-services-reference.html)). Matching GraphQL's one request per screen needs composite endpoints. HTTP APIs have no response caching ([HTTP vs REST](https://docs.aws.amazon.com/apigateway/latest/developerguide/http-api-vs-rest.html)).
- **Migration cost.** High. About 27 client-facing operations become handlers. The owner checks now in VTL (38 templates use `$ctx.identity.sub`) move into code. Stream Lambdas that call AppSync beacon mutations need a new push target. Client codegen and types are replaced. It is a new or replacement Deployment Unit, and the preview workflow's `AccountsApiUrl` and `REACT_APP_APPSYNC_URL` plumbing changes (`.github/delivery/templates/fragments/api-client-output.yml.tmpl`).
- **Real-time.** None built in. Options are API Gateway WebSocket APIs, where the backend must track connection IDs and `POST @connections/{id}` ([`@connections`](https://docs.aws.amazon.com/apigateway/latest/developerguide/apigateway-how-to-call-websocket-api-connections.html)) and authorisation is IAM or Lambda `REQUEST` authorizers only, with no JWT authorizer ([WebSocket access control](https://docs.aws.amazon.com/apigateway/latest/developerguide/apigateway-websocket-api-control-access.html)). The other option is AppSync Events (below).
- **Auth fit.** Native JWT authorizers accept any OIDC issuer, Auth0 or Cognito, and validate `iss`, `aud`, `exp` and scopes. They cache JWKS for up to two hours, and "on a cache miss… adds latency" ([JWT authorizers](https://docs.aws.amazon.com/apigateway/latest/developerguide/http-api-jwt-authorizer.html)).
- **Delivery fit.** Fits the Serverless and esbuild pattern already used by `reports`, `storage` and `notifications`. Those expose API Gateway REST endpoints with `aws_iam` (`applications/accounts/{reports,storage,notifications}/serverless.yml`), and `packages/api-gateway-handler` exists. Each handler keeps an individual archive, as the delivery guide requires (`docs/agents/platform-delivery.md`).

### C. REST (as B) + AppSync Events for real-time

- AppSync Events is a managed pub/sub WebSocket service that does not use GraphQL. It supports OIDC, Cognito, IAM, Lambda and API-key auth per channel namespace, plus `OnPublish`/`OnSubscribe` handlers and HTTP publish from Lambda or EventBridge ([AppSync Events](https://docs.aws.amazon.com/appsync/latest/eventapi/event-api-welcome.html)).
- It replaces the beacon-mutation pattern with a direct publish, and `OnSubscribe` can enforce owner-scoped channels.
- Costs are as in B, plus one more Deployment Unit or stack resource.
- Events can also be adopted under option A to simplify pushes without touching queries.

### D. Server functions in the web app (a backend-for-frontend)

- TanStack Start server functions would read DynamoDB from the app's own server runtime, which makes calls same-origin (no preflight) and allows server-side data loading.
- Viability depends on [#1650](https://github.com/motech-development/platform/issues/1650). Amplify Hosting names Next.js, Nuxt, Astro and SvelteKit as SSR frameworks, and supports others only through an open-source build adapter ([Amplify SSR](https://docs.aws.amazon.com/amplify/latest/userguide/server-side-rendering-amplify.html)). TanStack Start is not listed.
- Auth moves to a server session or token relay, which changes the shape of the Auth0/Cognito seam ([#1657](https://github.com/motech-development/platform/issues/1657)).
- Real-time still needs AppSync GraphQL or Events.
- The map says API changes belong on a separate map, and this option blurs the boundary between client and API.

### Comparison

| | A. Keep AppSync + fixes | B. HTTP API + Lambda | C. B + AppSync Events | D. Web-app server functions |
| --- | --- | --- | --- | --- |
| Read latency shape | Direct DynamoDB, no Lambda | Lambda per request, cold starts on low traffic | As B | Server runtime per request, same-origin |
| Requests per screen | One (batched fields) | One per endpoint unless composite | As B | One per loader |
| Client weight | GraphQL client (can be light) | Plain `fetch` | `fetch` + Events client | Minimal |
| Real-time | Native subscriptions (mutation-triggered) | Build on WebSocket API | Managed pub/sub | Needs A's or C's real-time |
| Auth0 now | OIDC mode | JWT authorizer | JWT + Events OIDC | App session |
| Cognito later | Native, can run alongside OIDC | JWT authorizer | Native in both | App-level |
| Migration cost | Low | High | High | High, and depends on #1650 |
| Delivery fit | Unchanged | New or replacement unit, same toolchain | As B + Events | Bound to the web unit's hosting |

## Implications for other tickets on the map

- **The Owner ID is the identity-provider subject today.** Resolvers use `$ctx.identity.sub` as `owner` and in GSI `data` keys (38 templates), and the client uses `user.sub` for subscriptions. Yet `applications/accounts/CONTEXT.md` defines the Accounts Owner ID as stable and says to avoid "Authentication Provider Subject". A Cognito move changes `sub` whichever API is chosen, so the seam ([#1657](https://github.com/motech-development/platform/issues/1657)) needs a stable owner claim or a mapping. That is an API change and belongs on an API map.
- **Data client and live updates** ([#1658](https://github.com/motech-development/platform/issues/1658)): most of the speed is won or lost here (route loaders, no Suspense-gated data, light transport), whichever API is kept.
- **PWA** ([#1666](https://github.com/motech-development/platform/issues/1666)) and **observability** ([#1665](https://github.com/motech-development/platform/issues/1665)): the legacy service worker and Sentry Replay/tracing are large parts of the legacy boot cost.
- The **idle logout and deep-link** findings bear on the auth seam and on route design ([#1661](https://github.com/motech-development/platform/issues/1661)).

## Source index

Primary local sources (paths relative to `applications/accounts` unless rooted):

- Client boot, auth and routing: `client/src/index.tsx`, `client/src/App.tsx`, `client/src/i18n.ts`, `client/src/pages/**/index.tsx`, `packages/auth/src/{WithAuth,ProtectedRoute}.tsx`
- Apollo and AppSync transport: `packages/appsync-apollo/src/Apollo/Apollo.tsx`, `client/src/components/ApolloClient.tsx`, `client/codegen.ts`
- Screens and operations: `client/src/pages/MyCompanies/**/*.tsx`
- Hosting: `client/serverless.yml`, `infrastructure/serverless.yml`, `client/vite.config.mts`, `client/src/service-worker.ts`, `client/src/serviceWorkerRegistration.ts`
- Local build artifacts used for sizes: `client/build/assets/*.js` and source maps (2026-08-25)
- API: `api/serverless.yml`, `api/schema/*.graphql`, `api/mapping-templates/**`, `api/src/**`
- Data and streams: `data/serverless.yml`, `data/src/transactions.ts`
- Delivery: `docs/agents/platform-delivery.md`, `.github/delivery/catalog.json`, `.github/delivery/templates/**`
- Domain: `applications/accounts/CONTEXT.md`, `DESIGN.md` (API Fit)

Primary external sources:

- AWS AppSync: [authorization](https://docs.aws.amazon.com/appsync/latest/devguide/security-authz.html), [real-time WebSocket client](https://docs.aws.amazon.com/appsync/latest/devguide/real-time-websocket-client.html), [real-time data](https://docs.aws.amazon.com/appsync/latest/devguide/aws-appsync-real-time-data.html), [caching and compression](https://docs.aws.amazon.com/appsync/latest/devguide/enabling-caching.html), [JS resolvers](https://docs.aws.amazon.com/appsync/latest/devguide/resolver-reference-overview-js.html), [AppSync Events](https://docs.aws.amazon.com/appsync/latest/eventapi/event-api-welcome.html)
- Amazon API Gateway: [HTTP vs REST](https://docs.aws.amazon.com/apigateway/latest/developerguide/http-api-vs-rest.html), [JWT authorizers](https://docs.aws.amazon.com/apigateway/latest/developerguide/http-api-jwt-authorizer.html), [HTTP API CORS](https://docs.aws.amazon.com/apigateway/latest/developerguide/http-api-cors.html), [HTTP API AWS integrations](https://docs.aws.amazon.com/apigateway/latest/developerguide/http-api-develop-integrations-aws-services-reference.html), [WebSocket `@connections`](https://docs.aws.amazon.com/apigateway/latest/developerguide/apigateway-how-to-call-websocket-api-connections.html), [WebSocket access control](https://docs.aws.amazon.com/apigateway/latest/developerguide/apigateway-websocket-api-control-access.html)
- AWS Lambda: [execution environment and cold starts](https://docs.aws.amazon.com/lambda/latest/dg/lambda-runtime-environment.html), [DynamoDB streams](https://docs.aws.amazon.com/lambda/latest/dg/with-ddb.html)
- Amazon DynamoDB: [global secondary indexes](https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/GSI.html)
- AWS Amplify Hosting: [SSR](https://docs.aws.amazon.com/amplify/latest/userguide/server-side-rendering-amplify.html)
- Auth0 SPA SDK: [`Auth0Client`](https://github.com/auth0/auth0-spa-js/blob/main/src/Auth0Client.ts), [options](https://github.com/auth0/auth0-spa-js/blob/main/src/global.ts) (installed 2.23.0)
- [react-i18next `useTranslation`](https://react.i18next.com/latest/usetranslation-hook), [Apollo Client queries](https://www.apollographql.com/docs/react/data/queries), [Google Analytics UA sunset](https://support.google.com/analytics/answer/11583528)
