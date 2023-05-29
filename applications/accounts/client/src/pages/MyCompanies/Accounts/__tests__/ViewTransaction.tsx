import { MockedProvider, MockedResponse } from '@apollo/client/testing';
import { waitForApollo } from '@motech-development/appsync-apollo';
import {
  act,
  fireEvent,
  screen,
  render,
  waitFor,
} from '@testing-library/react';
import axios from 'axios';
import { saveAs } from 'file-saver';
import GET_BALANCE from '../../../../graphql/balance/GET_BALANCE';
import DELETE_TRANSACTION from '../../../../graphql/transaction/DELETE_TRANSACTION';
import UPDATE_TRANSACTION from '../../../../graphql/transaction/UPDATE_TRANSACTION';
import TestProvider, { add } from '../../../../utils/TestProvider';
import { DELETE_FILE, REQUEST_DOWNLOAD } from '../shared/ViewAttachment';
import ViewTransaction, { VIEW_TRANSACTION } from '../ViewTransaction';

describe('ViewTransaction', () => {
  let history: string[];
  let mocks: MockedResponse[];

  beforeEach(() => {
    jest.setTimeout(120000);

    history = ['/accounts/company-id/view-transaction/transaction-id'];

    axios.request = jest.fn().mockResolvedValue({
      data: 'success',
    });
  });

  describe('purchase', () => {
    describe('without an attachment', () => {
      beforeEach(async () => {
        mocks = [
          {
            request: {
              query: GET_BALANCE,
              variables: {
                id: 'company-id',
              },
            },
            result: {
              data: {
                getBalance: {
                  balance: 180,
                  currency: 'GBP',
                  id: 'company-id',
                  transactions: [
                    {
                      balance: 180,
                      currency: 'GBP',
                      date: '2020-04-15T14:07:18.000Z',
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
                      date: '2020-04-13T14:07:18.000Z',
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
          {
            request: {
              query: VIEW_TRANSACTION,
              variables: {
                companyId: 'company-id',
                transactionId: 'transaction-id',
              },
            },
            result: {
              data: {
                getClients: {
                  id: 'company-id',
                  items: [],
                },
                getSettings: {
                  categories: [
                    {
                      name: 'Equipment',
                      vatRate: 20,
                    },
                    {
                      name: 'Accommodation',
                      vatRate: 20,
                    },
                  ],
                  id: 'company-id',
                  vat: {
                    pay: 20,
                  },
                },
                getTransaction: {
                  amount: -999.99,
                  attachment: '',
                  category: 'Equipment',
                  companyId: 'company-id',
                  date: '2020-05-07T10:58:17.000Z',
                  description: 'Laptop',
                  id: 'transaction-id',
                  name: 'Apple',
                  refund: false,
                  scheduled: true,
                  status: 'pending',
                  vat: 166.67,
                },
                getTypeahead: {
                  id: 'company-id',
                  purchases: ['Test purchase 1', 'Test purchase 2'],
                  sales: ['Test sale 1', 'Test sale 2'],
                  suppliers: ['Test suppliers 1', 'Test suppliers 2'],
                },
              },
            },
          },
          {
            request: {
              query: UPDATE_TRANSACTION,
              variables: {
                input: {
                  amount: -999.99,
                  attachment: '',
                  category: 'Equipment',
                  companyId: 'company-id',
                  date: '2020-05-07T10:58:17.000Z',
                  description: 'Laptop',
                  id: 'transaction-id',
                  name: 'Apple',
                  refund: false,
                  scheduled: false,
                  status: 'confirmed',
                  vat: 166.67,
                },
              },
            },
            result: {
              data: {
                updateTransaction: {
                  __typename: 'Transaction',
                  amount: -999.99,
                  attachment: '',
                  category: 'Equipment',
                  companyId: 'company-id',
                  date: '2020-05-07T10:58:17.000Z',
                  description: 'Laptop',
                  id: 'transaction-id',
                  name: 'Apple',
                  refund: false,
                  scheduled: false,
                  status: 'confirmed',
                  vat: 166.67,
                },
              },
            },
          },
          {
            request: {
              query: DELETE_TRANSACTION,
              variables: {
                id: 'transaction-id',
              },
            },
            result: {
              data: {
                deleteTransaction: {
                  companyId: 'company-id',
                  id: 'transaction-id',
                  status: 'pending',
                },
              },
            },
          },
        ];

        await act(async () => {
          render(
            <TestProvider
              path="/accounts/:companyId/view-transaction/:transactionId"
              history={history}
            >
              <MockedProvider mocks={mocks}>
                <ViewTransaction />
              </MockedProvider>
            </TestProvider>,
          );

          await waitForApollo(0);
        });
      });

      it('should redirect you back to accounts page on complete', async () => {
        await screen.findByText('view-transaction.title');

        await act(async () => {
          const status = await screen.findByLabelText(
            'transaction-form.transaction-amount.status.options.confirmed',
          );

          fireEvent.click(status);
        });

        await act(async () => {
          const [, , button] = await screen.findAllByRole('button');

          fireEvent.click(button);

          await waitForApollo(0);
        });

        await expect(
          screen.findByTestId('/my-companies/accounts/company-id'),
        ).resolves.toBeInTheDocument();
      });

      it('should display a success toast', async () => {
        await screen.findByText('view-transaction.title');

        await act(async () => {
          const status = await screen.findByLabelText(
            'transaction-form.transaction-amount.status.options.confirmed',
          );

          fireEvent.click(status);
        });

        await act(async () => {
          const [, , button] = await screen.findAllByRole('button');

          fireEvent.click(button);

          await waitForApollo(0);
        });

        await waitFor(() =>
          expect(add).toHaveBeenCalledWith({
            colour: 'success',
            message: 'view-transaction.success',
          }),
        );
      });

      it('should display delete confirmation modal', async () => {
        const button = await screen.findByText(
          'view-transaction.delete-transaction',
        );

        fireEvent.click(button);

        await expect(screen.findByRole('dialog')).resolves.toBeInTheDocument();
      });

      it('should hide the delete confirmation modal', async () => {
        await screen.findByText('view-transaction.title');

        await act(async () => {
          const [, , , button] = await screen.findAllByRole('button');

          fireEvent.click(button);
        });

        await screen.findByRole('dialog');

        await act(async () => {
          const [, , , , cancelButton] = await screen.findAllByRole('button');

          fireEvent.click(cancelButton);
        });

        expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
      });

      it('should delete the transaction', async () => {
        await screen.findByText('view-transaction.title');

        await act(async () => {
          const [, , , button] = await screen.findAllByRole('button');

          fireEvent.click(button);
        });

        await act(async () => {
          const input = await screen.findByLabelText('confirm-delete');

          fireEvent.change(input, {
            target: {
              focus: () => {},
              value: 'Apple',
            },
          });
        });

        await act(async () => {
          const [, , , , , deleteButton] = await screen.findAllByRole('button');

          await waitFor(() => expect(deleteButton).not.toBeDisabled());

          fireEvent.click(deleteButton);

          await waitForApollo(0);
        });

        await expect(
          screen.findByTestId(
            '/my-companies/accounts/company-id/pending-transactions',
          ),
        ).resolves.toBeInTheDocument();
      });

      it('should display a success toast when deleting a transaction', async () => {
        await screen.findByText('view-transaction.title');

        await act(async () => {
          const [, , , button] = await screen.findAllByRole('button');

          fireEvent.click(button);
        });

        await act(async () => {
          const input = await screen.findByLabelText('confirm-delete');

          fireEvent.change(input, {
            target: {
              focus: () => {},
              value: 'Apple',
            },
          });
        });

        await act(async () => {
          const [, , , , , deleteButton] = await screen.findAllByRole('button');

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

    describe('with an attachment', () => {
      beforeEach(async () => {
        mocks = [
          {
            request: {
              query: VIEW_TRANSACTION,
              variables: {
                companyId: 'company-id',
                transactionId: 'transaction-id',
              },
            },
            result: {
              data: {
                getClients: {
                  id: 'company-id',
                  items: [],
                },
                getSettings: {
                  categories: [
                    {
                      name: 'Equipment',
                      vatRate: 20,
                    },
                    {
                      name: 'Accommodation',
                      vatRate: 20,
                    },
                  ],
                  id: 'company-id',
                  vat: {
                    pay: 20,
                  },
                },
                getTransaction: {
                  amount: -999.99,
                  attachment: 'path/to/attachment.pdf',
                  category: 'Equipment',
                  companyId: 'company-id',
                  date: '2020-05-07T10:58:17.000Z',
                  description: 'Laptop',
                  id: 'transaction-id',
                  name: 'Apple',
                  refund: false,
                  scheduled: false,
                  status: 'confirmed',
                  vat: 166.67,
                },
                getTypeahead: {
                  id: 'company-id',
                  purchases: ['Test purchase 1', 'Test purchase 2'],
                  sales: ['Test sale 1', 'Test sale 2'],
                  suppliers: ['Test suppliers 1', 'Test suppliers 2'],
                },
              },
            },
          },
          {
            request: {
              query: UPDATE_TRANSACTION,
              variables: {
                input: {
                  amount: -999.99,
                  attachment: 'path/to/attachment.pdf',
                  category: 'Equipment',
                  companyId: 'company-id',
                  date: '2020-05-07T10:58:17.000Z',
                  description: 'Laptop',
                  id: 'transaction-id',
                  name: 'Apple',
                  refund: false,
                  scheduled: false,
                  status: 'confirmed',
                  vat: 166.67,
                },
              },
            },
            result: {
              data: {
                updateTransaction: {
                  __typename: 'Transaction',
                  amount: -999.99,
                  attachment: 'path/to/attachment.pdf',
                  category: 'Equipment',
                  companyId: 'company-id',
                  date: '2020-05-07T10:58:17.000Z',
                  description: 'Laptop',
                  id: 'transaction-id',
                  name: 'Apple',
                  refund: false,
                  scheduled: false,
                  status: 'confirmed',
                  vat: 166.67,
                },
              },
            },
          },
          {
            request: {
              query: DELETE_FILE,
              variables: {
                id: 'company-id',
                path: 'path/to/attachment.pdf',
              },
            },
            result: {
              data: {
                deleteFile: {
                  path: 'path/to/attachment.pdf',
                },
              },
            },
          },
          {
            request: {
              query: REQUEST_DOWNLOAD,
              variables: {
                id: 'company-id',
                path: 'path/to/attachment.pdf',
              },
            },
            result: {
              data: {
                requestDownload: {
                  url: 'https://download.url',
                },
              },
            },
          },
        ];

        await act(async () => {
          render(
            <TestProvider
              path="/accounts/:companyId/view-transaction/:transactionId"
              history={history}
            >
              <MockedProvider mocks={mocks}>
                <ViewTransaction />
              </MockedProvider>
            </TestProvider>,
          );

          await waitForApollo(0);
        });
      });

      it('should remove download attachment', async () => {
        const deleteButton = await screen.findByText(
          'transaction-form.upload.delete-file',
        );

        await waitFor(() => expect(deleteButton).not.toBeDisabled());

        await act(async () => {
          fireEvent.click(deleteButton);

          await waitForApollo(0);
        });

        await expect(
          screen.findByLabelText('transaction-form.upload.upload.label'),
        ).resolves.toBeInTheDocument();
      });

      it('should display success toast when attachment is removed', async () => {
        const deleteButton = await screen.findByText(
          'transaction-form.upload.delete-file',
        );

        await waitFor(() => expect(deleteButton).not.toBeDisabled());

        await act(async () => {
          fireEvent.click(deleteButton);

          await waitForApollo(0);
        });

        await waitFor(() =>
          expect(add).toHaveBeenCalledWith({
            colour: 'success',
            message: 'uploads.delete.success',
          }),
        );
      });

      it('should download the attachment', async () => {
        const downloadButton = await screen.findByText(
          'transaction-form.upload.download-file',
        );

        await act(async () => {
          fireEvent.click(downloadButton);

          await waitForApollo(0);
        });

        await waitFor(() =>
          expect(saveAs).toHaveBeenCalledWith('success', 'attachment.pdf'),
        );
      });

      it('should display a success toast when attachment is downloaded', async () => {
        const downloadButton = await screen.findByText(
          'transaction-form.upload.download-file',
        );

        await act(async () => {
          fireEvent.click(downloadButton);

          await waitForApollo(0);
        });

        await waitFor(() =>
          expect(add).toHaveBeenCalledWith({
            colour: 'success',
            message: 'uploads.download.success',
          }),
        );
      });

      it('should display an error toast if file fails to download', async () => {
        (axios.request as jest.Mock).mockRejectedValueOnce({
          data: 'fail',
          isAxiosError: true,
        });

        const downloadButton = await screen.findByText(
          'transaction-form.upload.download-file',
        );

        await act(async () => {
          fireEvent.click(downloadButton);

          await waitForApollo(0);

          await waitForApollo(0);
        });

        await waitFor(() =>
          expect(add).toHaveBeenCalledWith({
            colour: 'danger',
            message: 'uploads.download.error',
          }),
        );
      });
    });
  });

  describe('sale', () => {
    describe('when data is returned', () => {
      beforeEach(async () => {
        mocks = [
          {
            request: {
              query: GET_BALANCE,
              variables: {
                id: 'company-id',
              },
            },
            result: {
              data: {
                getBalance: {
                  balance: 180,
                  currency: 'GBP',
                  id: 'company-id',
                  transactions: [
                    {
                      balance: 180,
                      currency: 'GBP',
                      date: '2020-04-15T14:07:18.000Z',
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
                      date: '2020-04-13T14:07:18.000Z',
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
          {
            request: {
              query: VIEW_TRANSACTION,
              variables: {
                companyId: 'company-id',
                transactionId: 'transaction-id',
              },
            },
            result: {
              data: {
                getClients: {
                  id: 'company-id',
                  items: [
                    {
                      id: 'client-id',
                      name: 'Motech Development',
                    },
                  ],
                },
                getSettings: {
                  categories: [
                    {
                      name: 'Equipment',
                      vatRate: 20,
                    },
                    {
                      name: 'Accommodation',
                      vatRate: 20,
                    },
                  ],
                  id: 'company-id',
                  vat: {
                    pay: 20,
                  },
                },
                getTransaction: {
                  amount: 999.99,
                  attachment: 'path/to/attachment.pdf',
                  category: 'Sales',
                  companyId: 'company-id',
                  date: '2020-05-07T10:58:17.000Z',
                  description: 'Invoice #1',
                  id: 'transaction-id',
                  name: 'Motech Development',
                  refund: null,
                  scheduled: null,
                  status: 'confirmed',
                  vat: 200,
                },
                getTypeahead: {
                  id: 'company-id',
                  purchases: ['Test purchase 1', 'Test purchase 2'],
                  sales: ['Test sale 1', 'Test sale 2'],
                  suppliers: ['Test suppliers 1', 'Test suppliers 2'],
                },
              },
            },
          },
          {
            request: {
              query: UPDATE_TRANSACTION,
              variables: {
                input: {
                  amount: 999.99,
                  attachment: 'path/to/attachment.pdf',
                  category: 'Sales',
                  companyId: 'company-id',
                  date: '2020-05-07T10:58:17.000Z',
                  description: 'Invoice #1',
                  id: 'transaction-id',
                  name: 'Motech Development',
                  refund: false,
                  scheduled: false,
                  status: 'confirmed',
                  vat: 200,
                },
              },
            },
            result: {
              data: {
                updateTransaction: {
                  __typename: 'Transaction',
                  amount: 999.99,
                  attachment: 'path/to/attachment.pdf',
                  category: 'Sales',
                  companyId: 'company-id',
                  date: '2020-05-07T10:58:17.000Z',
                  description: 'Invoice #1',
                  id: 'transaction-id',
                  name: 'Motech Development',
                  refund: false,
                  scheduled: false,
                  status: 'confirmed',
                  vat: 200,
                },
              },
            },
          },
          {
            error: new Error(),
            request: {
              query: DELETE_TRANSACTION,
              variables: {
                id: 'transaction-id',
              },
            },
          },
          {
            error: new Error(),
            request: {
              query: REQUEST_DOWNLOAD,
              variables: {
                id: 'company-id',
                path: 'path/to/attachment.pdf',
              },
            },
          },
          {
            error: new Error(),
            request: {
              query: DELETE_FILE,
              variables: {
                id: 'company-id',
                path: 'path/to/attachment.pdf',
              },
            },
          },
        ];

        await act(async () => {
          render(
            <TestProvider
              path="/accounts/:companyId/view-transaction/:transactionId"
              history={history}
            >
              <MockedProvider mocks={mocks}>
                <ViewTransaction />
              </MockedProvider>
            </TestProvider>,
          );

          await waitForApollo(0);
        });
      });

      it('should redirect you back to accounts page on complete', async () => {
        await screen.findByText('view-transaction.title');

        await act(async () => {
          const [, , , button] = await screen.findAllByRole('button');

          fireEvent.click(button);

          await waitForApollo(0);
        });

        await expect(
          screen.findByTestId('/my-companies/accounts/company-id'),
        ).resolves.toBeInTheDocument();
      });

      it('should display a success toast', async () => {
        await screen.findByText('view-transaction.title');

        await act(async () => {
          const [, , , button] = await screen.findAllByRole('button');

          fireEvent.click(button);

          await waitForApollo(0);
        });

        await waitFor(() =>
          expect(add).toHaveBeenCalledWith({
            colour: 'success',
            message: 'view-transaction.success',
          }),
        );
      });

      it('should display an error toast when deleting a transaction', async () => {
        await screen.findByText('view-transaction.title');

        await act(async () => {
          const [, , , , button] = await screen.findAllByRole('button');

          fireEvent.click(button);
        });

        await act(async () => {
          const input = await screen.findByLabelText('confirm-delete');

          fireEvent.change(input, {
            target: {
              focus: () => {},
              value: 'Motech Development',
            },
          });
        });

        await act(async () => {
          const [, , , , , , deleteButton] = await screen.findAllByRole(
            'button',
          );

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

      it('should display an error toast if file fails to download', async () => {
        const downloadButton = await screen.findByText(
          'transaction-form.upload.download-file',
        );

        await act(async () => {
          fireEvent.click(downloadButton);

          await waitForApollo(0);

          await waitForApollo(0);
        });

        await waitFor(() =>
          expect(add).toHaveBeenCalledWith({
            colour: 'danger',
            message: 'uploads.download.error',
          }),
        );
      });

      it('should display an error toast if file fails to delete', async () => {
        const deleteButton = await screen.findByText(
          'transaction-form.upload.delete-file',
        );

        await waitFor(() => expect(deleteButton).not.toBeDisabled());

        await act(async () => {
          fireEvent.click(deleteButton);

          await waitForApollo(0);
        });

        await waitFor(() =>
          expect(add).toHaveBeenCalledWith({
            colour: 'danger',
            message: 'uploads.delete.error',
          }),
        );
      });
    });

    describe('when data is not returned', () => {
      beforeEach(async () => {
        mocks = [
          {
            request: {
              query: GET_BALANCE,
              variables: {
                id: 'company-id',
              },
            },
            result: {
              data: {
                getBalance: {
                  balance: 180,
                  currency: 'GBP',
                  id: 'company-id',
                  transactions: [
                    {
                      balance: 180,
                      currency: 'GBP',
                      date: '2020-04-15T14:07:18.000Z',
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
                      date: '2020-04-13T14:07:18.000Z',
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
          {
            request: {
              query: VIEW_TRANSACTION,
              variables: {
                companyId: 'company-id',
                transactionId: 'transaction-id',
              },
            },
            result: {
              data: {
                getClients: {
                  id: 'company-id',
                  items: [
                    {
                      id: 'client-id',
                      name: 'Motech Development',
                    },
                  ],
                },
                getSettings: {
                  categories: [
                    {
                      name: 'Equipment',
                      vatRate: 20,
                    },
                    {
                      name: 'Accommodation',
                      vatRate: 20,
                    },
                  ],
                  id: 'company-id',
                  vat: {
                    pay: 20,
                  },
                },
                getTransaction: {
                  amount: 999.99,
                  attachment: 'path/to/attachment.pdf',
                  category: 'Sales',
                  companyId: 'company-id',
                  date: '2020-05-07T10:58:17.000Z',
                  description: 'Invoice #1',
                  id: 'transaction-id',
                  name: 'Motech Development',
                  refund: null,
                  scheduled: null,
                  status: 'confirmed',
                  vat: 200,
                },
                getTypeahead: {
                  id: 'company-id',
                  purchases: ['Test purchase 1', 'Test purchase 2'],
                  sales: ['Test sale 1', 'Test sale 2'],
                  suppliers: ['Test suppliers 1', 'Test suppliers 2'],
                },
              },
            },
          },
          {
            request: {
              query: UPDATE_TRANSACTION,
              variables: {
                input: {
                  amount: 999.99,
                  attachment: 'path/to/attachment.pdf',
                  category: 'Sales',
                  companyId: 'company-id',
                  date: '2020-05-07T10:58:17.000Z',
                  description: 'Invoice #1',
                  id: 'transaction-id',
                  name: 'Motech Development',
                  refund: false,
                  scheduled: false,
                  status: 'confirmed',
                  vat: 200,
                },
              },
            },
            result: {
              data: {
                updateTransaction: null,
              },
            },
          },
          {
            request: {
              query: DELETE_TRANSACTION,
              variables: {
                id: 'transaction-id',
              },
            },
            result: {
              data: {
                deleteTransaction: null,
              },
            },
          },
          {
            request: {
              query: REQUEST_DOWNLOAD,
              variables: {
                id: 'company-id',
                path: 'path/to/attachment.pdf',
              },
            },
            result: {
              data: {
                requestDownload: {
                  url: null,
                },
              },
            },
          },
        ];

        await act(async () => {
          render(
            <TestProvider
              path="/accounts/:companyId/view-transaction/:transactionId"
              history={history}
            >
              <MockedProvider mocks={mocks}>
                <ViewTransaction />
              </MockedProvider>
            </TestProvider>,
          );

          await waitForApollo(0);
        });
      });

      it('should display a warning toast when a transaction is updated', async () => {
        await screen.findByText('view-transaction.title');

        await act(async () => {
          const [, , , button] = await screen.findAllByRole('button');

          fireEvent.click(button);

          await waitForApollo(0);
        });

        await waitFor(() =>
          expect(add).toHaveBeenCalledWith({
            colour: 'danger',
            message: 'view-transaction.retry',
          }),
        );
      });

      it('should redirect you back to accounts page when a transaction is updated', async () => {
        await screen.findByText('view-transaction.title');

        await act(async () => {
          const [, , , button] = await screen.findAllByRole('button');

          fireEvent.click(button);

          await waitForApollo(0);
        });

        await expect(
          screen.findByTestId('/my-companies/accounts/company-id'),
        ).resolves.toBeInTheDocument();
      });

      it('should display a warning toast when a transaction is deleted', async () => {
        await screen.findByText('view-transaction.title');

        await act(async () => {
          const [, , , , button] = await screen.findAllByRole('button');

          fireEvent.click(button);
        });

        await act(async () => {
          const input = await screen.findByLabelText('confirm-delete');

          fireEvent.change(input, {
            target: {
              focus: () => {},
              value: 'Motech Development',
            },
          });
        });

        await act(async () => {
          const [, , , , , , deleteButton] = await screen.findAllByRole(
            'button',
          );

          await waitFor(() => expect(deleteButton).not.toBeDisabled());

          fireEvent.click(deleteButton);

          await waitForApollo(0);
        });

        await waitFor(() =>
          expect(add).toHaveBeenCalledWith({
            colour: 'danger',
            message: 'delete-transaction.retry',
          }),
        );
      });

      it('should redirect you back to accounts page when a transaction is deleted', async () => {
        await screen.findByText('view-transaction.title');

        await act(async () => {
          const [, , , , button] = await screen.findAllByRole('button');

          fireEvent.click(button);
        });

        await act(async () => {
          const input = await screen.findByLabelText('confirm-delete');

          fireEvent.change(input, {
            target: {
              focus: () => {},
              value: 'Motech Development',
            },
          });
        });

        await act(async () => {
          const [, , , , , , deleteButton] = await screen.findAllByRole(
            'button',
          );

          await waitFor(() => expect(deleteButton).not.toBeDisabled());

          fireEvent.click(deleteButton);

          await waitForApollo(0);
        });

        await expect(
          screen.findByTestId('/my-companies/accounts/company-id'),
        ).resolves.toBeInTheDocument();
      });

      it('should display an error toast if file fails to delete', async () => {
        const downloadButton = await screen.findByText(
          'transaction-form.upload.download-file',
        );

        await act(async () => {
          fireEvent.click(downloadButton);

          await waitForApollo(0);
        });

        await waitFor(() =>
          expect(add).toHaveBeenCalledWith({
            colour: 'danger',
            message: 'uploads.download.retry',
          }),
        );
      });
    });
  });
});
