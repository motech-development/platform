# Platform Deployment Context

This context defines the shared deployment language for platform services and clients. It exists so operational tooling, observability, and CI workflows use the same environment names.

## Language

**Stage**:
A deployment identifier used consistently across infrastructure stacks, client builds, and observability.
_Avoid_: Environment, prefix

**Production Stage**:
The live customer-facing stage named `production`.
_Avoid_: Prod env

**Develop Stage**:
The long-lived non-production stage named `develop`.
_Avoid_: Development environment

**Pull Request Stage**:
An ephemeral review stage named `pr-xxx`, where `xxx` is the pull request number.
_Avoid_: Numeric PR environment, test environment

## Relationships

- A **Stage** is also the Sentry environment name.
- A **Pull Request Stage** belongs to exactly one pull request.
- **Production Stage** and **Develop Stage** are long-lived stages.

## Example Dialogue

> **Dev:** "What Sentry environment should PR 1471 use?"
> **Domain expert:** "Use the **Pull Request Stage** `pr-1471`; the stage and Sentry environment are the same value."

## Flagged Ambiguities

- "environment" was used to mean both deployment target and Sentry environment; resolved: use **Stage** as the canonical value for both.
