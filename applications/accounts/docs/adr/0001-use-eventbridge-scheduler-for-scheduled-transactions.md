---
status: accepted
---

# Use EventBridge Scheduler for Scheduled Transactions

Scheduled Transactions will use one-time EventBridge schedules with a dedicated SQS publication queue and an idempotent publishing Lambda, all owned by `accounts-data`. The DynamoDB Transaction remains the source of truth; EventBridge schedules are derived infrastructure, and the synthetic `ScheduledTransaction` items will be removed. Publication will conditionally confirm the Transaction and create its notification in one atomic DynamoDB transaction, making duplicate or stale commands harmless. This replaces DynamoDB TTL-triggered publication and the CI/CD warm-up service because TTL deletion has nondeterministic timing; a queue is retained between the scheduler and publisher so publication commands are durable, retryable, and dead-lettered independently of schedule delivery. Direct Lambda invocation, a recurring DynamoDB sweeper, and per-transaction Step Functions executions were rejected in favour of clearer failure handling, one-minute precision, and deterministic testing.

The derived schedule is created when a Transaction becomes Pending and Scheduled, replaced under the same deterministic name when its Transaction Date changes, and deleted when scheduling is disabled or the Transaction is confirmed or deleted. Other edits do not affect it, completed one-time schedules delete themselves, and stale invocations are acknowledged as no-ops by the conditional publisher.

Failures to synchronise a Transaction change into EventBridge Scheduler will no longer be swallowed. The DynamoDB stream record will be attempted up to five times before the complete failed invocation is retained in an encrypted S3 failure store for 14 days. An S3 object-created event is sent through EventBridge to the schedule-synchronisation dead-letter queue, so the queued object reference raises the independent operational alarm while preserving the Transaction image beyond DynamoDB Streams' retention period.

EventBridge Scheduler will retry failure to deliver a publication command for up to 24 hours. Exhausted delivery attempts will be sent to a scheduler-delivery dead-letter queue and raise an operational alarm.

After a command reaches the publication queue, failed publication will be attempted up to five times before the command is sent to a separate publication-processing dead-letter queue and an operational alarm is raised.

Each dead-letter queue will have a CloudWatch alarm that invokes a Sentry-reporting Lambda when messages are present. Sentry is the operational notification surface, while failed publication and scheduler-delivery messages remain in their queues and schedule-synchronisation failures remain in their referenced S3 objects for diagnosis and recovery.

Dead-letter recovery is manual after the underlying fault is understood. Schedule-synchronisation failures use the retained invocation's Transaction ID to reconcile the current Transaction state; publication-processing failures can be redriven to the publication queue; scheduler-delivery failures require the affected schedule to be retried or recreated.

The change will use a single cutover without backfilling existing schedules because the application has no existing Scheduled Transactions. TTL-based scheduling, its synthetic records, and the warm-up service can therefore be removed in the same change; DynamoDB TTL remains enabled for unrelated expiry behaviour.

## Validation

The existing smoke test remains unchanged. The initial implementation will preserve a Scheduled Transaction's `00:00 UTC` expression even when that time is already in the past and use the smoke test to validate EventBridge Scheduler's behaviour. If the Transaction does not publish within the existing ten-minute timeout, overdue schedules will be revisited rather than weakening or bypassing the full-path test.
