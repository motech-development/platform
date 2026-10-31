# Accounts API

## Transaction creation retries

Clients must send a stable, non-empty `TransactionInput.id` for each transaction creation command and reuse it when retrying that command. The API uses that value as the opaque command identity in a permanent owner-scoped receipt. Valid UUID command IDs remain the Transaction ID; other command IDs receive a generated UUID Transaction ID so report generation can validate it. The API atomically stores the Transaction, receipt, and company lookup record, so matching retries return the original result and conflicting payloads fail.

Each receipt also has an owner-scoped companion lookup record keyed by the company ID and a receipt-index typename. The API writes that record in the same transaction as the Transaction and receipt, allowing company deletion to find receipts with a strongly consistent table query while retaining an owner guard. Deleting a Transaction individually leaves its receipt and lookup record in place: a matching retry returns the original result and does not recreate the deleted Transaction. Transaction creation checks company ownership atomically, so a missing or deleted company cannot be used to recreate a Transaction during cleanup.

Empty IDs remain supported for older clients. The API generates a new UUID Transaction ID for each such request, so legacy empty-ID requests do not receive the idempotency guarantee. Deploy the API before releasing a client that sends stable command IDs.
