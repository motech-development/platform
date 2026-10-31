# Accounts queue

## Company data deletion

The company deletion state machine processes Client, Report, Transaction, and
TransactionCreationReceipt records. It requests pages of up to 100 IDs and
reduces the query limit when the complete JSON-serialized page would exceed 192
KiB. This leaves margin under the Step Functions 256 KiB state payload limit,
including escaped IDs and the continuation key. Each page carries its DynamoDB
continuation key and company owner through the delete step; it does not collect
all matching IDs in workflow state.

DynamoDB BatchWrite accepts at most 25 delete requests, so each 100-ID workflow
page is written as sequential batches of at most 25. Unprocessed items are
retried before the next batch starts. The workflow only advances the
continuation key after every batch in the page succeeds. Client, Report, and
Transaction records are queried through the `__typename-data-index` global
secondary index, which is eventually consistent and does not provide a
snapshot of records that change while deletion is running.

Transaction creation writes a small companion index record keyed by company ID
and a `TransactionCreationReceiptIndex:` sort-key prefix, with an owner field
checked by the cleanup query. Company deletion queries these records directly
from the base table with strongly consistent reads, then deletes the matching
receipt rows before deleting their companion index records. A failed receipt
batch therefore leaves every lookup record available for a workflow retry.
Receipts and their companion records remain
when an individual Transaction is deleted, preserving idempotency without
recreating that Transaction on retry. The API's atomic company ownership check
prevents new records after the company is gone.

This is a Standard Step Functions workflow, which has a hard 25,000-event
execution-history limit. Larger pages reduce the number of loop iterations, but
very large company deletions can still reach that limit; the workflow makes no
unlimited-size guarantee.

The workflow state contract changed from grouped `items` plus `count` and
`current` to one flat `items` page plus an optional `lastEvaluatedKey`. Before
deploying this change, wait for all in-flight company deletion executions to
finish. Executions started with the previous state contract cannot safely
continue through the new Lambda handlers.

Each paginated branch drops its final page from the branch result. The delete
trigger does not consume execution output, and this keeps the Parallel state's
combined result small when multiple cleanup branches return near the page-size
bound.
