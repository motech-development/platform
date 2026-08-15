import { render, screen } from '@testing-library/react';
import { type ComponentType, createElement } from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { Route } from './index';

vi.mock(
  '../../../../../../../features/transactions/TransactionEditPage',
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

describe('view Transaction route', () => {
  afterEach(() => vi.restoreAllMocks());

  it('opens the shared editor over the Transactions collection', () => {
    vi.spyOn(Route, 'useParams').mockReturnValue({
      companyId: 'company-id',
      transactionId: 'transaction-id',
    });
    const TransactionPage = Route.options.component as ComponentType;

    render(createElement(TransactionPage));

    expect(
      screen.getByText('transactions:company-id:transaction-id'),
    ).toBeVisible();
  });
});
