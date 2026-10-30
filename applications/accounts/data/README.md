# Accounts data stream operations

## Balance projection rollout and replay

Balance projection event markers deduplicate events processed by the updated
stream handlers. They cannot identify events applied before the markers were
introduced. For rollout or recovery, drain the affected stream mapping at a
controlled checkpoint, reconcile the stored balances against their source
transactions, and only then resume from that checkpoint. Do not replay
pre-marker events into an already projected balance without reconciling it
first.

Markers are permanent items in the Accounts table so retained or manually
replayed stream events stay deduplicated. Keep the restore workflow's stream
suppression in place: restored balances already include their transaction
projections, so restore-generated stream records must not be applied again.

## Attachment cleanup retries

The transaction removal stream sends delete requests to SQS in batches of at
most ten. Transient per-entry send failures are retried with bounded backoff;
sender faults or exhausted retries fail the stream invocation. Since the stream
retries the full batch, some delete messages may be sent more than once. The
downstream file deletion operation must remain safe to replay.

Virus scan cleanup reports failed SQS records individually. Each matching
attachment removal and its `VIRUS_SCAN_FAIL` notification are written
atomically, and the attachment condition prevents a stale index result from
removing a replacement file.
