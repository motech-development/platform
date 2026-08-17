import type { ApolloClient } from '@apollo/client';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { AccountsOwnerId } from '../auth/owner';
import type { AuthenticatedAccountsRouterContext } from '../auth/router';
import {
  primeClient,
  primeClients,
  primeCompanies,
  primeCompanyDetails,
  primeCompanySettings,
  primeDashboard,
  primePendingTransactions,
  primeTransaction,
  primeTransactions,
  verifyRecordTransactionRoute,
} from './loaders';
import {
  GET_CLIENT,
  GET_CLIENTS,
  GET_COMPANIES,
  GET_COMPANY_DASHBOARD,
  GET_COMPANY_DETAILS,
  GET_COMPANY_SETTINGS,
  GET_CONFIRMED_TRANSACTIONS,
  GET_PENDING_TRANSACTIONS,
  GET_TRANSACTION,
} from './operations';

const notFound = vi.hoisted(() =>
  vi.fn(() => {
    throw new Error('Not found');
  }),
);

vi.mock('@tanstack/react-router', async (importOriginal) => ({
  ...(await importOriginal<typeof import('@tanstack/react-router')>()),
  notFound,
}));

const companyId = 'ee51ac7c-b789-43d6-a182-a664ee79acbb';

function context(query: ReturnType<typeof vi.fn>, authenticated = true) {
  return {
    apolloClient: { query } as unknown as ApolloClient,
    authenticatedOwner: authenticated
      ? ('auth0|owner' as AccountsOwnerId)
      : undefined,
  } as AuthenticatedAccountsRouterContext;
}

beforeEach(() => {
  vi.clearAllMocks();
});

