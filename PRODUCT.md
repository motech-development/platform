# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Motech Development products are for the people who use each product to complete a specific job. The audience varies by product domain rather than forming one uniform user group.

The currently confirmed end-user segment is the small-business owners and operators who use Accounts to manage company finances while running the rest of their business. Their work includes checking cash position, recording income and outgoings, reviewing pending transactions, managing clients, and exporting reports.

## Product Purpose

This monorepo is the home of Motech Development applications and products, together with the shared capabilities used to build, operate, and deliver them. Each product exists to make its domain-specific work clear and manageable for its users.

Success means people can complete the core jobs of a Motech Development product without unnecessary workflow complexity, while each product remains consistent with the shared identity, accessibility baseline, and operational foundations of the portfolio.

## Positioning

Open decision: Motech Development has not established a single portfolio-level positioning that should be applied to every product.

Accounts may be positioned as a focused company ledger, but that product-specific position must not be generalised to the rest of the portfolio.

## Operating Context

Current user-facing products are delivered as web applications and progressive web applications. Shared identity flows support access across products.

Accounts is the currently documented product domain. It records and manages a company's financial transactions and supports company context, balances, VAT, confirmed and pending transactions, scheduled transactions, clients, attachments, settings, and reports.

The monorepo also contains shared core services, infrastructure, delivery workflows, and reusable packages. These foundations support the products but do not replace their separate domain language, workflows, or user needs.

## Capabilities and Constraints

- Product capabilities and terminology are owned by their domain contexts. The root context must not flatten product-specific language into a generic portfolio model.
- User-facing functionality must be supported by the relevant product API or an established workflow; future work must not invent unsupported capabilities.
- Accounts Owner ID, Pending Transaction, Scheduled Transaction, Publish, and Confirmed Transaction have defined meanings in the Accounts domain record.
- Identity, communication, file handling, security scanning, infrastructure, delivery, and UI foundations are shared where appropriate.
- Breeze UI provides accessible, domain-neutral primitives and patterns for Motech Development applications.
- The portfolio currently targets the web. A future product on another platform requires an explicit product-level decision rather than an assumed portfolio-wide change.
- Portfolio-level positioning remains deliberately undecided.

## Brand Commitments

Motech Development is the shared identity across the portfolio. Products should feel modern, efficient, practical, and professional while preserving the established Motech Development identity and the factual language of their domain.

Task clarity takes priority over novelty. Product-specific identity or voice may extend the shared brand only when it is confirmed for that product.

## Evidence on Hand

- [`README.md`](README.md) identifies this repository as the Motech Development applications monorepo and inventories its applications and reusable packages.
- [`CONTEXT-MAP.md`](CONTEXT-MAP.md) records the distinct Accounts, Breeze UI, and Platform Delivery contexts.
- [`applications/accounts/CONTEXT.md`](applications/accounts/CONTEXT.md) defines the current Accounts domain scope and language.
- `applications/accounts/client` and `applications/accounts/web` contain the current and replacement Accounts product implementations, product copy, tests, and executable user journeys.
- `applications/id/client` contains the shared login, sign-up, password recovery, and password reset experience.
- `packages/breeze-ui` contains the shared accessible UI primitives and interaction patterns used by Motech Development applications.
- `.github/CONTEXT.md` and the delivery catalog document how independently deliverable parts of the platform are validated and delivered.

No portfolio-wide testimonials, customer case studies, press claims, pricing claims, or performance benchmarks are established in this repository. Future product work must not fabricate them.

## Product Principles

- Start with the user and job of the specific product domain; do not force one portfolio positioning onto unrelated products.
- Preserve domain language, product truth, and established workflows before adding or changing capabilities.
- Reuse shared identity, accessibility, UI, infrastructure, and delivery foundations without erasing meaningful product differences.
- Prefer focused, practical workflows over unnecessary operational complexity.
- Base product claims and interface content on evidence present in the relevant domain; record unknowns instead of inventing them.

## Accessibility & Inclusion

Target WCAG AA across user-facing Motech Development products. Preserve product identity where possible, but adjust colour, state styling, focus affordances, text contrast, semantics, and interaction patterns when accessibility requires it.
