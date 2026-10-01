# Replace Breeze UI with a clean v4 release

Status: accepted; supersedes [ADR 0001](0001-breeze-ui-v3-clean-break.md).

`@motech-development/breeze-ui` keeps its package identity and replaces its v3 API in place through a v4 major release, with no compatibility exports, migration shims, or legacy implementation constraints. No migration is needed now: the v3 source has no consumers, and the Accounts and ID clients remain pinned to published `2.4.0`; there are no external adopters or API-stability commitments.

The v4 library is rebuilt around the Accounts prototype and design specification to provide consistent primitives and neutral patterns for current and future Motech applications. Domain-specific compositions remain in consuming applications, so the package boundary does not encode Accounts concepts.
