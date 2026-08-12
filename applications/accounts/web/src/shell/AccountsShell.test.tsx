import { BreezeProvider } from '@motech-development/breeze-ui';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { AccountsOwnerId } from '../auth/owner';
import { AccountsShell } from './AccountsShell';

const mocks = vi.hoisted(() => ({
  auth: {
    logout: vi.fn().mockResolvedValue(undefined),
    user: { name: 'Morgan Green' },
  },
  captureSignOutFailure: vi.fn(),
  clearStore: vi.fn().mockResolvedValue([]),
  location: {
    pathname: '/my-companies/accounts/7c22bba3-8036-4fa8-aae1-4611f1651e17',
  },
  markNotificationsRead: vi.fn().mockResolvedValue(undefined),
  navigate: vi.fn().mockResolvedValue(undefined),
  restartOwnerNotifications: vi.fn(),
  subscribeToOwnerNotifications: vi.fn<(owner: string) => () => void>(() =>
    vi.fn(),
  ),
}));

vi.mock('@apollo/client/react', async (importOriginal) => {
  const original =
    await importOriginal<typeof import('@apollo/client/react')>();
  const { useEffect } = await import('react');
  const { GET_NOTIFICATIONS } = await import('../data/operations');

  return {
    ...original,
    useApolloClient: () => ({ clearStore: mocks.clearStore }),
    useMutation: () => [mocks.markNotificationsRead, { loading: false }],
    useQuery: (
      query: unknown,
      options?: { variables?: { count?: number; id?: string } },
    ) =>
      query === GET_NOTIFICATIONS
        ? {
            data: {
              getNotifications: {
                id: options?.variables?.id,
                items: [],
              },
            },
            error: undefined,
            loading: false,
            previousData: undefined,
            refetch: vi.fn().mockResolvedValue(undefined),
          }
        : { data: undefined, error: undefined, loading: false },
    useSubscription: (
      _query: unknown,
      options?: { variables?: { owner?: string } },
    ) => {
      const owner = options?.variables?.owner;

      useEffect(
        () => (owner ? mocks.subscribeToOwnerNotifications(owner) : undefined),
        [owner],
      );

      return {
        error: undefined,
        loading: false,
        restart: mocks.restartOwnerNotifications,
      };
    },
  };
});

vi.mock('@auth0/auth0-react', async (importOriginal) => ({
  ...(await importOriginal<typeof import('@auth0/auth0-react')>()),
  useAuth0: () => mocks.auth,
}));

vi.mock('@motech-development/breeze-ui/icons', async (importOriginal) => ({
  ...(await importOriginal<
    typeof import('@motech-development/breeze-ui/icons')
  >()),
  BuildingIcon: () => <svg aria-hidden="true" />,
  ChartIcon: () => <svg aria-hidden="true" />,
  SettingsIcon: () => <svg aria-hidden="true" />,
  UsersIcon: () => <svg aria-hidden="true" />,
  WalletIcon: () => <svg aria-hidden="true" />,
}));

vi.mock('@tanstack/react-router', async (importOriginal) => ({
  ...(await importOriginal<typeof import('@tanstack/react-router')>()),
  useLocation: () => mocks.location,
  useNavigate: () => mocks.navigate,
}));

vi.mock('../observability', () => ({
  captureSignOutFailure: mocks.captureSignOutFailure,
  setObservabilityCompany: vi.fn(),
}));

