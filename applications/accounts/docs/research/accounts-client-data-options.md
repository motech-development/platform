# Accounts client data options

**Status:** Research finding for “Research GraphQL and AppSync data-client options”  
**Date:** 2026-07-26

## Question

What do current primary sources and repository evidence show about Apollo and
credible modern alternatives for the unchanged Accounts AppSync API, including
Auth0 bearer authentication, queries, mutations, subscriptions, caching,
pagination, optimistic updates, type safety, errors, runtime cost, React
integration, testing, presigned file flows, and possible later offline work?

## Finding

There are two decision-worthy choices:

1. **Apollo Client 4 with the AWS AppSync Apollo links v4** is the lowest-risk
   compatibility path. It directly preserves the existing normalized-cache
   model, React API, Auth0 token callback, subscription flow, pagination merge
   policies, cache updates, and test style. The material drawback is that AWS
   places its Apollo links in maintenance mode and explicitly says they do not
   provide offline support.
2. **AWS Amplify API (GraphQL transport only) with TanStack Query 5** is the
   credible modern alternative. AWS recommends Amplify for web clients using
   AppSync, it can connect to an existing AppSync endpoint with OIDC, and AWS
   documents using its GraphQL client with TanStack Query. It replaces
   normalized graph caching with query-key/document caching and therefore
   requires an explicit query-key factory plus subscription/mutation update or
   invalidation rules.

**urql 5 with Graphcache is technically capable but should not remain on the
default shortlist.** It offers normalized caching, optimistic/subscription
updates, pagination, and an experimental offline exchange, but there is no
first-party AppSync transport in the reviewed urql material. Supporting the
unchanged AppSync real-time protocol would require an integration backed by
Amplify or a custom exchange. That adds a second abstraction without a
demonstrated benefit.

The architecture decision should not be made from package download or unpacked
sizes. The walking skeleton should implement the same vertical slice with the
two shortlisted stacks and compare production route chunks, runtime work,
network behaviour, and implementation complexity. Compatibility is the first
gate; a smaller bundle is useful only after query, mutation, subscription,
cache-update, and Auth0 behaviour are proven.

## Repository evidence: what the replacement must preserve

### AppSync and Auth0 are a coupled transport requirement