describe('company route priming', () => {
  it('keeps the companies query recoverable when priming fails', async () => {
    const query = vi.fn().mockRejectedValue(new Error('Unavailable'));

    await expect(primeCompanies(context(query))).resolves.toBeUndefined();
    expect(query).toHaveBeenCalledWith({
      query: GET_COMPANIES,
      variables: { owner: 'auth0|owner' },
    });
  });

  it('does not prime companies without an authenticated owner', async () => {
    const query = vi.fn();

    await expect(
      primeCompanies(context(query, false)),
    ).resolves.toBeUndefined();
    expect(query).not.toHaveBeenCalled();
  });

  it('rejects malformed company identities before querying', async () => {
    const query = vi.fn();

    await expect(
      primeCompanyDetails(context(query), 'not-a-company-id'),
    ).rejects.toThrow('Not found');
    expect(query).not.toHaveBeenCalled();
  });

  it('rejects ownership checks whose company collection has no data', async () => {
    const query = vi.fn().mockResolvedValue({ data: undefined });

    await expect(
      primeCompanyDetails(context(query), companyId),
    ).rejects.toThrow('The owned company list did not return data');
  });

  it.each([
    ['clients', primeClients],
    ['details', primeCompanyDetails],
    ['settings', primeCompanySettings],
    ['dashboard', primeDashboard],
    ['transactions', primeTransactions],
    ['record transaction', verifyRecordTransactionRoute],
  ] as const)(
    'does not prime %s without an authenticated owner',
    async (_, prime) => {
      const query = vi.fn();

      await expect(
        prime(context(query, false), companyId),
      ).resolves.toBeUndefined();
      expect(query).not.toHaveBeenCalled();
    },
  );

  it('leaves a partial Transaction collection failure to the page', async () => {
    const query = vi
      .fn()
      .mockResolvedValueOnce({
        data: { getCompanies: { items: [{ id: companyId }] } },
      })
      .mockResolvedValueOnce({ data: {} })
      .mockRejectedValueOnce(new Error('Pending unavailable'));

    await expect(
      primeTransactions(context(query), companyId),
    ).resolves.toBeUndefined();
    expect(query).toHaveBeenCalledTimes(3);
  });

  it.each([
    [primeClients, GET_CLIENTS, { id: companyId }],
    [primeCompanyDetails, GET_COMPANY_DETAILS, { id: companyId }],
    [primeCompanySettings, GET_COMPANY_SETTINGS, { id: companyId }],
    [
      primeDashboard,
      GET_COMPANY_DASHBOARD,
      { count: 5, id: companyId, status: 'confirmed' },
    ],
    [
      primeTransactions,
      GET_CONFIRMED_TRANSACTIONS,
      { count: 100, id: companyId, status: 'confirmed' },
    ],
    [
      primePendingTransactions,
      GET_PENDING_TRANSACTIONS,
      { count: 100, id: companyId, status: 'pending' },
    ],
  ] as const)(
    'primes an owned company resource',
    async (prime, operation, variables) => {
      const query = vi
        .fn()
        .mockResolvedValueOnce({
          data: { getCompanies: { items: [{ id: companyId }] } },
        })
        .mockResolvedValueOnce({ data: {} });

      await prime(context(query), companyId);

      expect(query).toHaveBeenNthCalledWith(2, {
        query: operation,
        variables,
      });
    },
  );

  it('rejects a company route that is not owned by the authenticated user', async () => {
    const query = vi.fn().mockResolvedValue({
      data: { getCompanies: { items: [] } },
    });

    await expect(
      primeCompanyDetails(context(query), companyId),
    ).rejects.toThrow('Not found');
    expect(notFound).toHaveBeenCalledWith({ throw: true });
  });

  it('accepts a company found on a continuation page', async () => {
    const query = vi
      .fn()
      .mockResolvedValueOnce({
        data: {
          getCompanies: {
            items: [{ id: 'another-company' }],
            nextToken: 'page-2',
          },
        },
      })
      .mockResolvedValueOnce({
        data: {
          getCompanies: { items: [{ id: companyId }], nextToken: null },
        },
      })
      .mockResolvedValueOnce({ data: {} });

    await expect(
      primeClients(context(query), companyId),
    ).resolves.toBeUndefined();
    expect(query).toHaveBeenNthCalledWith(2, {
      fetchPolicy: 'no-cache',
      query: GET_COMPANIES,
      variables: { nextToken: 'page-2', owner: 'auth0|owner' },
    });
    expect(query).toHaveBeenNthCalledWith(3, {
      query: GET_CLIENTS,
      variables: { id: companyId },
    });
  });

  it('verifies an owned company before opening the record route', async () => {
    const query = vi.fn().mockResolvedValue({
      data: { getCompanies: { items: [{ id: companyId }] } },
    });

    await expect(
      verifyRecordTransactionRoute(context(query), companyId),
    ).resolves.toBeUndefined();
    expect(query).toHaveBeenCalledOnce();
  });

  it.each([
    ['details', primeCompanyDetails],
    ['settings', primeCompanySettings],
  ] as const)(
    'leaves an owned company %s query failure to the page recovery state',
    async (_, prime) => {
      const query = vi
        .fn()
        .mockResolvedValueOnce({
          data: { getCompanies: { items: [{ id: companyId }] } },
        })
        .mockRejectedValueOnce(new Error('Unavailable'));

      await expect(prime(context(query), companyId)).resolves.toBeUndefined();
      expect(query).toHaveBeenCalledTimes(2);
    },
  );
});

