import { ApolloCache, InMemoryCache } from '@apollo/client';
import { MockedProvider, MockedResponse } from '@apollo/client/testing';
import { waitForApollo } from '@motech-development/appsync-apollo';
import {
  act,
  fireEvent,
  render,
  RenderResult,
  waitFor,
} from '@testing-library/react';
import {
  Balance,
  DeleteTransactionMutation,
  Transactions,
  TransactionStatus,
} from '../../../../graphql/graphql';
import TestProvider, { add } from '../../../../utils/TestProvider';
import PendingTransactions, {
  DELETE_TRANSACTION,
  GET_TRANSACTIONS,
  update,
} from '../PendingTransactions';

describe('PendingTransactions', () => {
  let component: RenderResult;
  let history: string[];
  let mocks: MockedResponse[];

  beforeEach(() => {
    history = ['/accounts/company-id/pending-transactions'];
  });

  describe('success', () => {
    beforeEach(async () => {
      mocks = [
        {
          request: {
            query: GET_TRANSACTIONS,
            variables: {
              id: 'company-id',
              status: 'pending',
            },
          },
          result: {
            data: {
              getBalance: {
                currency: 'GBP',
                id: 'company-id',
              },
              getTransactions: {
                id: 'company-id',
                items: [
                  {
                    amount: -20,
                    attachment: '',
                    date: '2020-04-15T14:07:18+0000',
                    description: 'Lunch',
                    id: 'transaction-2',
                    name: 'KFC',
                    scheduled: true,
                  },
                  {
                    amount: 200,
                    attachment: '',
                    date: '2020-04-13T14:07:18+0000',
                    description: 'Invoice #1',
                    id: 'transaction-1',
                    name: 'Client',
                    scheduled: false,
                  },
                ],
                status: 'pending',
              },
            },
          },
        },
        {
          request: {
            query: DELETE_TRANSACTION,
            variables: {
              id: 'transaction-2',
            },
          },
          result: {
            data: {
              deleteTransaction: {
                companyId: 'company-id',
                id: 'transaction-2',
                status: 'confirmed',
              },
            },
          },
        },
      ];

      await act(async () => {
        component = render(
          <TestProvider
            path="/accounts/:companyId/pending-transactions"
            history={history}
          >
            <MockedProvider mocks={mocks}>
              <PendingTransactions />
            </MockedProvider>
          </TestProvider>,
        );

        await waitForApollo(0);
      });
    });

    it('should have the correct page title', async () => {
      const { findByText } = component;
      const title = await findByText('pending-transactions.title');
      const subTitle = await findByText('pending-transactions.sub-title');

      expect(title).toBeInTheDocument();
      expect(subTitle).toBeInTheDocument();
    });

    it('should have the correct table headings', async () => {
      const { findAllByRole } = component;
      const [name, date, amount, action] = await findAllByRole('columnheader');

      expect(name).toHaveTextContent('pending-transactions.transactions.name');
      expect(date).toHaveTextContent('pending-transactions.transactions.date');
      expect(amount).toHaveTextContent(
        'pending-transactions.transactions.amount',
      );
      expect(action).toHaveTextContent(
        'pending-transactions.transactions.action',
      );
    });

    it('should display view button', async () => {
      const { findAllByText } = component;
      const [view] = await findAllByText(
        'pending-transactions.transactions.view',
      );

      expect(view).toHaveAttribute(
        'href',
        '/my-companies/accounts/company-id/view-transaction/transaction-2',
      );
    });

    it('should display delete confirmation modal', async () => {
      const { findByRole, findAllByText } = component;
      const [button] = await findAllByText(
        'pending-transactions.transactions.delete',
      );

      fireEvent.click(button);

      await expect(findByRole('dialog')).resolves.toBeInTheDocument();
    });

    it('should hide the delete confirmation modal', async () => {
      const { findAllByRole, findByRole, queryByRole } = component;

      const [button] = await findAllByRole('button');

      fireEvent.click(button);

      await findByRole('dialog');

      const [, , cancelButton] = await findAllByRole('button');

      fireEvent.click(cancelButton);

      expect(queryByRole('dialog')).not.toBeInTheDocument();
    });

    it('should display a success toast when deleting a transaction', async () => {
      const { findAllByRole, findByLabelText, findByText } = component;

      await findByText('pending-transactions.title');

      const [button] = await findAllByRole('button');

      fireEvent.click(button);

      const input = await findByLabelText('confirm-delete');

      fireEvent.change(input, {
        target: {
          focus: () => {},
          value: 'KFC',
        },
      });

      const [, , , deleteButton] = await findAllByRole('button');

      await waitFor(() => expect(deleteButton).not.toBeDisabled());

      fireEvent.click(deleteButton);

      await act(async () => {
        await waitForApollo(0);
      });

      await waitFor(() =>
        expect(add).toHaveBeenCalledWith({
          colour: 'success',
          message: 'delete-transaction.success',
        }),
      );
    });
  });

  describe('failure', () => {
    beforeEach(async () => {
      mocks = [
        {
          request: {
            query: GET_TRANSACTIONS,
            variables: {
              id: 'company-id',
              status: 'pending',
            },
          },
          result: {
            data: {
              getBalance: {
                currency: 'GBP',
                id: 'company-id',
              },
              getTransactions: {
                id: 'company-id',
                items: [
                  {
                    amount: -20,
                    attachment: '',
                    date: '2020-04-15T14:07:18+0000',
                    description: 'Lunch',
                    id: 'transaction-2',
                    name: 'KFC',
                    scheduled: true,
                  },
                  {
                    amount: 200,
                    attachment: '',
                    date: '2020-04-13T14:07:18+0000',
                    description: 'Invoice #1',
                    id: 'transaction-1',
                    name: 'Client',
                    scheduled: false,
                  },
                ],
                status: 'pending',
              },
            },
          },
        },
        {
          error: new Error(),
          request: {
            query: DELETE_TRANSACTION,
            variables: {
              id: 'transaction-2',
            },
          },
        },
      ];

      await act(async () => {
        component = render(
          <TestProvider
            path="/accounts/:companyId/pending-transactions"
            history={history}
          >
            <MockedProvider mocks={mocks}>
              <PendingTransactions />
            </MockedProvider>
          </TestProvider>,
        );

        await Promise.resolve();
      });
    });

    it('should display an error toast when deleting a transaction', async () => {
      const { findAllByRole, findByLabelText, findByText } = component;

      await findByText('pending-transactions.title');

      const [button] = await findAllByRole('button');

      fireEvent.click(button);

      const input = await findByLabelText('confirm-delete');

      fireEvent.change(input, {
        target: {
          focus: () => {},
          value: 'KFC',
        },
      });

      const [, , , deleteButton] = await findAllByRole('button');

      await waitFor(() => expect(deleteButton).not.toBeDisabled());

      fireEvent.click(deleteButton);

      await act(async () => {
        await waitForApollo(0);
      });

      await waitFor(() =>
        expect(add).toHaveBeenCalledWith({
          colour: 'danger',
          message: 'delete-transaction.error',
        }),
      );
    });
  });

  describe('no data', () => {
    beforeEach(async () => {
      mocks = [
        {
          request: {
            query: GET_TRANSACTIONS,
            variables: {
              id: 'company-id',
              status: 'pending',
            },
          },
          result: {
            data: {
              getBalance: {
                currency: 'GBP',
                id: 'company-id',
              },
              getTransactions: {
                id: 'company-id',
                items: [],
                status: 'pending',
              },
            },
          },
        },
      ];

      await act(async () => {
        component = render(
          <TestProvider
            path="/accounts/:companyId/pending-transactions"
            history={history}
          >
            <MockedProvider mocks={mocks}>
              <PendingTransactions />
            </MockedProvider>
          </TestProvider>,
        );

        await Promise.resolve();
      });
    });

    it('should display no transactions message', async () => {
      const { findByText } = component;
      const heading = await findByText('no-transactions.title');
      const description = await findByText('no-transactions.description');

      expect(heading).toBeInTheDocument();
      expect(description).toBeInTheDocument();
    });
  });

  describe('cache', () => {
    let cache: ApolloCache<DeleteTransactionMutation>;

    beforeEach(() => {
      cache = new InMemoryCache({
        typePolicies: {
          Transactions: {
            keyFields: ['id', 'status'],
          },
        },
      }) as unknown as ApolloCache<DeleteTransactionMutation>;

      cache.writeQuery({
        data: {
          getBalance: {
            __typename: 'Balance',
            currency: 'GBP',
            id: 'company-id',
          } as unknown as Balance,
          getTransactions: {
            __typename: 'Transactions',
            id: 'company-id',
            items: [
              {
                amount: 100,
                attachment: '',
                date: '2021-02-21',
                description: 'A purchase',
                id: 'transaction-id-0',
                name: 'Your favourite shop',
                scheduled: false,
              },
              {
                amount: 100,
                attachment: '',
                date: '2021-02-23',
                description: 'A purchase',
                id: 'transaction-id-1',
                name: 'Your favourite shop',
                scheduled: false,
              },
            ],
            status: TransactionStatus.Confirmed,
          } as unknown as Transactions,
        },
        query: GET_TRANSACTIONS,
        variables: {
          id: 'company-id',
          status: TransactionStatus.Confirmed,
        },
      });

      jest.spyOn(cache, 'modify');
    });

    it('should remove transaction from the transaction cache', () => {
      const input = {
        data: {
          deleteTransaction: {
            companyId: 'company-id',
            id: 'transaction-id-0',
            status: TransactionStatus.Confirmed,
          },
        },
      };

      update(cache, input, {});

      const result = cache.readQuery({
        query: GET_TRANSACTIONS,
        variables: {
          id: 'company-id',
          status: TransactionStatus.Confirmed,
        },
      });

      expect(result).toEqual({
        getBalance: {
          __typename: 'Balance',
          currency: 'GBP',
          id: 'company-id',
        },
        getTransactions: {
          __typename: 'Transactions',
          id: 'company-id',
          items: [
            {
              amount: 100,
              attachment: '',
              date: '2021-02-23',
              description: 'A purchase',
              id: 'transaction-id-1',
              name: 'Your favourite shop',
              scheduled: false,
            },
          ],
          status: 'confirmed',
        },
      });
    });

    it('should not modify cache if no data is passed', () => {
      update(cache, {}, {});

      expect(cache.modify).not.toHaveBeenCalled();
    });
  });
});
