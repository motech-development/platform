# Platform Delivery

The environments through which changes to the platform are validated and delivered.

## Language

**Develop Environment**:
The long-lived, non-production environment whose Deployment Units use the same Releases as their production counterparts. Its configuration, data, and topology may differ from production, and it provides shared development services that Preview Environments may consume without modifying.
_Avoid_: Development environment, dev environment

**Preview Environment**:
A temporary environment for one pull request whose mutable application resources are isolated from other previews. It may consume shared services from the Develop Environment.
_Avoid_: PR environment, ephemeral environment

**Deployment Unit**:
A part of the platform that can be delivered to an environment independently.
_Avoid_: Deployable, service

**Affected Deployment Unit**:
A Deployment Unit that changed directly or whose delivered behaviour can change because one of its dependencies changed.
_Avoid_: Changed application, touched service

**Release**:
A versioned application or package published from the main branch. A Release makes a version available but does not deliver it to an environment.
_Avoid_: Deployment

**Release Plan**:
The set of Affected Deployment Units and their exact Release tags authorized for delivery from one accepted change. The plan exists only after every related Release succeeds.
_Avoid_: Change set, deploy list

**Environment State**:
The last successfully delivered Release tag recorded as a successful GitHub Deployment for each Deployment Unit and long-lived environment. It is used to reconcile a newer Release Plan with work that failed or was superseded while waiting.
_Avoid_: Deployment cache, latest release

**Preview State**:
The last successfully delivered pull-request commit for each Deployment Unit in a Preview Environment. It is used to reconcile the pull request's current state with work that failed, was skipped, or was superseded while waiting.
_Avoid_: Preview cache, previous head

**Preview Validation State**:
The latest pull-request commit whose changes were successfully validated against its Preview Environment or established not to require runtime validation. Failed or cancelled validation does not advance this state.
_Avoid_: Playwright cache, latest tested commit

**Preview Plan**:
The set of Deployment Units required to reconcile a Preview Environment with the pull request's current state. Creation includes the full preview topology; later plans compare each unit with its Preview State and include affected, missing, and dependant units.
_Avoid_: Release Plan, preview change set

**Deployment Catalog**:
The authoritative inventory of Deployment Units, the environments they support, and their delivery-specific dependencies. It excludes dependencies already expressed by the workspaces themselves.
_Avoid_: Deployment config, service registry
