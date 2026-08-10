import { BreezeProvider } from '@motech-development/breeze-ui';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { ClientsPageContent } from './ClientsPageContent';

interface ClientQueryData {
  getClients: { items: Array<Record<string, unknown>> };
}

const mocks = vi.hoisted(() => ({
  navigate: vi.fn(),
  query: {
    data: undefined as ClientQueryData | undefined,
    error: undefined as Error | undefined,
    loading: false,
    refetch: vi.fn(),
  },
}));

vi.mock('@apollo/client/react', async (importOriginal) => ({
  ...(await importOriginal<typeof import('@apollo/client/react')>()),
  useQuery: () => mocks.query,
}));

vi.mock('@motech-development/breeze-ui/icons', () => ({
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
    mocks.query.loading = false;
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

  it('renders the complete loading composition while the first query runs', () => {
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
    expect(
      screen.queryByRole('button', { name: 'Add a new client' }),
    ).not.toBeInTheDocument();
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
