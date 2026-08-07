import type { ApolloClient } from '@apollo/client';
import { describe, expect, it, vi } from 'vitest';
import type { AccountsOwnerId } from '../auth/owner';
import type { AuthenticatedAccountsRouterContext } from '../auth/router';
import { primeTransaction } from './loaders';

const notFound = vi.hoisted(() =>
  vi.fn(() => {
    throw new Error('Not found');
  }),
);

vi.mock('@tanstack/react-router', async (importOriginal) => ({
  ...(await importOriginal<typeof import('@tanstack/react-router')>()),
  notFound,
}));

describe('primeTransaction', () => {
  it('rejects a non-confirmed transaction on the confirmed detail route', async () => {
    const companyId = 'ee51ac7c-b789-43d6-a182-a664ee79acbb';
    const transactionId = '3456df4a-51f8-49af-a52e-c1a21b8ff087';
    const query = vi
      .fn()
      .mockResolvedValueOnce({
        data: { getCompanies: { items: [{ id: companyId }] } },
      })
      .mockResolvedValueOnce({
        data: { getTransaction: { companyId, status: 'pending' } },
      });
    const context = {
      apolloClient: { query } as unknown as ApolloClient,
      authenticatedOwner: 'auth0|owner' as AccountsOwnerId,
    } as AuthenticatedAccountsRouterContext;

    await expect(
      primeTransaction(context, companyId, transactionId),
    ).rejects.toThrow('Not found');
    expect(notFound).toHaveBeenCalledWith({ throw: true });
  });
});
