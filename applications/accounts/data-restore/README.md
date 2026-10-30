# Accounts data restore

The restore Lambda replaces the target table contents with the source table
contents. It reads every scan page, writes in DynamoDB's 25-request batches,
retries unprocessed writes with bounded backoff, and fails the invocation if any
write remains incomplete. The source and target must be different tables with
the Accounts `id` and `__typename` key schema.

Keep both source and target tables quiescent for the full restore. DynamoDB
scans are paginated and strongly consistent per item, but they do not provide a
table-wide snapshot while writes continue. A failed run can leave a partially
cleared or copied target; it reports failure and attempts to restore the
original stream state, but it does not roll back table data. Rerun only after
the source is stable and the cause of the failure is addressed.

Before running a restore, detach every Lambda event source mapping associated
with any stream ARN for the target table, including mappings that are already
disabled. The restore checks for these mappings before changing data and refuses
to proceed while any remain. Pause or detach any non-Lambda stream consumers as
part of the same maintenance window; Lambda mappings are the consumers this
function can discover automatically.

When the target stream was enabled, the restore disables it during the copy and
re-enables it with its original view type, waiting for DynamoDB to return the
table to `ACTIVE` after each transition. DynamoDB assigns a new stream ARN after
streams are re-enabled, so redeploy the consumers against the target table after
the restore. A target whose stream was disabled before the restore remains
disabled.

The table copy includes Accounts projections such as `Balance` and transaction
attachments. Do not replay the restore's stream records into the restored table:
the copied projection already reflects the source data, and replay could apply
accounting changes or attachment cleanup a second time.
