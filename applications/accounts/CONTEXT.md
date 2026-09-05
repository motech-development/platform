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

The API's `onTransactionChange(id, owner)` subscription identifies a changed
transaction within a company. Here `id` is the company ID and `owner` is the
Accounts Owner ID; the subscription resolver requires `owner` to match the
authenticated user's identity. The IAM-only `transactionChangeBeacon` mutation
publishes the company ID, owner and transaction ID from Transaction stream
inserts, updates and removals, including Pending Transaction attachment cleanup.
A scope change also notifies the former company and owner.

Signals contain no financial changes or balance snapshots. The Accounts client
reads `getTransactionState(companyId, transactionId)` after each signal. This
owner-checked query reads the base table with strong consistency, returning null
for a deleted, moved or inaccessible transaction. It avoids the propagation lag
of the secondary index used by transaction lists. The existing `onTransaction`
subscription continues to carry confirmed balance updates; transaction signals
can arrive before the separate balance calculation completes.

The client overlays these current records and deletion markers on Pending and
Confirmed lists, so delayed index responses cannot overwrite a correction or
restore a deleted row. Confirmed corrections respect the loaded date window
and page size while more pages remain; older unseen records appear when their
page is loaded. Repeated signals never apply financial amounts again.
Reads for the same transaction are serialized; a newer signal during a read
causes another read before applying the result. Successful local edits and
deletions update the retained correction immediately; reads started before that
mutation cannot overwrite its result. Failed reads retry with backoff.
Corrections survive navigation for the signed-in session and are rechecked on
return to an account. Lists fetch fresh data when mounted, replacing first-page
membership while cursor requests still append older pages. Opening a transaction
also reads its current state. Account changes cancel obsolete reads and subscriptions;
changing the signed-in owner resets corrections. Transaction details reconcile
incoming corrections into unchanged form fields and synchronize attachment
changes while preserving locally edited fields and replacement uploads. A
scheduled publication therefore updates the status and scheduled flag without
resetting an unrelated edit. An inaccessible transaction returns the user to its
account list.

Dropped subscriptions reconnect with backoff and refresh known corrections,
open lists and the currently viewed transaction, even if that transaction has
never received a signal. Recovery runs after the server acknowledges the
subscription, which also resets retry backoff even without transaction traffic.
The subscription does not provide durable replay: newly created
transactions whose signals were missed depend on the list refresh and its index
visibility. Continuous connection handling does not assume an index query has
caught up when a signal arrives.

The publisher processes batches of up to ten stream records in order, with a
60-second timeout. It reports the first failed record using partial batch failure
reporting so Lambda retries from that record, including any later records. A
replayed signal is safe to receive more than once. Transaction images without a
valid transaction ID, company ID or owner are logged and skipped; retrying those
immutable malformed images cannot recover a notification scope and would
prevent later valid records from being processed. If an update has a valid
former scope but a malformed current image, the former scope is still notified;
failures to publish that notification remain retryable.

Verification uses the existing API and client unit-test setups; no separate
subscription testing infrastructure is required.
