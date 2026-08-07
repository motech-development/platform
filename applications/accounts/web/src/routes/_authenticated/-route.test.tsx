import {
  createMemoryHistory,
  createRouter,
  RouterProvider,
} from '@tanstack/react-router';
import { render, screen } from '@testing-library/react';
import type { ReactNode } from 'react';
import { describe, expect, it, vi } from 'vitest';
import type { RouterAuthenticationSnapshot } from '../../auth/router';
import { routeTree } from '../../routeTree.gen';

const mocks = vi.hoisted(() => ({
  loginWithRedirect: vi.fn().mockResolvedValue(undefined),
}));

vi.mock('../../auth/AuthBoundary', () => ({
  AuthBoundary: () => <p>Authentication required</p>,
}));

vi.mock('../../shell/AccountsShell', () => ({
  AccountsShell: ({ children }: Readonly<{ children: ReactNode }>) => (
    <aside aria-label="Accounts shell">{children}</aside>
  ),
}));

vi.mock('../../pwa/registration', () => ({
  registerServiceWorker: vi.fn(),
}));

describe('authenticated route navigation', () => {
  it('preserves a protected deep link while silent authentication starts', async () => {
    const deepLink =
      '/my-companies/accounts/fad22e79-5afe-43a8-9c9c-f93c78c5622f?from=refresh';
    const authentication = {
      isRedirectPending: () => false,
      waitUntilReady: (): Promise<RouterAuthenticationSnapshot> =>
        Promise.resolve({
          isAuthenticated: false,
          loginWithRedirect: mocks.loginWithRedirect,
        }),
      waitUntilSettled: () => Promise.resolve(),
    };
    const router = createRouter({
      context: {
        apolloClient: { query: vi.fn() } as never,
        authentication,
        preloadQuery: vi.fn(),
      },
      history: createMemoryHistory({ initialEntries: [deepLink] }),
      routeTree,
    });

    render(<RouterProvider router={router} />);

    expect(await screen.findByText('Authentication required')).toBeVisible();
    expect(router.state.location.href).toBe(deepLink);
    expect(mocks.loginWithRedirect).toHaveBeenCalledWith({
      appState: { returnTo: deepLink },
      authorizationParams: { prompt: 'none' },
    });
  });
});