describe('AccountsShell', () => {
  beforeEach(() => {
    mocks.auth.logout.mockReset().mockResolvedValue(undefined);
    mocks.clearStore.mockReset().mockResolvedValue([]);
    mocks.captureSignOutFailure.mockReset();
    mocks.location.pathname =
      '/my-companies/accounts/7c22bba3-8036-4fa8-aae1-4611f1651e17';
    mocks.navigate.mockReset().mockResolvedValue(undefined);
    mocks.markNotificationsRead.mockReset().mockResolvedValue(undefined);
    mocks.restartOwnerNotifications.mockReset();
    mocks.subscribeToOwnerNotifications.mockReset();
    mocks.subscribeToOwnerNotifications.mockReturnValue(vi.fn());
  });

  it('hides company navigation when no company is selected', () => {
    mocks.location.pathname = '/my-companies';

    render(
      <BreezeProvider locale="en-GB">
        <AccountsShell authenticatedOwner={'auth0|owner' as AccountsOwnerId}>
          <p>Company collection</p>
        </AccountsShell>
      </BreezeProvider>,
    );

    expect(
      screen.queryByRole('navigation', { name: 'Accounts navigation' }),
    ).not.toBeInTheDocument();
    expect(screen.getByText('Company collection')).toBeInTheDocument();
  });

  it('shows delivered company navigation and keeps unfinished capabilities hidden', () => {
    render(
      <BreezeProvider locale="en-GB">
        <AccountsShell authenticatedOwner={'auth0|owner' as AccountsOwnerId}>
          <p>Private account data</p>
        </AccountsShell>
      </BreezeProvider>,
    );

    expect(
      screen.getAllByRole('link', {
        name: /Company details.*Manage company details/,
      })[0],
    ).toHaveAttribute(
      'href',
      '/my-companies/update-details/7c22bba3-8036-4fa8-aae1-4611f1651e17',
    );
    expect(
      screen.getAllByRole('link', { name: /Settings.*Manage settings/ })[0],
    ).toHaveAttribute(
      'href',
      '/my-companies/settings/7c22bba3-8036-4fa8-aae1-4611f1651e17',
    );
    expect(
      screen.getAllByRole('link', { name: /Clients.*Manage clients/ })[0],
    ).toHaveAttribute(
      'href',
      '/my-companies/clients/7c22bba3-8036-4fa8-aae1-4611f1651e17',
    );
    expect(
      screen.queryByRole('link', { name: /reports/i }),
    ).not.toBeInTheDocument();
    expect(
      screen.getAllByRole('button', {
        name: 'Notifications (0 unread)',
      }),
    ).toHaveLength(2);
    expect(mocks.subscribeToOwnerNotifications).toHaveBeenCalledExactlyOnceWith(
      'auth0|owner',
    );
  });

  it('hides protected content and logs out when cache cleanup fails', async () => {
    const user = userEvent.setup();
    const unsubscribeOwnerNotifications = vi.fn();

    mocks.subscribeToOwnerNotifications.mockReturnValue(
      unsubscribeOwnerNotifications,
    );
    mocks.clearStore.mockRejectedValueOnce(new Error('Cache cleanup failed'));
    render(
      <BreezeProvider locale="en-GB">
        <AccountsShell authenticatedOwner={'auth0|owner' as AccountsOwnerId}>
          <p>Private account data</p>
        </AccountsShell>
      </BreezeProvider>,
    );

    await user.click(
      screen.getAllByRole('button', {
        name: 'Notifications (0 unread)',
      })[0],
    );
    await user.click(screen.getByRole('menuitem', { name: 'Sign out' }));

    expect(screen.queryByText('Private account data')).not.toBeInTheDocument();
    expect(screen.getByText('Signing out')).toBeVisible();
    expect(unsubscribeOwnerNotifications).toHaveBeenCalledOnce();
    expect(
      screen.queryByRole('navigation', { name: 'Accounts navigation' }),
    ).not.toBeInTheDocument();
    await waitFor(() => {
      expect(mocks.auth.logout).toHaveBeenCalledWith({
        logoutParams: { returnTo: window.location.origin },
      });
    });
  });

  it('reports a failed sign-out redirect', async () => {
    const user = userEvent.setup();
    const signOutError = new Error('Sign-out redirect failed');
    mocks.auth.logout.mockRejectedValueOnce(signOutError);
    render(
      <BreezeProvider locale="en-GB">
        <AccountsShell authenticatedOwner={'auth0|owner' as AccountsOwnerId}>
          <p>Private account data</p>
        </AccountsShell>
      </BreezeProvider>,
    );

    await user.click(
      screen.getAllByRole('button', {
        name: 'Notifications (0 unread)',
      })[0],
    );
    await user.click(screen.getByRole('menuitem', { name: 'Sign out' }));

    await waitFor(() => {
      expect(mocks.captureSignOutFailure).toHaveBeenCalledExactlyOnceWith(
        signOutError,
      );
    });
  });

  it('replaces owner notification state when the authenticated identity changes', () => {
    const firstOwner = 'auth0|first-owner' as AccountsOwnerId;
    const secondOwner = 'auth0|second-owner' as AccountsOwnerId;
    const shell = (authenticatedOwner: AccountsOwnerId) => (
      <BreezeProvider locale="en-GB">
        <AccountsShell authenticatedOwner={authenticatedOwner}>
          <p>Private account data</p>
        </AccountsShell>
      </BreezeProvider>
    );
    const unsubscribeFirstOwner = vi.fn();
    const unsubscribeSecondOwner = vi.fn();
    mocks.subscribeToOwnerNotifications
      .mockReturnValueOnce(unsubscribeFirstOwner)
      .mockReturnValueOnce(unsubscribeSecondOwner);
    const view = render(shell(firstOwner));

    view.rerender(shell(secondOwner));

    expect(unsubscribeFirstOwner).toHaveBeenCalledOnce();
    expect(mocks.subscribeToOwnerNotifications).toHaveBeenNthCalledWith(
      2,
      secondOwner,
    );
    expect(unsubscribeSecondOwner).not.toHaveBeenCalled();
  });
});
