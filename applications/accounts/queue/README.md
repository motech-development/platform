# Accounts queue

## Company data deletion

The company deletion state machine processes Client, Report, and Transaction
records in pages of at most 25 IDs. Each page carries its DynamoDB continuation
key and company owner through the delete step; it does not collect all matching
IDs in workflow state. The query uses the `__typename-data-index` global
secondary index, which is eventually consistent and does not provide a snapshot
of records that change while deletion is running.

The workflow state contract changed from grouped `items` plus `count` and
`current` to one flat `items` page plus an optional `lastEvaluatedKey`. Before
deploying this change, wait for all in-flight company deletion executions to
finish. Executions started with the previous state contract cannot safely
continue through the new Lambda handlers.
