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
import { useFormNavigation } from './useFormNavigation';

function PendingMutation() {
  const [pending, setPending] = useState(false);
  const navigate = useNavigate();
  const navigation = useFormNavigation({
    blockPendingNavigation: pending,
    onClose: () =>
      navigate({
        params: { companyId: 'old-company' },
        to: '/my-companies/clients/$companyId',
      }),
    pending,
  });

  return (
    <main>
      <h1>Edit form</h1>
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
        Leave form
      </button>
      <button
        onClick={() => {
          navigation.completeMutation({ resumeBlockedNavigation: true });
          setPending(false);
        }}
        type="button"
      >
        Finish saving
      </button>
    </main>
  );
}

describe('useFormNavigation', () => {
  afterEach(() => vi.restoreAllMocks());

  it('resumes blocked navigation after a pending mutation succeeds', async () => {
    const user = userEvent.setup();
    vi.spyOn(window, 'scrollTo').mockImplementation(() => undefined);
    const rootRoute = createRootRoute({ component: Outlet });
    const editRoute = createRoute({
      component: PendingMutation,
      getParentRoute: () => rootRoute,
      path: '/edit',
    });
    const destinationRoute = createRoute({
      component: () => <h1>Destination</h1>,
      getParentRoute: () => rootRoute,
      path: '/my-companies/clients/$companyId',
    });
    const router = createRouter({
      history: createMemoryHistory({ initialEntries: ['/edit'] }),
      routeTree: rootRoute.addChildren([editRoute, destinationRoute]),
    });

    render(<RouterProvider router={router} />);

    await user.click(
      await screen.findByRole('button', { name: 'Start saving' }),
    );
    await user.click(screen.getByRole('button', { name: 'Leave form' }));

    expect(router.state.location.pathname).toBe('/edit');
    expect(screen.getByRole('heading', { name: 'Edit form' })).toBeVisible();

    await user.click(screen.getByRole('button', { name: 'Finish saving' }));

    await waitFor(() =>
      expect(router.state.location.pathname).toBe(
        '/my-companies/clients/new-company',
      ),
    );
    expect(screen.getByRole('heading', { name: 'Destination' })).toBeVisible();
  });
});