The current shared wrapper builds an Apollo link chain from
`aws-appsync-auth-link` and `aws-appsync-subscription-link`, supplies
`getAccessTokenSilently()` as an asynchronous OIDC JWT callback, and uses the
same callback for HTTP operations and subscriptions
([wrapper](../../../../packages/appsync-apollo/src/Apollo/Apollo.tsx#L34-L65)).
This is more than adding an `Authorization` header to `fetch`.

AppSync queries and mutations use HTTPS, while subscriptions use a distinct
real-time WebSocket endpoint and an AppSync-specific handshake, authorization
payload, acknowledgement, keep-alive, start, and stop lifecycle. OIDC
authorization is encoded into the WebSocket handshake and subscription
registration
([AWS real-time protocol](https://docs.aws.amazon.com/appsync/latest/devguide/real-time-websocket-client.html)).
AWS AppSync accepts OIDC tokens from compliant providers
([AWS authorization modes](https://docs.aws.amazon.com/appsync/latest/devguide/security-authz.html)).
Any candidate must therefore prove both Auth0-authenticated HTTP and
Auth0-authenticated WebSocket reconnect/refresh behaviour.

The unchanged schema has ordinary queries and mutations plus two subscription
fields, `onTransaction` and `onNotification`, triggered by IAM-authenticated
beacon mutations
([schema](../../api/schema/schema.graphql#L1-L51)). The client has 34 declared
operations in its TSX sources: 15 queries, 16 mutations, and 3 subscription
documents. The duplicate subscription document is still part of the migration
inventory, even though the schema has two subscription fields.

### The application already depends on normalized-cache behaviour

This is not merely request deduplication:

- `Transactions` is keyed by both `id` and `status`; pages are appended and
  deduplicated, while dangling references are filtered after deletion
  ([type policy](../../client/src/components/ApolloClient.tsx#L363-L378)).
- Transaction deletion modifies related cached collections, evicts the entity,
  and garbage-collects it
  ([delete policy](../../client/src/components/ApolloClient.tsx#L155-L213)).
- Notification subscription results are parsed, written as normalized
  `Notification` and `Report` entities, then inserted into every relevant list
  without a refetch
  ([subscription policy](../../client/src/components/ApolloClient.tsx#L224-L359)).
- The confirmed-transactions screen uses `nextToken`, `fetchMore`, and
  `subscribeToMore` to merge additional pages and live balance changes
  ([accounts screen](../../client/src/pages/MyCompanies/Accounts/Accounts.tsx#L23-L159)).

Most domain objects have stable `id` fields, but some wrappers and reports have
nullable IDs
([report schema](../../api/schema/report.graphql#L1-L12)), while the
transaction-list wrapper needs the `id + status` composite identity
([transaction schema](../../api/schema/transaction.graphql#L6-L25)).
A normalized candidate therefore needs explicit key rules and tests; a
document/query-key candidate needs explicit invalidation or multi-query update
rules.

Apollo automatically adds `__typename` when normalizing results
([Apollo cache normalization](https://www.apollographql.com/docs/react/caching/overview)).
The current code generator hides it from generated result types with
`skipTypename: true`
([codegen](../../client/codegen.ts#L17-L30)), while the transport strips
`__typename` from mutation variables before AppSync receives them
([wrapper](../../../../packages/appsync-apollo/src/Apollo/Apollo.tsx#L47-L61)).
The replacement should generate typed operations with runtime typenames for any
normalized cache, but map mutation inputs explicitly or otherwise strip cache
metadata from variables.

### Presigned files are a separate HTTP data path

Uploads are a two-step flow: `requestUpload` returns an ID and presigned URL,
then the browser PUTs the raw `File` to that URL with its `Content-Type`; only
after success is the attachment path written into the form
([upload](../../client/src/pages/MyCompanies/Accounts/shared/UploadAttachment.tsx#L10-L101)).
Downloads similarly call `requestDownload`, GET the returned URL as a `Blob`,
and save or display it; deletion remains a GraphQL mutation
([download](../../client/src/pages/MyCompanies/Accounts/shared/ViewAttachment.tsx#L20-L150)).

No GraphQL cache choice improves this flow. Keep presigned HTTP transfer behind
a small file-transfer service using browser `fetch` (or an equally small HTTP
adapter), with progress/cancellation added only if the UI requires it. Do not
route signed S3 URLs through GraphQL middleware, attach Auth0 headers to them,
or cache signed URLs as durable offline data.

### Tests and delivery favour a browser-first client

The existing component tests are heavily coupled to Apollo's
`MockedProvider`, custom cache policies, and `waitForApollo`; Apollo therefore
has a testing migration advantage, but those unit tests are not themselves the
red-line smoke-test contract. Apollo provides a network-free
`MockedProvider`
([Apollo testing](https://www.apollographql.com/docs/react/development-testing/testing/)).
TanStack Query's official guidance uses an isolated `QueryClientProvider` per
test and mocks the transport boundary
([TanStack testing](https://tanstack.com/query/latest/docs/framework/react/guides/testing)).

The current client is a Vite SPA/PWA deployed as static files from `build` to
the Accounts bucket, with no-cache HTML/service-worker headers
([delivery config](../../client/serverless.yml#L1-L37)). CI injects the existing
AppSync URL and region, builds the same client, and runs the Chromium Playwright
suite. None of the data candidates requires SSR or a server runtime. Server
prefetching authenticated AppSync data would add token-handling and cache
hydration concerns without reducing the underlying API latency; it should be a
separate, evidence-led framework decision.

## Comparison

| Concern | Apollo Client 4 + AppSync links v4 | Amplify API + TanStack Query 5 | urql 5 + Graphcache |
| --- | --- | --- | --- |
| Existing AppSync HTTP/OIDC | Direct continuation of the proven `jwtToken` callback | Existing endpoints and OIDC are supported; bridge Auth0 through a custom token provider | HTTP auth is straightforward, but needs an AppSync-aware transport integration |
| AppSync subscriptions | AWS link implements the real-time handshake and supports Apollo 4 | Amplify manages the AppSync subscription connection and reconnects | No first-party AppSync exchange found; use Amplify underneath or write/own one |
| Cache model | Normalized by default; closest to existing policies | Query-key/document cache; favour invalidation and targeted immutable updates | Document cache by default; Graphcache opts into normalization |
| `nextToken` pagination | Field/type merge policies or `fetchMore` | Natural fit for `useInfiniteQuery` page params | Custom Graphcache resolver; built-in helpers target offset/Relay shapes |
| Mutation and live updates | Normalized writes, `cache.modify`, `update`, optimistic layers | `setQueryData`, invalidation, and optimistic rollback per affected query key | Graphcache mutation/subscription updaters and optimistic resolvers |
| Code generation | GraphQL Codegen client preset and typed documents work directly | Same preset; string document mode is available for fetch-style clients | Same preset; ensure runtime `__typename` selections for Graphcache |
| Errors | Rich GraphQL/network/protocol error classes and policies; Apollo 4 migration changes existing `ApolloError` handling | Transport adapter must convert GraphQL result errors into thrown typed errors for Query error/retry semantics | `CombinedError` plus exchange-level policy |
| React | First-party hooks, Suspense hooks, and provider | First-party React Query hooks; Amplify remains transport-only | First-party React bindings |
| Testing | Closest to existing mocks and cache-policy tests | Isolated `QueryClient`; mock the typed transport; easier to test key/invalidation policy separately | Mock exchanges plus Graphcache integration tests |
| Runtime/bundle expectation | Richest single client and normalized cache; measure tree-shaken production output | Two libraries, but query cache is simpler; do not assume it is smaller until built | Modular and potentially lean, offset by Graphcache plus AppSync bridge |
| Later offline | Cache extraction/restoration is possible, but AWS says its Apollo v3/v4 links have no offline support | Query persistence, paused mutations, and network modes are available; AppSync reconciliation remains application work | Graphcache has persisted cache and an experimental offline exchange |
| Main risk | AWS AppSync links are maintenance-mode compatibility/security code | Recreating cross-query consistency and live-update semantics explicitly | Owning an uncommon AppSync transport composition |

## Option details

### 1. Apollo Client 4 with AWS AppSync links v4

Apollo remains a current React GraphQL client with normalized caching,
subscriptions, configurable fetch policies, optimistic layers, cache
interaction, and React testing support
([Apollo overview](https://www.apollographql.com/docs/react),
[cache](https://www.apollographql.com/docs/react/caching/overview),
[optimistic UI](https://www.apollographql.com/docs/react/performance/optimistic-ui/)).
Its field policies directly express the current composite keys, cursor-page
merges, entity eviction, and subscription-driven list insertion.

AWS's AppSync links now support Apollo Client 4 and GraphQL 16, including OIDC
JWT callbacks and the AppSync subscription handshake. However, AWS labels both
v3 and v4 links as **maintenance mode**: compatibility and security updates
continue, but no new features will be introduced. AWS also explicitly states
that these links do not provide offline support
([AWS AppSync Apollo links](https://github.com/awslabs/aws-mobile-appsync-sdk-js#aws-appsync-links-for-apollo-v3-and-v4-maintenance-mode)).

Apollo 4 should be treated as a real upgrade, not a package-version edit.
Current Apollo error handling distinguishes GraphQL, network, and protocol
errors and uses new error classes and policies
([Apollo operation errors](https://www.apollographql.com/docs/react/data/error-handling/)).
The new client must replace assumptions around Apollo 3's `ApolloError`, retest
subscription error delivery, and build a fresh AppSync wrapper rather than
changing the React-18-constrained shared wrapper used by the old app.

**Best when:** preserving rich normalized behaviour and minimizing integration
risk matters more than moving to AWS's preferred client path.

### 2. Amplify API (GraphQL only) with TanStack Query 5

Amplify can be configured against an existing AppSync endpoint and region with
`defaultAuthMode: "oidc"`; it does not require an Amplify-provisioned backend.
AWS documents both custom token providers for OIDC AppSync use and subscription
connection management
([existing AppSync configuration](https://docs.amplify.aws/gen1/react/build-a-backend/graphqlapi/connect-to-api/),
[custom token provider](https://docs.amplify.aws/gen1/react/build-a-backend/auth/advanced-workflows/#custom-token-providers),
[subscriptions](https://docs.amplify.aws/gen1/react/prev/build-a-backend/graphqlapi/subscribe-data/)).
This lets Auth0 remain the authentication SDK while Amplify is only the
AppSync-aware transport.

AWS explicitly documents combining the Amplify GraphQL API category with
TanStack Query for query keys, loading/error states, optimistic updates, and
rollback
([Amplify optimistic UI](https://docs.amplify.aws/gen1/javascript/build-a-backend/graphqlapi/optimistic-ui/)).
TanStack Query has first-party cursor/infinite-query support, direct cache
updates, targeted invalidation, optimistic mutation rollback, retries, query
persistence, and network modes
([infinite queries](https://tanstack.com/query/latest/docs/framework/react/guides/infinite-queries),
[optimistic updates](https://tanstack.com/query/latest/docs/framework/react/guides/optimistic-updates),
[persistence](https://tanstack.com/query/latest/docs/framework/react/plugins/persistQueryClient),
[network modes](https://tanstack.com/query/latest/docs/framework/react/guides/network-mode)).

The cost is policy work the normalized cache currently performs implicitly. The
new app would need one typed query-key factory and central rules for:

- company, client, settings, balance, transaction-list/status, notification,
  and report keys;
- invalidating or immutably updating every affected list/detail query after
  mutations;
- applying `onTransaction` and `onNotification` events to all relevant cached
  keys, including notification-to-report payload handling;
- normalizing Amplify's GraphQL result errors into thrown domain/transport
  errors so TanStack retry logic never retries authorization or deterministic
  GraphQL failures; and
- resubscribing and invalidating authoritative queries after reconnect because
  Amplify documents that events missed offline are not replayed automatically.

This is not inherently worse than normalized caching; it is more explicit and
can be easier to reason about when there are few overlapping views. The current
cache-policy code shows enough cross-view coupling that the walking skeleton
must prove the rules do not become scattered across route components.

**Best when:** AWS-supported AppSync transport direction and an explicit
server-state model outweigh the convenience of normalized graph updates.

### 3. urql 5 with Graphcache — reserve, not default shortlist

urql's default exchange is a document cache. Its optional Graphcache exchange
provides reactive normalized caching, custom keys and resolvers,
mutation/subscription updaters, optimistic mutation results, pagination, cache
persistence, and an experimental offline exchange
([Graphcache overview](https://urql.dev/docs/graphcache/),
[Graphcache API](https://urql.dev/docs/api/graphcache/)).
It can therefore model the Accounts cache.

The blocker is transport ownership. AppSync subscriptions are not a plain
GraphQL-over-WebSocket connection; they require the AppSync handshake described
above. The reviewed urql first-party docs expose extensible exchanges but no
AppSync exchange. A viable implementation would either adapt Amplify's
Observable subscription API into urql or implement the AWS protocol. The former
stacks two clients; the latter takes ownership of authentication refresh,
keep-alives, reconnect, and protocol changes. Neither is justified before
Apollo and Amplify-plus-TanStack fail a measured requirement.

**Reconsider only if:** a small transport prototype already exists or bundle
evidence shows a material win that pays for this integration risk.

## Code generation and type-safety direction

GraphQL Code Generator's client preset is compatible with Apollo, urql,
graphql-request, and React Query-style clients, and produces typed documents
independently of the runtime client
([client preset compatibility](https://the-guild.dev/graphql/codegen/docs/guides/react-vue)).
The TanStack guide shows a typed fetcher using the same preset
([React Query guide](https://the-guild.dev/graphql/codegen/docs/guides/react-query)).
The choice of data client therefore does not require changing the API or giving
up generated result/variable types.

For the replacement:

1. Keep the local schema glob as the contract source so the build never depends
   on live introspection.
2. Generate typed documents for queries, mutations, **and subscriptions**.
3. Do not reuse generated Apollo cache-helper types as an architectural
   boundary.
4. Ensure `__typename` is present in runtime documents when using Apollo or
   Graphcache; GraphQL Codegen calls this out for normalized clients
   ([normalized-cache transform](https://the-guild.dev/graphql/codegen/plugins/presets/preset-client#normalized-caches-urql-and-apollo-client)).
5. Map GraphQL results to explicit mutation inputs instead of passing cached
   objects back to AppSync.

## Offline is not a discriminator for the initial build

The required PWA shell can be installable and cache static assets independently
of the GraphQL client. Later cached reads are feasible with Apollo cache
restore, TanStack query persistence, or Graphcache storage, but **none of these
alone makes offline accounting writes safe**.

AWS says disconnected AppSync subscriptions automatically reconnect but missed
messages are not replayed
([Amplify subscriptions](https://docs.amplify.aws/gen1/react/prev/build-a-backend/graphqlapi/subscribe-data/)).
Queued offline writes also need rules for expired Auth0 tokens, expired
presigned URLs, mutation idempotency, ordering, conflicts, reconciliation, and
user-visible failure recovery. The current unchanged API exposes ordinary CRUD
mutations, not a sync protocol. Treat authoritative offline writes as a later
feasibility decision; for now, isolate transport and cache policy so it can be
changed without route-component rewrites.

## Walking-skeleton proof required before the final choice

Build the same disposable vertical slice with the two shortlisted candidates:

1. obtain and refresh the Auth0 token, query one company and its balance;
2. execute a mutation whose result updates both a detail and a list;
3. load two `nextToken` transaction pages without duplication;
4. receive `onTransaction` and `onNotification`, including notification-driven
   report insertion;
5. disconnect/reconnect the subscription and refetch authoritative state;
6. request a signed upload, PUT a file with `Content-Type`, request/download the
   blob, and delete it;
7. demonstrate GraphQL, HTTP, authentication, and subscription errors without
   inappropriate retries;
8. unit-test the cache/update policy without a live backend; and
9. produce a production build with route-level chunk sizes and a browser trace
   for cold load, cached revisit, mutation, and subscription delivery.

Choose Apollo if both candidates pass and Amplify-plus-TanStack does not show a
material simplicity, runtime, or bundle advantage. Choose
Amplify-plus-TanStack if it passes with centralized query/update rules and
removes enough AppSync-link lifecycle risk to justify rewriting cache
semantics. Do not choose from nominal package size alone.

## Decision-ready shortlist

- **Default / compatibility leader:** Apollo Client 4 +
  `aws-appsync-auth-link` 4 + `aws-appsync-subscription-link` 4.
- **Modern alternative to prototype:** `aws-amplify/api` GraphQL transport +
  TanStack Query 5, with Auth0 supplied through an OIDC custom token provider.
- **Reserve:** urql 5 + Graphcache, only after an AppSync transport approach and
  measurable benefit exist.
- **Not part of the data-client choice:** presigned file PUT/GET transport,
  form state, URL state, and general client UI state.
