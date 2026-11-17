# ID emails architecture

## Purpose

`@id/emails` holds the HTML bodies of the Auth0 tenant's email templates. [`@id/tenant`](../../tenant/docs/architecture.md) reads them from `build/` and sets them on the tenant. See the [repository architecture](../../../../docs/architecture.md) for where it sits.

## Layout

| Path                         | Auth0 template                                          |
| ---------------------------- | ------------------------------------------------------- |
| `src/verify_email.pug`       | `verify_email`                                          |
| `src/reset_email.pug`        | `reset_email`                                           |
| `src/blocked_account.pug`    | `blocked_account`                                       |
| `src/stolen_credentials.pug` | `stolen_credentials`                                    |
| `src/layout.pug`             | Shared layout; each template fills its `content` block. |
| `src/assets/styles.css`      | Shared styles.                                          |

`pug src --pretty --out build` writes `build/<template>.html`. The file names must match the `body` paths in `tenant.yaml`.

## Templates

The templates use Auth0's Liquid syntax (`syntax: liquid` in `tenant.yaml`), which Auth0 renders when it sends the email; the variables appear unrendered in a local preview. Subjects, senders and link lifetimes are set in `tenant.yaml`, not here.

## Testing

No automated tests. Build and open the HTML in a browser.

## Making changes

- Rebuild, then deploy `@id/tenant`, to publish a change. The tenant deploy also needs `@id/client` built and pre-rendered (see [its Making changes](../../client/docs/architecture.md#making-changes)).
- Adding a template needs a matching `emailTemplates` entry in `tenant.yaml`.
- `@id/tenant` depends on this workspace, so a release of it also redeploys the tenant through the `id-tenant` Deployment Unit.
