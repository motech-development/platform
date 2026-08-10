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
  clearStore: vi.fn().mockResolvedValue([]),
  location: {
    pathname: '/my-companies/accounts/7c22bba3-8036-4fa8-aae1-4611f1651e17',
  },
  navigate: vi.fn().mockResolvedValue(undefined),
}));

vi.mock('@apollo/client/react', async (importOriginal) => ({
  ...(await importOriginal<typeof import('@apollo/client/react')>()),
  useApolloClient: () => ({ clearStore: mocks.clearStore }),
  useQuery: () => ({ data: undefined }),
}));

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
  setObservabilityCompany: vi.fn(),
}));

describe('AccountsShell', () => {
  beforeEach(() => {
    mocks.auth.logout.mockReset().mockResolvedValue(undefined);
    mocks.clearStore.mockReset().mockResolvedValue([]);
    mocks.location.pathname =
      '/my-companies/accounts/7c22bba3-8036-4fa8-aae1-4611f1651e17';
    mocks.navigate.mockReset().mockResolvedValue(undefined);
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
  });

  it('hides protected content and logs out when cache cleanup fails', async () => {
    const user = userEvent.setup();

    mocks.clearStore.mockRejectedValueOnce(new Error('Cache cleanup failed'));
    render(
      <BreezeProvider locale="en-GB">
        <AccountsShell authenticatedOwner={'auth0|owner' as AccountsOwnerId}>
          <p>Private account data</p>
        </AccountsShell>
      </BreezeProvider>,
    );

    await user.click(
      screen.getAllByRole('button', { name: 'Account menu' })[0],
    );
    await user.click(screen.getByRole('menuitem', { name: 'Sign out' }));

    expect(screen.queryByText('Private account data')).not.toBeInTheDocument();
    expect(screen.getByText('Signing out')).toBeVisible();
    expect(
      screen.queryByRole('navigation', { name: 'Accounts navigation' }),
    ).not.toBeInTheDocument();
    await waitFor(() => {
      expect(mocks.auth.logout).toHaveBeenCalledWith({
        logoutParams: { returnTo: window.location.origin },
      });
    });
  });
});
