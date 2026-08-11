import { BreezeProvider } from '@motech-development/breeze-ui';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { ClientsPageContent } from './ClientsPageContent';

interface ClientQueryData {
  getClients: {
    items: Array<Record<string, unknown>>;
    nextToken?: string | null;
    clientLoadedPageCount?: number;
    clientRequestedPageCount?: number;
    clientRefreshGeneration?: number;
  };
}

const mocks = vi.hoisted(() => ({
  navigate: vi.fn(),
  query: {
    data: undefined as ClientQueryData | undefined,
    error: undefined as Error | undefined,
    fetchMore: vi.fn(),
    loading: false,
    networkStatus: 7,
    refetch: vi.fn(),
  },
}));

function refreshedClientPage(
  loadedPageCount: number,
  requestedPageCount: number,
  nextToken: string | null,
): ClientQueryData {
  return {
    getClients: {
      clientLoadedPageCount: loadedPageCount,
      clientRefreshGeneration: 2,
      clientRequestedPageCount: requestedPageCount,
      items: [
        {
          contact: {
            email: 'alpha@example.com',
            telephone: '020 7946 0001',
          },
          id: 'alpha-id',
          name: 'Alpha Limited',
        },
      ],
      nextToken,
    },
  };
}

vi.mock('@apollo/client/react', async (importOriginal) => ({
  ...(await importOriginal<typeof import('@apollo/client/react')>()),
  useQuery: () => mocks.query,
}));

vi.mock('@motech-development/breeze-ui/icons', async (importOriginal) => ({
  ...(await importOriginal<
    typeof import('@motech-development/breeze-ui/icons')
  >()),
  AddIcon: () => <span aria-hidden="true">+</span>,
  UsersIcon: () => <span aria-hidden="true">clients</span>,
  WarningIcon: () => <span aria-hidden="true">warning</span>,
}));

vi.mock('@tanstack/react-router', async (importOriginal) => ({
  ...(await importOriginal<typeof import('@tanstack/react-router')>()),
  useNavigate: () => mocks.navigate,
}));

