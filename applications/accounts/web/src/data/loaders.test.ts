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

  it.each([
    [primeClients, GET_CLIENTS, { count: 100, id: companyId }],
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
      primeTransaction(context(query), companyId, transactionId),
    ).rejects.toThrow('Not found');
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
