import {
  createMemoryHistory,
  createRootRoute,
  createRoute,
  createRouter,
  Outlet,
  RouterProvider,
  useNavigate,
} from '@tanstack/react-router';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useState } from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { useClientDrawerNavigation } from './useClientDrawerNavigation';

function PendingClientMutation() {
  const [pending, setPending] = useState(false);
  const navigate = useNavigate();
  const navigation = useClientDrawerNavigation({
    companyId: 'old-company',
    pending,
  });

  return (
    <main>
      <h1>Edit client</h1>
      <button onClick={() => setPending(true)} type="button">
        Start saving
      </button>
      <button
        onClick={() => {
          navigate({
            params: { companyId: 'new-company' },
            to: '/my-companies/clients/$companyId',
          }).catch(() => undefined);
        }}
        type="button"
      >
        Switch company
      </button>
      <button
        onClick={() => {
          navigation.completeMutation();
          setPending(false);
        }}
        type="button"
      >
        Finish saving
      </button>
    </main>
  );
}

describe('useClientDrawerNavigation', () => {
  afterEach(() => vi.restoreAllMocks());

  it('resumes a company switch after a pending mutation succeeds', async () => {
    const user = userEvent.setup();
    vi.spyOn(window, 'scrollTo').mockImplementation(() => undefined);
    const rootRoute = createRootRoute({ component: Outlet });
    const editRoute = createRoute({
      component: PendingClientMutation,
      getParentRoute: () => rootRoute,
      path: '/edit-client',
    });
    const clientsRoute = createRoute({
      component: () => <h1>New company clients</h1>,
      getParentRoute: () => rootRoute,
      path: '/my-companies/clients/$companyId',
    });
    const router = createRouter({
      history: createMemoryHistory({ initialEntries: ['/edit-client'] }),
      routeTree: rootRoute.addChildren([editRoute, clientsRoute]),
    });

    render(<RouterProvider router={router} />);

    await user.click(
      await screen.findByRole('button', { name: 'Start saving' }),
    );
    await user.click(screen.getByRole('button', { name: 'Switch company' }));

    expect(router.state.location.pathname).toBe('/edit-client');
    expect(screen.getByRole('heading', { name: 'Edit client' })).toBeVisible();

    await user.click(screen.getByRole('button', { name: 'Finish saving' }));

    await waitFor(() =>
      expect(router.state.location.pathname).toBe(
        '/my-companies/clients/new-company',
      ),
    );
    expect(
      screen.getByRole('heading', { name: 'New company clients' }),
    ).toBeVisible();
  });
});
