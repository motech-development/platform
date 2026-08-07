import { createFileRoute, Outlet } from '@tanstack/react-router';
import { AuthBoundary } from '../../auth/AuthBoundary';
import { AccountsShell } from '../../shell/AccountsShell';
import { AccountsPending, RouteNotFound } from '../-RouteState';

function AuthenticatedPendingLayout() {
  return (
    <AccountsShell>
      <AccountsPending />
    </AccountsShell>
  );
}

function AuthenticatedLayout() {
  const { authenticatedOwner } = Route.useRouteContext();

  return (
    <AuthBoundary
      pending={<AccountsPending />}
      preparedOwner={authenticatedOwner}
      renderProtected={(content, owner) => (
        <AccountsShell authenticatedOwner={owner}>{content}</AccountsShell>
      )}
    >
      <Outlet />
    </AuthBoundary>
  );
}

export const Route = createFileRoute('/_authenticated')({
  beforeLoad: async ({ context, location }) => {
    const authentication = await context.authentication.waitUntilReady();

    if (authentication.preparationError) {
      throw authentication.preparationError;
    }

    if (
      authentication.error ||
      !authentication.isAuthenticated ||
      !authentication.ownerId
    ) {
      if (!authentication.error && !authentication.isAuthenticated) {
        await authentication.loginWithRedirect({
          appState: { returnTo: location.href },
          authorizationParams: { prompt: 'none' },
        });
      }

      return {
        authenticatedOwner: undefined,
      };
    }

    return {
      authenticatedOwner: authentication.ownerId,
    };
  },
  component: AuthenticatedLayout,
  notFoundComponent: RouteNotFound,
  pendingComponent: AuthenticatedPendingLayout,
});
