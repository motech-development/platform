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

## Unit tests

```sh
yarn workspace @accounts/data exec vitest run src/handlers/__tests__/insert-typeahead.test.ts src/__tests__/typeahead.test.ts
```
