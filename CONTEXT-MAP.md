# Context Map

This repository contains multiple domain contexts. Read the context document and ADRs relevant to the area being changed.

## Accounts

- **Scope**: Recording and managing a company's financial transactions.
- **Context document**: [`applications/accounts/CONTEXT.md`](applications/accounts/CONTEXT.md)
- **ADRs**: `applications/accounts/docs/adr/` (created lazily when an Accounts decision warrants one)

## Breeze UI

- **Scope**: The public component, interaction, and styling contracts of `@motech-development/breeze-ui`.
- **Context document**: `packages/breeze-ui/CONTEXT.md` (created lazily when its domain language is documented)
- **ADRs**: [`packages/breeze-ui/docs/adr/`](packages/breeze-ui/docs/adr/)

## Platform Delivery

- **Scope**: The environments through which changes to the platform are validated and delivered.
- **Context document**: [`.github/CONTEXT.md`](.github/CONTEXT.md)
- **ADRs**: `.github/docs/adr/` (created lazily when a delivery decision warrants one)
- **Implementation specification**: [GitHub issue #1492](https://github.com/motech-development/platform/issues/1492)
