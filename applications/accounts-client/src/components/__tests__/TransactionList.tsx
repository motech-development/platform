import { act, render, RenderResult } from '@testing-library/react';
import React from 'react';
import TestProvider from '../../utils/TestProvider';
import TransactionsList from '../TransactionsList';

describe('TransactionsList', () => {
  let companyId: string;
  let onDelete: jest.Mock;

  beforeEach(() => {
    companyId = 'company-id';
    onDelete = jest.fn();
  });

  it('should display a message if there are no transactions', async () => {
    const { findByRole } = render(
      <TestProvider>
        <TransactionsList
          companyId={companyId}
          loading={false}
          transactions={[]}
          onDelete={onDelete}
        />
      </TestProvider>,
    );

    await expect(findByRole('heading')).resolves.toHaveTextContent(
      'no-transactions.title',
    );
  });

  describe('when there are transaction', () => {
    let component: RenderResult;

    beforeEach(async () => {
      const transactions = [
        {
          balance: 180,
          currency: 'GBP',
          date: '2020-04-15T14:07:18+0000',
          items: [
            {
              amount: -20,
              attachment: '',
              description: 'Lunch',
              id: 'transaction-2',
              name: 'KFC',
            },
          ],
        },
        {
          balance: 200,
          currency: 'GBP',
          date: '2020-04-13T14:07:18+0000',
          items: [
            {
              amount: 200,
              attachment: 'invoice.pdf',
              description: 'Invoice #1',
              id: 'transaction-1',
              name: 'Client',
            },
          ],
        },
      ];

      await act(async () => {
        component = render(
          <TestProvider>
            <TransactionsList
              companyId={companyId}
              loading={false}
              transactions={transactions}
              onDelete={onDelete}
            />
          </TestProvider>,
        );
      });
    });

    it('should display the action table heading', async () => {
      const { findAllByRole } = component;
      const [, , action] = await findAllByRole('columnheader');

      expect(action).toHaveTextContent('transactions-list.actions');
    });

    it('should display the date in the correct format', async () => {
      const { findAllByRole } = component;
      const [date] = await findAllByRole('columnheader');

      expect(date).toHaveTextContent('Wednesday, 15 April');
    });

    it('should display the correct daily total', async () => {
      const { findAllByRole } = component;
      const [, total] = await findAllByRole('columnheader');

      expect(total).toHaveTextContent('£180.00');
    });

    it('should have a view link button', async () => {
      const { findAllByText } = component;
      const [view] = await findAllByText('transactions-list.view');

      expect(view).toHaveAttribute(
        'href',
        '/my-companies/accounts/company-id/view-transaction/transaction-2',
      );
    });

    it('should display the transaction name', async () => {
      const { findByText } = component;

      await expect(findByText('Client')).resolves.toBeInTheDocument();
    });

    it('should display the transaction description', async () => {
      const { findByText } = component;

      await expect(findByText('Lunch')).resolves.toBeInTheDocument();
    });

    it('should display the incoming transacton arrow', () => {
      const { container } = component;
      const arrow = container.querySelector('[data-icon="arrow-right"]');

      expect(arrow).toBeInTheDocument();
    });

    it('should display the outgoing transacton arrow', () => {
      const { container } = component;
      const arrow = container.querySelector('[data-icon="arrow-left"]');

      expect(arrow).toBeInTheDocument();
    });
  });
});
