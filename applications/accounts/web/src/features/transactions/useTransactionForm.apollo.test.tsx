import { gql } from '@apollo/client';
import { MockedProvider } from '@apollo/client/testing/react';
import { BreezeProvider } from '@motech-development/breeze-ui';
import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { createAccountsCache } from '../../data/cache';
import { GET_RECORD_TRANSACTION } from '../../data/operations';
import { useTransactionForm } from './useTransactionForm';

vi.mock('@tanstack/react-router', async (importOriginal) => ({
  ...(await importOriginal<typeof import('@tanstack/react-router')>()),
  useBlocker: () => ({ proceed: vi.fn(), reset: vi.fn(), status: 'idle' }),
  useNavigate: () => vi.fn().mockResolvedValue(undefined),
}));

vi.mock('../../pwa/connectivity', () => ({ useOnlineStatus: () => true }));

const seedClients = gql`
  query SeedClients($id: ID!) {
    getClients(id: $id) {
      id
      items {
        id
        name
      }
      nextToken
    }
  }
`;

function ClientOptionsHarness() {
  const { clients, loading } = useTransactionForm({
    companyId: 'company-id',
    confirmedReturnTo: '/my-companies/accounts/$companyId',
  });

  return <p>{loading ? 'Loading clients' : clients.map(({ name }) => name)}</p>;
}

describe('useTransactionForm Apollo integration', () => {
  it('uses fresh form client options instead of the cached management page', async () => {
    const cache = createAccountsCache();

    cache.writeQuery({
      data: {
        getClients: {
          __typename: 'Clients',
          id: 'company-id',
          items: [
            {
              __typename: 'Client',
              id: 'cached-client',
              name: 'Cached client',
            },
          ],
          nextToken: null,
        },
      },
      query: seedClients,
      variables: { id: 'company-id' },
    });

    render(
      <BreezeProvider locale="en-GB">
        <MockedProvider
          cache={cache}
          mocks={[
            {
              request: {
                query: GET_RECORD_TRANSACTION,
                variables: { id: 'company-id' },
              },
              result: {
                data: {
                  getBalance: { currency: 'GBP', id: 'company-id' },
                  getClients: {
                    id: 'company-id',
                    items: [{ id: 'fresh-client', name: 'Fresh client' }],
                  },
                  getSettings: {
                    categories: [],
                    id: 'company-id',
                    vat: { pay: 20 },
                  },
                  getTypeahead: {
                    id: 'company-id',
                    purchases: [],
                    sales: [],
                    suppliers: [],
                  },
                },
              },
            },
          ]}
        >
          <ClientOptionsHarness />
        </MockedProvider>
      </BreezeProvider>,
    );

    expect(await screen.findByText('Fresh client')).toBeVisible();
    expect(screen.queryByText('Cached client')).not.toBeInTheDocument();
  });
});
