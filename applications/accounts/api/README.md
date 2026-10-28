# Accounts API GraphQL types

The GraphQL schema in `schema/` is the shared source of truth. The API and client
workspaces own their independent generated outputs so backend consumers do not
depend on the Accounts client. API operation documents in `src/` are read from
their tagged template strings, and API types are checked into
`src/generated/graphql.ts`.

Run `yarn workspace @accounts/api codegen.graphql` after changing a schema or
operation. `yarn workspace @accounts/api typecheck` checks that generated output
is current before running TypeScript. To check generation alone, run
`yarn workspace @accounts/api codegen.graphql.check`. After a schema change,
refresh the client output with `yarn workspace @accounts/client codegen.graphql`
as well.

The generated API file is kept in Code Generator's canonical format and excluded
from source formatting and lint checks. Do not edit it by hand; regenerate it
from the schema and operation documents.

Generated types describe GraphQL contracts at compile time. They do not validate
DynamoDB stream or document data at runtime. Handlers must retain storage-only
metadata and narrow unmarshalled records at the external data boundary.