describe('primeTransaction', () => {
  it('does not prime a Transaction without an authenticated owner', async () => {
    const query = vi.fn();

    await expect(
      primeTransaction(
        context(query, false),
        companyId,
        '3456df4a-51f8-49af-a52e-c1a21b8ff087',
      ),
    ).resolves.toBeUndefined();
    expect(query).not.toHaveBeenCalled();
  });

  it('rejects a Transaction response without data', async () => {
    const transactionId = '3456df4a-51f8-49af-a52e-c1a21b8ff087';
    const query = vi
      .fn()
      .mockResolvedValueOnce({
        data: { getCompanies: { items: [{ id: companyId }] } },
      })
      .mockResolvedValueOnce({ data: undefined });

    await expect(
      primeTransaction(context(query), companyId, transactionId),
    ).rejects.toThrow('The Transaction did not return data');
  });

  it('leaves a transient Transaction query failure to the page recovery state', async () => {
    const transactionId = '3456df4a-51f8-49af-a52e-c1a21b8ff087';
    const query = vi
      .fn()
      .mockResolvedValueOnce({
        data: { getCompanies: { items: [{ id: companyId }] } },
      })
      .mockRejectedValueOnce(new Error('Unavailable'));

    await expect(
      primeTransaction(context(query), companyId, transactionId),
    ).resolves.toBeUndefined();
    expect(query).toHaveBeenNthCalledWith(2, {
      fetchPolicy: 'network-only',
      query: GET_TRANSACTION,
      variables: { transactionId },
    });
  });

  it('rejects a non-confirmed transaction on the confirmed detail route', async () => {
    const transactionId = '3456df4a-51f8-49af-a52e-c1a21b8ff087';
    const query = vi
      .fn()
      .mockResolvedValueOnce({
        data: { getCompanies: { items: [{ id: companyId }] } },
      })
      .mockResolvedValueOnce({
        data: { getTransaction: { companyId, status: 'pending' } },
      });
    await expect(
      primeTransaction(context(query), companyId, transactionId, 'confirmed'),
    ).rejects.toThrow('Not found');
    expect(query).toHaveBeenNthCalledWith(
      2,
      expect.objectContaining({ fetchPolicy: 'network-only' }),
    );
    expect(notFound).toHaveBeenCalledWith({ throw: true });
  });
});

describe('primeClient', () => {
  const clientId = '3456df4a-51f8-49af-a52e-c1a21b8ff087';

  it('rejects a client from another company boundary', async () => {
    const query = vi
      .fn()
      .mockResolvedValueOnce({
        data: { getCompanies: { items: [{ id: companyId }] } },
      })
      .mockResolvedValueOnce({
        data: {
          getClient: {
            companyId: 'ff6c908e-8e7e-44cf-996b-ac0401b2176d',
          },
        },
      });

    await expect(
      primeClient(context(query), companyId, clientId),
    ).rejects.toThrow('Not found');
    expect(notFound).toHaveBeenCalledWith({ throw: true });
    expect(query).toHaveBeenNthCalledWith(2, {
      query: GET_CLIENT,
      variables: { id: clientId },
    });
  });

  it('leaves a client query failure to the page recovery state', async () => {
    const query = vi
      .fn()
      .mockResolvedValueOnce({
        data: { getCompanies: { items: [{ id: companyId }] } },
      })
      .mockRejectedValueOnce(new Error('Unavailable'));

    await expect(
      primeClient(context(query), companyId, clientId),
    ).resolves.toBeUndefined();
    expect(notFound).not.toHaveBeenCalled();
  });

  it('accepts a client from the requested company boundary', async () => {
    const query = vi
      .fn()
      .mockResolvedValueOnce({
        data: { getCompanies: { items: [{ id: companyId }] } },
      })
      .mockResolvedValueOnce({ data: { getClient: { companyId } } });

    await expect(
      primeClient(context(query), companyId, clientId),
    ).resolves.toBeUndefined();
    expect(notFound).not.toHaveBeenCalled();
  });

  it('rejects a client query without data', async () => {
    const query = vi
      .fn()
      .mockResolvedValueOnce({
        data: { getCompanies: { items: [{ id: companyId }] } },
      })
      .mockResolvedValueOnce({ data: undefined });

    await expect(
      primeClient(context(query), companyId, clientId),
    ).rejects.toThrow('Not found');
    expect(notFound).toHaveBeenCalledWith({ throw: true });
  });
});
