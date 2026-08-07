import { act, render, waitFor } from '@testing-library/react';
import type { ReactNode } from 'react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { AccountsWebConfig } from '../config';
import {
  createAccountsAuthenticationProvider,
  createRouterAuthentication,
} from './router';

const mocks = vi.hoisted(() => ({
  apolloClient: {
    clearStore: vi.fn().mockResolvedValue(undefined),
  },
  auth: {
    error: undefined as Error | undefined,
    getAccessTokenSilently: vi.fn(),
    isAuthenticated: true,
    isLoading: false,
    loginWithRedirect: vi.fn().mockResolvedValue(undefined),
    user: { sub: 'auth0|owner-one' },
  },
  redirectAppState: undefined as { returnTo: string } | undefined,
  router: {
    invalidate: vi.fn().mockResolvedValue(undefined),
    navigate: vi.fn().mockResolvedValue(undefined),
  },
  setAccessTokenProvider: vi.fn(),
}));

vi.mock('@auth0/auth0-react', async (importOriginal) => ({
  ...(await importOriginal<typeof import('@auth0/auth0-react')>()),
  Auth0Provider: ({
    children,
    onRedirectCallback,
  }: Readonly<{
    children: ReactNode;
    onRedirectCallback?: (appState?: { returnTo: string }) => void;
  }>) => {
    if (mocks.redirectAppState) {
      const appState = mocks.redirectAppState;

      mocks.redirectAppState = undefined;
      onRedirectCallback?.(appState);
    }

    return children;
  },
  useAuth0: () => mocks.auth,
}));

vi.mock('./token', () => ({
  setAccessTokenProvider: mocks.setAccessTokenProvider,
}));

const config: AccountsWebConfig = {
  appsyncUrl: 'https://appsync.example/graphql',
  auth0Audience: 'https://api.example',
  auth0ClientId: 'client-id',
  auth0Domain: 'identity.example',
  commitSha: '0123456789012345678901234567890123456789',
  region: 'eu-west-1',
  stage: 'local',
};

describe('router authentication', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.apolloClient.clearStore.mockResolvedValue(undefined);
    mocks.auth.error = undefined;
    mocks.auth.isAuthenticated = true;
    mocks.auth.isLoading = false;
    mocks.auth.user = { sub: 'auth0|owner-one' };
    mocks.redirectAppState = undefined;
  });

  it('publishes a new owner only after identity-owned state is cleared', async () => {
    const authentication = createRouterAuthentication();
    const Provider = createAccountsAuthenticationProvider({
      apolloClient: mocks.apolloClient as never,
      authentication,
      config,
      router: mocks.router as never,
    });
    const view = render(
      <Provider>
        <p>Router content</p>
      </Provider>,
    );

    await expect(authentication.waitUntilReady()).resolves.toEqual(
      expect.objectContaining({ ownerId: 'auth0|owner-one' }),
    );
    expect(mocks.apolloClient.clearStore).toHaveBeenCalledOnce();

    let finishClearing: () => void = () => undefined;
    const clearing = new Promise<void>((resolve) => {
      finishClearing = resolve;
    });

    mocks.apolloClient.clearStore.mockReturnValueOnce(clearing);
    mocks.auth.user = { sub: 'auth0|owner-two' };
    view.rerender(
      <Provider>
        <p>Router content</p>
      </Provider>,
    );

    await waitFor(() => {
      expect(mocks.apolloClient.clearStore).toHaveBeenCalledTimes(2);
    });
    await expect(authentication.waitUntilReady()).resolves.toEqual(
      expect.objectContaining({ ownerId: 'auth0|owner-one' }),
    );
    expect(mocks.router.invalidate).not.toHaveBeenCalled();

    await act(async () => {
      finishClearing();
      await clearing;
    });
    await waitFor(() => {
      expect(mocks.router.invalidate).toHaveBeenCalledOnce();
    });
    await expect(authentication.waitUntilReady()).resolves.toEqual(
      expect.objectContaining({ ownerId: 'auth0|owner-two' }),
    );
  });

  it('settles a callback only after its destination route finishes loading', async () => {
    let finishNavigation: () => void = () => undefined;
    const navigation = new Promise<void>((resolve) => {
      finishNavigation = resolve;
    });

    mocks.redirectAppState = {
      returnTo: '/my-companies',
    };
    mocks.router.navigate.mockReturnValueOnce(navigation);

    const authentication = createRouterAuthentication();
    const Provider = createAccountsAuthenticationProvider({
      apolloClient: mocks.apolloClient as never,
      authentication,
      config,
      router: mocks.router as never,
    });
    let settled = false;
    const settlement = authentication.waitUntilSettled().then(() => {
      settled = true;
    });

    render(
      <Provider>
        <p>Router content</p>
      </Provider>,
    );

    await expect(authentication.waitUntilReady()).resolves.toEqual(
      expect.objectContaining({ ownerId: 'auth0|owner-one' }),
    );
    await waitFor(() => {
      expect(mocks.router.navigate).toHaveBeenCalledWith({
        href: '/my-companies',
        replace: true,
      });
    });
    expect(settled).toBe(false);

    await act(async () => {
      finishNavigation();
      await navigation;
      await settlement;
    });

    expect(settled).toBe(true);
  });

  it('keeps the initial load covered after a login redirect starts', async () => {
    const authentication = createRouterAuthentication();
    const Provider = createAccountsAuthenticationProvider({
      apolloClient: mocks.apolloClient as never,
      authentication,
      config,
      router: mocks.router as never,
    });

    render(
      <Provider>
        <p>Router content</p>
      </Provider>,
    );

    const snapshot = await authentication.waitUntilReady();

    expect(authentication.isRedirectPending()).toBe(false);

    await snapshot.loginWithRedirect({
      appState: { returnTo: '/my-companies' },
      authorizationParams: { prompt: 'none' },
    });

    expect(authentication.isRedirectPending()).toBe(true);
  });
});
