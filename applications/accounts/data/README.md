# Accounts data

## Transaction suggestions

The Typeahead stream handler merges purchase descriptions, sale descriptions,
and purchase suppliers into company-scoped, unique lists sorted with
`localeCompare`, matching the Accounts client. Lists remain compatible with the
new-company initializer and the existing `getTypeahead` GraphQL response.
Missing fields and legacy string sets are normalized on the next Transaction
insert or update. Existing suggestions are retained when Transactions are edited.

Each stream batch merges its inserts and updates once per company. The write
requires the stored suggestion fields to match the preceding consistent read;
a concurrent change fails the write instead of losing suggestions. Stream
failures are logged and rethrown for the configured DynamoDB event source to
retry. Replayed suggestions are a no-op once the stored lists match.

This change does not rebuild suggestions from historical Transactions.

## DynamoDB integration tests

Run the AWS DynamoDB Local image in a temporary container:

```sh
docker run --detach --rm --name accounts-typeahead-test --publish 127.0.0.1::8000 amazon/dynamodb-local -jar DynamoDBLocal.jar -inMemory -sharedDb
docker port accounts-typeahead-test 8000
```

Set `DYNAMODB_ENDPOINT` to `http://` followed by the reported local address and
port, then run from the repository root:

```sh
yarn workspace @accounts/data exec vitest run --config vitest.integration.config.ts
docker stop accounts-typeahead-test
```

The integration suite requires a local endpoint, creates and removes its own
isolated table, and exercises real AWS SDK marshalling and DynamoDB updates.
It covers the original invalid list `ADD`, empty and populated list records,
legacy sets, missing records and fields, duplicate delivery, company isolation,
concurrent writes and retry, and fresh-client reads of persisted suggestions.

The ordinary unit tests do not require DynamoDB Local:

```sh
yarn workspace @accounts/data exec vitest run src/handlers/__tests__/insert-typeahead.test.ts src/__tests__/typeahead.test.ts
```
