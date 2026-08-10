import { BreezeProvider } from '@motech-development/breeze-ui';
import { act, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import type { ReactNode } from 'react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { AuthBoundary } from './AuthBoundary';
import { type AccountsOwnerId, accountsOwnerIdFromAuth0User } from './owner';

const mocks = vi.hoisted(() => ({
  apolloClient: {
    clearStore: vi.fn().mockResolvedValue(undefined),
    refetchQueries: vi.fn().mockResolvedValue(undefined),
  },
  auth: {
    error: undefined as Error | undefined,
    getAccessTokenSilently: vi.fn(),
    isAuthenticated: false,
    isLoading: false,
    loginWithRedirect: vi.fn().mockResolvedValue(undefined),
    user: undefined as
      | {
          email?: string;
          email_verified?: boolean;
          sub: string;
        }
      | undefined,
  },
  location: {
    href: '/my-companies',
    pathname: '/my-companies',
  },
  observability: {
    captureSessionRenewalFailure: vi.fn(),
    setObservabilityUser: vi.fn(),
  },
  router: {
    invalidate: vi.fn().mockResolvedValue(undefined),
  },
  token: {
    beginAccessTokenRenewal: vi.fn(),
    completeAccessTokenRenewal: vi.fn(),
    setAccessTokenProvider: vi.fn(),
  },
}));

vi.mock('@apollo/client/react', async (importOriginal) => ({
  ...(await importOriginal<typeof import('@apollo/client/react')>()),
  useApolloClient: () => mocks.apolloClient,
}));

vi.mock('@auth0/auth0-react', async (importOriginal) => ({
  ...(await importOriginal<typeof import('@auth0/auth0-react')>()),
  useAuth0: () => mocks.auth,
}));

vi.mock('@tanstack/react-router', async (importOriginal) => ({
  ...(await importOriginal<typeof import('@tanstack/react-router')>()),
  useLocation: () => mocks.location,
  useRouter: () => mocks.router,
}));

vi.mock('../observability', () => mocks.observability);
vi.mock('./token', () => mocks.token);

function boundary(
  children: ReactNode = <p>Protected route</p>,
  preparedOwner: AccountsOwnerId | undefined = accountsOwnerIdFromAuth0User(
    mocks.auth.user,
  ),
) {
  const renderProtected = (content: ReactNode, owner?: string) => (
    <div data-owner={owner} data-testid="protected-shell">
      {content}
    </div>
  );

  return (
    <BreezeProvider locale="en-GB">
      <AuthBoundary
        pending={<p>Loading protected route</p>}
        preparedOwner={preparedOwner}
        renderProtected={renderProtected}
      >
        {children}
      </AuthBoundary>
    </BreezeProvider>
  );
}

function renderBoundary(children?: ReactNode, preparedOwner?: AccountsOwnerId) {
  return render(boundary(children, preparedOwner));
}

describe('AuthBoundary', () => {
  beforeEach(() => {
    mocks.auth.error = undefined;
    mocks.auth.isAuthenticated = false;
    mocks.auth.isLoading = false;
    mocks.auth.user = undefined;
    mocks.location.href = '/my-companies';
    mocks.location.pathname = '/my-companies';
    vi.clearAllMocks();
  });

  it('renders an interactive sign-in state outside the protected shell', () => {
    mocks.auth.error = Object.assign(new Error('Consent required'), {
      error: 'consent_required',
    });

    renderBoundary();

    expect(
      screen.getByRole('heading', { level: 1, name: 'Welcome back' }),
    ).toBeInTheDocument();
    expect(screen.getByRole('main')).toHaveAttribute(
      'data-document-background',
      'shell',
    );
    expect(screen.queryByTestId('protected-shell')).not.toBeInTheDocument();
  });

  it('preserves the exact protected deep link for interactive sign-in', async () => {
    const user = userEvent.setup();
    const deepLink =
      '/my-companies/accounts/company-id/record-transaction?from=refresh';

    mocks.auth.error = Object.assign(new Error('Consent required'), {
      error: 'consent_required',
    });
    mocks.location.href = deepLink;
    mocks.location.pathname =
      '/my-companies/accounts/company-id/record-transaction';

    renderBoundary();
    await user.click(screen.getByRole('button', { name: 'Sign in securely' }));

    expect(mocks.auth.loginWithRedirect).toHaveBeenCalledWith({
      appState: { returnTo: deepLink },
    });
  });

  it('keeps the protected shell mounted while authentication is loading', () => {
    mocks.auth.isLoading = true;

    renderBoundary();

    expect(screen.getByTestId('protected-shell')).toContainElement(
      screen.getByText('Loading protected route'),
    );
  });

  it('renders terminal authentication errors inside the protected shell', () => {
    mocks.auth.error = new Error('Authentication failed');

    renderBoundary();

    expect(screen.getByTestId('protected-shell')).toContainElement(
      screen.getByRole('heading', { name: 'Sign-in failed' }),
    );
  });

  it('renders authenticated content once inside the protected shell', async () => {
    mocks.auth.isAuthenticated = true;
    mocks.auth.user = { sub: 'auth0|owner' };

    renderBoundary();

    await waitFor(() => {
      expect(screen.getByText('Protected route')).toBeInTheDocument();
    });
    expect(screen.getAllByTestId('protected-shell')).toHaveLength(1);
    expect(screen.getByTestId('protected-shell')).toContainElement(
      screen.getByText('Protected route'),
    );
  });

  it('hides protected content until the new owner is prepared', async () => {
    const ownerOne = 'auth0|owner-one' as AccountsOwnerId;
    const ownerTwo = 'auth0|owner-two' as AccountsOwnerId;

    mocks.auth.isAuthenticated = true;
    mocks.auth.user = { sub: ownerOne };
    const view = renderBoundary(undefined, ownerOne);

    await screen.findByText('Protected route');

    mocks.auth.user = { sub: ownerTwo };
    view.rerender(boundary(undefined, ownerOne));

    expect(screen.getByTestId('protected-shell')).toContainElement(
      screen.getByText('Loading protected route'),
    );
    expect(screen.getByTestId('protected-shell')).not.toHaveAttribute(
      'data-owner',
    );
    expect(screen.queryByText('Protected route')).not.toBeInTheDocument();

    view.rerender(boundary(undefined, ownerTwo));

    expect(await screen.findByText('Protected route')).toBeInTheDocument();
    expect(screen.getByTestId('protected-shell')).toHaveAttribute(
      'data-owner',
      ownerTwo,
    );
  });

  it('keeps verified owner context aligned with authentication readiness', async () => {
    mocks.auth.isAuthenticated = true;
    mocks.auth.user = {
      email: 'owner@example.com',
      email_verified: true,
      sub: 'auth0|owner',
    };

    const view = renderBoundary();

    await waitFor(() => {
      expect(mocks.observability.setObservabilityUser).toHaveBeenCalledWith(
        'auth0|owner',
        'owner@example.com',
      );
    });

    mocks.auth.isAuthenticated = false;
    view.rerender(boundary());

    await waitFor(() => {
      expect(mocks.observability.setObservabilityUser).toHaveBeenLastCalledWith(
        undefined,
        undefined,
      );
    });
  });

  it('clears identity-owned state before rendering terminal renewal recovery', async () => {
    const failure = new Error('Session renewal failed');

    mocks.auth.getAccessTokenSilently.mockRejectedValueOnce(failure);
    mocks.auth.isAuthenticated = true;
    mocks.auth.user = { sub: 'auth0|owner' };

    renderBoundary();
    await screen.findByText('Protected route');
    act(() => {
      window.dispatchEvent(new Event('offline'));
      window.dispatchEvent(new Event('online'));
    });

    expect(
      await screen.findByRole('heading', { name: 'Sign-in failed' }),
    ).toBeInTheDocument();
    expect(screen.getByTestId('protected-shell')).toContainElement(
      screen.getByRole('button', { name: 'Try signing in again' }),
    );
    expect(screen.getByTestId('protected-shell')).not.toHaveAttribute(
      'data-owner',
    );
    expect(screen.queryByText('Protected route')).not.toBeInTheDocument();
    expect(mocks.apolloClient.clearStore).toHaveBeenCalledOnce();
    expect(mocks.token.setAccessTokenProvider).toHaveBeenLastCalledWith(
      undefined,
    );
    expect(mocks.token.completeAccessTokenRenewal).toHaveBeenCalled();
    expect(
      mocks.observability.captureSessionRenewalFailure,
    ).toHaveBeenCalledExactlyOnceWith(failure);
  });
});
