import { act, render, RenderResult, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import type { Mock } from 'vitest';
import TestProvider from '../../utils/TestProvider';
import TransactionsList, { ITransactionsListProps } from '../TransactionsList';

describe('TransactionsList', () => {
  let companyId: string;
  let onDelete: Mock;

  beforeEach(() => {
    companyId = 'company-id';
    onDelete = vi.fn();
  });

  it('should display a message if there are no transactions', async () => {
    const { findByRole } = render(
      <TestProvider>
        <TransactionsList
          companyId={companyId}
          currency="GBP"
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
    let transactions: ITransactionsListProps['transactions'];

    beforeEach(async () => {
      transactions = [
        {
          amount: -20,
          attachment: '',
          date: '2020-04-15T14:07:18+0000',
          description: 'Lunch',
          id: 'transaction-2',
          name: 'KFC',
        },
        {
          amount: 200,
          attachment: 'invoice.pdf',
          date: '2020-04-13T14:07:18+0000',
          description: 'Invoice #1',
          id: 'transaction-1',
          name: 'Client',
        },
      ];

      await act(async () => {
        component = render(
          <TestProvider>
            <TransactionsList
              companyId={companyId}
              currency="GBP"
              loading={false}
              transactions={transactions}
              onDelete={onDelete}
            />
          </TestProvider>,
        );

        await Promise.resolve();
      });
    });

    it('should display the action table heading', async () => {
      const { findAllByRole } = component;
      const [, , action] = await findAllByRole('columnheader');

      expect(action).toHaveTextContent('transactions-list.actions');
    });

    it('should preserve deletion confirmation when transactions refresh', async () => {
      const user = userEvent.setup();

      await user.click(component.getByTestId('Delete KFC'));
      await user.type(component.getByLabelText('confirm-delete'), 'K');

      component.rerender(
        <TestProvider>
          <TransactionsList
            companyId={companyId}
            currency="GBP"
            loading={false}
            transactions={transactions.map((transaction) => ({
              ...transaction,
              amount: transaction.amount + 10,
            }))}
            onDelete={onDelete}
          />
        </TestProvider>,
      );

      expect(component.getByLabelText('confirm-delete')).toHaveValue('K');

      await user.type(component.getByLabelText('confirm-delete'), 'FC');
      await user.click(component.getByRole('button', { name: 'delete' }));

      expect(onDelete).toHaveBeenCalledWith('transaction-2');
    });

    it('should dismiss deletion confirmation when the selected transaction is removed', async () => {
      const user = userEvent.setup();

      await user.click(component.getByTestId('Delete KFC'));

      expect(component.getByLabelText('confirm-delete')).toBeInTheDocument();

      component.rerender(
        <TestProvider>
          <TransactionsList
            companyId={companyId}
            currency="GBP"
            loading={false}
            transactions={transactions.filter(
              ({ id }) => id !== 'transaction-2',
            )}
            onDelete={onDelete}
          />
        </TestProvider>,
      );

      await waitFor(() => {
        expect(
          component.queryByLabelText('confirm-delete'),
        ).not.toBeInTheDocument();
      });
      expect(onDelete).not.toHaveBeenCalled();
    });

    it('should display the date in the correct format', async () => {
      const { findAllByRole } = component;
      const [date] = await findAllByRole('columnheader');

      expect(date).toHaveTextContent('Wednesday, 15 April');
    });

    it('should display the correct daily total', async () => {
      const { findAllByRole } = component;
      const [, total] = await findAllByRole('columnheader');

      expect(total).toHaveTextContent('-£20.00');
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
