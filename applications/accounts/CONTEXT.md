# Accounts

The Accounts context records and manages a company's financial transactions.

## Language

**Accounts Owner ID**:
The stable identifier that associates an Accounts user with their companies, transactions, notifications, reports, subscriptions, and files.
_Avoid_: Authentication Provider Subject

**Transaction Date**:
The UTC calendar date assigned to a transaction. A Transaction Date begins at 00:00 UTC.

**Pending Transaction**:
A transaction that has been recorded but is not yet part of the confirmed accounts.
_Avoid_: Draft Transaction

**Scheduled Transaction**:
A Pending Transaction configured to be published automatically on its transaction date.

**Publish**:
The scheduled transition of a Pending Transaction into a Confirmed Transaction.

**Confirmed Transaction**:
A transaction that forms part of the confirmed accounts.

## Transaction notifications

The API's `onTransactionChange(id, owner)` subscription signals that a company's
transactions should be fetched again. Here `id` is the company ID and `owner` is
the Accounts Owner ID; the subscription resolver requires `owner` to match the
authenticated user's identity. The IAM-only `transactionChangeBeacon` mutation
publishes these signals from Transaction stream inserts, updates and removals,
including Pending Transaction attachment cleanup.

Signals contain only the company ID and owner, never financial changes or balance
snapshots. Consumers reconcile by fetching current transaction data; duplicate
signals must not apply a transaction again. The existing `onTransaction`
subscription continues to carry confirmed balance updates. Transaction signals
can arrive before the separate balance calculation completes. The transaction
list also uses an eventually consistent secondary index: receipt of a signal
does not guarantee that an immediate list query includes the change. End-to-end
client reconciliation must account for that propagation lag.

The publisher processes batches of up to ten stream records in order, with a
60-second timeout. It reports the first failed record using partial batch failure
reporting so Lambda retries from that record, including any later records. A
replayed signal is safe to receive more than once.
Transaction images without a valid company ID or owner are logged and skipped;
retrying those immutable malformed images cannot recover a notification scope
and would prevent later valid records from being processed.

The legacy Accounts client does not yet consume `onTransactionChange`. Its Pending
page therefore needs a separate client change to refresh automatically. Backend
verification uses the existing unit-test setup; no separate subscription test
infrastructure is required.
