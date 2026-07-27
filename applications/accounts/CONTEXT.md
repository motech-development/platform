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