describe('ClientsPageContent', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.navigate.mockResolvedValue(undefined);
    mocks.query.data = { getClients: { items: [] } };
    mocks.query.error = undefined;
    mocks.query.fetchMore.mockResolvedValue(undefined);
    mocks.query.loading = false;
    mocks.query.networkStatus = 7;
    mocks.query.refetch.mockResolvedValue(undefined);
  });

  it('shows one add-client action in the empty state', async () => {
    const user = userEvent.setup();

    render(
      <BreezeProvider locale="en-GB">
        <ClientsPageContent companyId="company-id" />
      </BreezeProvider>,
    );

    expect(screen.getByText('No clients yet')).toBeInTheDocument();
    expect(
      screen.getAllByRole('button', { name: 'Add a new client' }),
    ).toHaveLength(1);
    await user.click(screen.getByRole('button', { name: 'Add a new client' }));
    expect(mocks.navigate).toHaveBeenCalledWith({
      params: { companyId: 'company-id' },
      to: '/my-companies/clients/$companyId/add-client',
    });
  });

  it('lists clients in name order and opens the selected client', async () => {
    const user = userEvent.setup();
    mocks.query.data = {
      getClients: {
        items: [
          {
            contact: {
              email: 'zulu@example.com',
              telephone: '020 7946 0002',
            },
            id: 'zulu-id',
            name: 'Zulu Limited',
          },
          {
            contact: {
              email: 'alpha@example.com',
              telephone: '020 7946 0001',
            },
            id: 'alpha-id',
            name: 'Alpha Limited',
          },
        ],
      },
    };

    render(
      <BreezeProvider locale="en-GB">
        <ClientsPageContent companyId="company-id" />
      </BreezeProvider>,
    );

    expect(
      screen.getAllByTestId(/Limited$/).map(({ dataset }) => dataset.testid),
    ).toEqual(['Alpha Limited', 'Zulu Limited']);
    expect(
      screen.getAllByRole('button', { name: 'Add a new client' }),
    ).toHaveLength(1);

    await user.click(screen.getByTestId('Alpha Limited'));
    expect(mocks.navigate).toHaveBeenCalledWith({
      params: { clientId: 'alpha-id', companyId: 'company-id' },
      to: '/my-companies/clients/$companyId/update-details/$clientId',
    });
  });

  it('loads the next page of clients', async () => {
    const user = userEvent.setup();
    const firstPage: ClientQueryData = {
      getClients: {
        items: [
          {
            contact: {
              email: 'alpha@example.com',
              telephone: '020 7946 0001',
            },
            id: 'alpha-id',
            name: 'Alpha Limited',
          },
        ],
        nextToken: 'next-page',
      },
    };
    const secondPage: ClientQueryData = {
      getClients: {
        items: [
          {
            contact: {
              email: 'alpha@example.com',
              telephone: '020 7946 0001',
            },
            id: 'alpha-id',
            name: 'Alpha Limited',
          },
          {
            contact: {
              email: 'beta@example.com',
              telephone: '020 7946 0002',
            },
            id: 'beta-id',
            name: 'Beta Limited',
          },
        ],
        nextToken: null,
      },
    };
    mocks.query.data = firstPage;
    mocks.query.fetchMore.mockImplementationOnce(() => {
      mocks.query.data = secondPage;

      return Promise.resolve(undefined);
    });

    const view = render(
      <BreezeProvider locale="en-GB">
        <ClientsPageContent companyId="company-id" />
      </BreezeProvider>,
    );

    await user.click(screen.getByRole('button', { name: 'Load more' }));
    expect(mocks.query.fetchMore).toHaveBeenCalledWith({
      variables: { nextToken: 'next-page' },
    });
    view.rerender(
      <BreezeProvider locale="en-GB">
        <ClientsPageContent companyId="company-id" />
      </BreezeProvider>,
    );

    expect(screen.getAllByTestId('Alpha Limited')).toHaveLength(1);
    expect(screen.getByTestId('Beta Limited')).toBeVisible();
  });

  it('rebuilds an exhausted multi-page span with each refreshed token once', async () => {
    mocks.query.data = refreshedClientPage(1, 3, 'refreshed-page-2');
    mocks.query.fetchMore
      .mockImplementationOnce(() => {
        mocks.query.data = refreshedClientPage(2, 3, 'refreshed-page-3');

        return Promise.resolve(undefined);
      })
      .mockImplementationOnce(() => {
        mocks.query.data = refreshedClientPage(3, 3, null);

        return Promise.resolve(undefined);
      });

    const view = render(
      <BreezeProvider locale="en-GB">
        <ClientsPageContent companyId="company-id" />
      </BreezeProvider>,
    );

    await waitFor(() =>
      expect(mocks.query.fetchMore).toHaveBeenNthCalledWith(1, {
        variables: { nextToken: 'refreshed-page-2' },
      }),
    );
    view.rerender(
      <BreezeProvider locale="en-GB">
        <ClientsPageContent companyId="company-id" />
      </BreezeProvider>,
    );

    await waitFor(() =>
      expect(mocks.query.fetchMore).toHaveBeenNthCalledWith(2, {
        variables: { nextToken: 'refreshed-page-3' },
      }),
    );
    expect(mocks.query.fetchMore).toHaveBeenCalledTimes(2);
  });

  it('stops automatic reconciliation when a continuation token repeats', async () => {
    mocks.query.data = refreshedClientPage(1, 4, 'refreshed-page-a');
    mocks.query.fetchMore
      .mockImplementationOnce(() => {
        mocks.query.data = refreshedClientPage(2, 4, 'refreshed-page-b');

        return Promise.resolve(undefined);
      })
      .mockImplementationOnce(() => {
        mocks.query.data = refreshedClientPage(3, 4, 'refreshed-page-a');

        return Promise.resolve(undefined);
      });

    const view = render(
      <BreezeProvider locale="en-GB">
        <ClientsPageContent companyId="company-id" />
      </BreezeProvider>,
    );

    await waitFor(() => expect(mocks.query.fetchMore).toHaveBeenCalledOnce());
    view.rerender(
      <BreezeProvider locale="en-GB">
        <ClientsPageContent companyId="company-id" />
      </BreezeProvider>,
    );
    await waitFor(() => expect(mocks.query.fetchMore).toHaveBeenCalledTimes(2));
    view.rerender(
      <BreezeProvider locale="en-GB">
        <ClientsPageContent companyId="company-id" />
      </BreezeProvider>,
    );

    await waitFor(() => expect(mocks.query.fetchMore).toHaveBeenCalledTimes(2));
    expect(mocks.query.fetchMore).toHaveBeenNthCalledWith(1, {
      variables: { nextToken: 'refreshed-page-a' },
    });
    expect(mocks.query.fetchMore).toHaveBeenNthCalledWith(2, {
      variables: { nextToken: 'refreshed-page-b' },
    });
  });

  it('does not automatically retry a failed token in the same refresh', async () => {
    mocks.query.data = refreshedClientPage(1, 2, 'refreshed-page-2');
    mocks.query.fetchMore.mockRejectedValue(new Error('Page unavailable'));

    const view = render(
      <BreezeProvider locale="en-GB">
        <ClientsPageContent companyId="company-id" />
      </BreezeProvider>,
    );

    await waitFor(() => expect(mocks.query.fetchMore).toHaveBeenCalledOnce());
    mocks.query.networkStatus = 3;
    view.rerender(
      <BreezeProvider locale="en-GB">
        <ClientsPageContent companyId="company-id" />
      </BreezeProvider>,
    );
    mocks.query.networkStatus = 7;
    view.rerender(
      <BreezeProvider locale="en-GB">
        <ClientsPageContent companyId="company-id" />
      </BreezeProvider>,
    );

    await waitFor(() => expect(mocks.query.fetchMore).toHaveBeenCalledOnce());
  });

  it('keeps client creation available while the first query runs', async () => {
    const user = userEvent.setup();
    mocks.query.data = undefined;
    mocks.query.loading = true;

    render(
      <BreezeProvider locale="en-GB">
        <ClientsPageContent companyId="company-id" />
      </BreezeProvider>,
    );

    expect(
      screen.getByRole('status', { name: 'Loading clients' }),
    ).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Add a new client' }));
    expect(mocks.navigate).toHaveBeenCalledWith({
      params: { companyId: 'company-id' },
      to: '/my-companies/clients/$companyId/add-client',
    });
    expect(screen.queryByText('No clients yet')).not.toBeInTheDocument();
  });

  it('offers retry without showing an empty action after a query failure', async () => {
    const user = userEvent.setup();
    mocks.query.data = undefined;
    mocks.query.error = new Error('Clients unavailable');

    render(
      <BreezeProvider locale="en-GB">
        <ClientsPageContent companyId="company-id" />
      </BreezeProvider>,
    );

    expect(screen.getByText('We could not load clients')).toBeVisible();
    expect(screen.queryByText('No clients yet')).not.toBeInTheDocument();
    expect(
      screen.queryByRole('button', { name: 'Add a new client' }),
    ).not.toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Try again' }));
    expect(mocks.query.refetch).toHaveBeenCalledOnce();
  });

  it('preserves cached clients with a compact retry after refresh fails', async () => {
    const user = userEvent.setup();
    mocks.query.data = {
      getClients: {
        items: [
          {
            contact: {
              email: 'client@example.com',
              telephone: '020 7946 0001',
            },
            id: 'client-id',
            name: 'Example Client',
          },
        ],
      },
    };
    mocks.query.error = new Error('Refresh unavailable');

    render(
      <BreezeProvider locale="en-GB">
        <ClientsPageContent companyId="company-id" />
      </BreezeProvider>,
    );

    expect(screen.getByTestId('Example Client')).toBeVisible();
    expect(screen.queryByText('We could not load clients')).toBeNull();
    expect(screen.getByText(/Clients could not be refreshed/)).toBeVisible();
    await user.click(screen.getByRole('button', { name: 'Try again' }));
    expect(mocks.query.refetch).toHaveBeenCalledOnce();
  });
});
