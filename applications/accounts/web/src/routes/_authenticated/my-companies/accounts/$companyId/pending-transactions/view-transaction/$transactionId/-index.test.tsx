import { render, screen } from '@testing-library/react';
import { type ComponentType, createElement } from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import type { AuthenticatedAccountsRouterContext } from '../../../../../../../../auth/router';
import { Route } from './index';

const mocks = vi.hoisted(() => ({
  primeTransaction: vi.fn().mockResolvedValue(undefined),
}));

vi.mock('../../../../../../../../data/loaders', () => ({
  primeTransaction: mocks.primeTransaction,
}));

vi.mock(
  '../../../../../../../../features/transactions/TransactionEditPage',
  () => ({
    TransactionEditPage: ({
      companyId,
      origin,
      transactionId,
    }: {
      companyId: string;
      origin: string;
      transactionId: string;
    }) => (
      <p>
        {origin}:{companyId}:{transactionId}
      </p>
    ),
  }),
);

describe('Pending view Transaction route', () => {
  afterEach(() => {
    vi.clearAllMocks();
    vi.restoreAllMocks();
  });

  it('opens the shared editor over Pending transactions', () => {
    vi.spyOn(Route, 'useParams').mockReturnValue({
      companyId: 'company-id',
      transactionId: 'transaction-id',
    });
    const PendingTransactionPage = Route.options.component as ComponentType;

    render(createElement(PendingTransactionPage));

    expect(screen.getByText('pending:company-id:transaction-id')).toBeVisible();
  });

  it('lets the editor recover when a Pending Transaction publishes during loading', async () => {
    const context = {} as AuthenticatedAccountsRouterContext;
    const { loader } = Route.options;

    if (typeof loader !== 'function') {
      throw new TypeError('Expected a route loader');
    }

    const loaderContext = {
      context,
      params: {
        companyId: 'company-id',
        transactionId: 'transaction-id',
      },
    } as Parameters<typeof loader>[0];

    await loader(loaderContext);

    expect(mocks.primeTransaction).toHaveBeenCalledWith(
      context,
      'company-id',
      'transaction-id',
    );
  });
});
