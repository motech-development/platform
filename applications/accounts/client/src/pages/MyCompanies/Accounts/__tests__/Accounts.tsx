import { MockedProvider, MockedResponse } from '@apollo/client/testing';
import { waitForApollo } from '@motech-development/appsync-apollo';
import {
  act,
  fireEvent,
  render,
  RenderResult,
  waitFor,
} from '@testing-library/react';
import TestProvider, { add } from '../../../../utils/TestProvider';
import Accounts, {
  DELETE_TRANSACTION,
  GET_BALANCE,
  ON_TRANSACTION,
} from '../Accounts';

describe('Accounts', () => {
  let component: RenderResult;
  let history: string[];
  let mocks: MockedResponse[];

  beforeEach(() => {
    history = ['/accounts/company-id'];
  });

  describe('success', () => {
    beforeEach(async () => {
      mocks = [
        {
          request: {
            query: GET_BALANCE,
            variables: {
              count: 100,
              id: 'company-id',
              status: 'confirmed',
            },
          },
          result: {
            data: {
              getBalance: {
                balance: 180,
                currency: 'GBP',
                id: 'company-id',
                vat: {
                  owed: 100,
                  paid: 99.9,
                },
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
                  },
                  {
                    amount: 200,
                    attachment: '',
                    date: '2020-04-13T14:07:18+0000',
                    description: 'Invoice #1',
                    id: 'transaction-1',
                    name: 'Client',
                  },
                ],
                nextToken: null,
                status: 'confirmed',
              },
            },
          },
        },
        {
          request: {
            query: GET_BALANCE,
            variables: {
              count: 100,
              id: 'company-id',
              status: 'confirmed',
            },
          },
          result: {
            data: {
              getBalance: {
                balance: 200,
                currency: 'GBP',
                id: 'company-id',
                vat: {
                  owed: 100,
                  paid: 0,
                },
              },
              getTransactions: {
                id: 'company-id',
                items: [
                  {
                    amount: 200,
                    attachment: '',
                    date: '2020-04-13T14:07:18+0000',
                    description: 'Invoice #1',
                    id: 'transaction-1',
                    name: 'Client',
                  },
                ],
                nextToken: null,
                status: 'confirmed',
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
        {
          request: {
            query: ON_TRANSACTION,
            variables: {
              id: 'company-id',
              owner: 'user-id',
            },
          },
          result: {
            data: {
              onTransaction: {
                balance: 180,
                vat: {
                  owed: 100,
                  paid: 99.9,
                },
              },
            },
          },
        },
      ];

      await act(async () => {
        component = render(
          <TestProvider path="/accounts/:companyId" history={history}>
            <MockedProvider mocks={mocks}>
              <Accounts />
            </MockedProvider>
          </TestProvider>,
        );

        await Promise.resolve();
      });
    });

    it('should show the correct page title', async () => {
      const { findAllByRole } = component;
      const [title] = await findAllByRole('heading');

      expect(title).toHaveTextContent('accounts.title');
    });

    it('should show the overview card', async () => {
      const { findAllByRole } = component;
      const [, title] = await findAllByRole('heading');

      expect(title).toHaveTextContent('accounts.overview.title');
    });

    it('should show the balance', async () => {
      const { findByText } = component;

      await expect(
        findByText('accounts.overview.balance'),
      ).resolves.toBeInTheDocument();
    });

    it('should show the VAT owed', async () => {
      const { findByText } = component;

      await expect(
        findByText('accounts.overview.vat-owed'),
      ).resolves.toBeInTheDocument();
    });

    it('should show the VAT paid', async () => {
      const { findByText } = component;

      await expect(
        findByText('accounts.overview.vat-paid'),
      ).resolves.toBeInTheDocument();
    });

    it('should show the add transaction card', async () => {
      const { findAllByRole } = component;
      const [, , title] = await findAllByRole('heading');

      expect(title).toHaveTextContent('accounts.record-transaction.title');
    });

    it('should have the correct add transaction link', async () => {
      const { findAllByRole } = component;
      const [link] = await findAllByRole('link');

      expect(link).toHaveAttribute(
        'href',
        '/my-companies/accounts/company-id/record-transaction',
      );
    });

    it('should show the pending transactions card', async () => {
      const { findAllByRole } = component;
      const [, , , title] = await findAllByRole('heading');

      expect(title).toHaveTextContent('accounts.pending-transactions.title');
    });

    it('should have the correct pending transactions link', async () => {
      const { findAllByRole } = component;
      const [, link] = await findAllByRole('link');

      expect(link).toHaveAttribute(
        'href',
        '/my-companies/accounts/company-id/pending-transactions',
      );
    });

    it('should show the dashboard card', async () => {
      const { findAllByRole } = component;
      const [, , , , title] = await findAllByRole('heading');

      expect(title).toHaveTextContent('accounts.dashboard.title');
    });

    it('should have the correct dashboard link', async () => {
      const { findAllByRole } = component;
      const [, , link] = await findAllByRole('link');

      expect(link).toHaveAttribute(
        'href',
        '/my-companies/dashboard/company-id',
      );
    });

    it('should show the transaction list table', async () => {
      const { findByRole } = component;

      await expect(findByRole('table')).resolves.toBeInTheDocument();
    });

    it('should display delete confirmation modal', async () => {
      const { findByRole, findAllByText } = component;
      const [button] = await findAllByText('transactions-list.delete');

      fireEvent.click(button);

      await expect(findByRole('dialog')).resolves.toBeInTheDocument();
    });

    it('should hide the delete confirmation modal', async () => {
      const { findAllByRole, findByRole, findByText, queryByRole } = component;

      await findByText('accounts.title');

      await act(async () => {
        const [button] = await findAllByRole('button');

        fireEvent.click(button);
      });

      await findByRole('dialog');

      await act(async () => {
        const [, , cancelButton] = await findAllByRole('button');

        fireEvent.click(cancelButton);
      });

      expect(queryByRole('dialog')).not.toBeInTheDocument();
    });

    it('should display a success toast when deleting a transaction', async () => {
      const { findAllByRole, findByLabelText, findByText } = component;

      await findByText('accounts.title');

      await act(async () => {
        const [button] = await findAllByRole('button');

        fireEvent.click(button);
      });

      await act(async () => {
        const input = await findByLabelText('confirm-delete');

        fireEvent.change(input, {
          target: {
            focus: () => {},
            value: 'KFC',
          },
        });
      });

      await act(async () => {
        const [, , , deleteButton] = await findAllByRole('button');

        await waitFor(() => expect(deleteButton).not.toBeDisabled());

        fireEvent.click(deleteButton);

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
            query: GET_BALANCE,
            variables: {
              count: 100,
              id: 'company-id',
              status: 'confirmed',
            },
          },
          result: {
            data: {
              getBalance: {
                balance: 180,
                currency: 'GBP',
                id: 'company-id',
                vat: {
                  owed: 100,
                  paid: 99.9,
                },
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
                  },
                  {
                    amount: 200,
                    attachment: '',
                    date: '2020-04-13T14:07:18+0000',
                    description: 'Invoice #1',
                    id: 'transaction-1',
                    name: 'Client',
                  },
                ],
                nextToken: null,
                status: 'confirmed',
              },
            },
          },
        },
        {
          request: {
            query: GET_BALANCE,
            variables: {
              count: 100,
              id: 'company-id',
              status: 'confirmed',
            },
          },
          result: {
            data: {
              getBalance: {
                balance: 200,
                currency: 'GBP',
                id: 'company-id',
                vat: {
                  owed: 100,
                  paid: 0,
                },
              },
              getTransactions: {
                id: 'company-id',
                items: [
                  {
                    amount: 200,
                    attachment: '',
                    date: '2020-04-13T14:07:18+0000',
                    description: 'Invoice #1',
                    id: 'transaction-1',
                    name: 'Client',
                  },
                ],
                nextToken: null,
                status: 'confirmed',
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
        {
          request: {
            query: ON_TRANSACTION,
            variables: {
              id: 'company-id',
              owner: 'user-id',
            },
          },
          result: {
            data: {
              onTransaction: {
                balance: 180,
                transactions: [
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
                        attachment: '',
                        description: 'Invoice #1',
                        id: 'transaction-1',
                        name: 'Client',
                      },
                    ],
                  },
                ],
                vat: {
                  owed: 100,
                  paid: 99.9,
                },
              },
            },
          },
        },
      ];

      await act(async () => {
        component = render(
          <TestProvider path="/accounts/:companyId" history={history}>
            <MockedProvider mocks={mocks}>
              <Accounts />
            </MockedProvider>
          </TestProvider>,
        );

        await Promise.resolve();
      });
    });

    it('should display an error toast when deleting a transaction', async () => {
      const { findAllByRole, findByLabelText, findByText } = component;

      await findByText('accounts.title');

      await act(async () => {
        const [button] = await findAllByRole('button');

        fireEvent.click(button);
      });

      await act(async () => {
        const input = await findByLabelText('confirm-delete');

        fireEvent.change(input, {
          target: {
            focus: () => {},
            value: 'KFC',
          },
        });
      });

      await act(async () => {
        const [, , , deleteButton] = await findAllByRole('button');

        await waitFor(() => expect(deleteButton).not.toBeDisabled());

        fireEvent.click(deleteButton);

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
});
