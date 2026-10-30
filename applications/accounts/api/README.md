# Accounts API

## Transaction creation retries

Clients must send a stable, non-empty `TransactionInput.id` for each transaction creation command and reuse it when retrying that command. The API atomically stores the Transaction with an owner-scoped creation receipt, so matching retries return the original result and conflicting payloads fail.

Empty IDs remain supported for older clients. The API generates a new Transaction ID for each such request, so legacy empty-ID requests do not receive the idempotency guarantee. Deploy the API before releasing a client that sends stable command IDs.
