import { ApolloCache, InMemoryCache } from '@apollo/client';
import { MockedProvider, MockedResponse } from '@apollo/client/testing';
import { waitForApollo } from '@motech-development/appsync-apollo';
import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
} from '@testing-library/react';
import axios from 'axios';
import { advanceTo, clear } from 'jest-date-mock';
import { gql } from '../../../../graphql';
import {
  AddTransactionMutation,
  Balance,
  Transactions,
  TransactionStatus,
  Typeahead,
} from '../../../../graphql/graphql';
import TestProvider, { add } from '../../../../utils/TestProvider';
import { GET_BALANCE } from '../Accounts';
import { GET_TRANSACTIONS } from '../PendingTransactions';
import RecordTransaction, {
  ADD_TRANSACTION,
  RECORD_TRANSACTION,
  update,
} from '../RecordTransaction';
import { REQUEST_UPLOAD } from '../shared/UploadAttachment';

const GET_TYPEAHEAD = gql(/* GraphQL */ `
  query GetTypeahead($id: ID!) {
    getTypeahead(id: $id) {
      id
      purchases
      sales
      suppliers
    }
  }
`);

jest.mock('pdfjs-dist/build/pdf.worker.min.mjs?url', () => 'service-worker', {
  virtual: true,
});

describe('RecordTransaction', () => {
  let history: string[];
  let mocks: MockedResponse[];
  let upload: File;

  beforeAll(() => {
    advanceTo('2020-05-07T11:58:17+01:00');
  });

  beforeEach(() => {
    history = ['/accounts/company-id/record-transaction'];

    upload = new File(['dummy content'], 'invoice.PDF', {
      type: 'application/pdf',
    });

    axios.request = jest.fn().mockResolvedValue({
      data: 'success',
    });
  });

  afterAll(() => {
    clear();
  });

  describe('purchase', () => {
    describe('is not a refund', () => {
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
                query: RECORD_TRANSACTION,
                variables: {
                  id: 'company-id',
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
                    ],
                    id: 'company-id',
                    vat: {
                      pay: 20,
                    },
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
                query: ADD_TRANSACTION,
                variables: {
                  input: {
                    amount: -999.99,
                    attachment: 'company-id/test-id.pdf',
                    category: 'Equipment',
                    companyId: 'company-id',
                    date: '2020-05-07T10:58:17.000Z',
                    description: 'Laptop',
                    id: '',
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
                  addTransaction: {
                    amount: -999.99,
                    attachment: 'company-id/test-id.pdf',
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
                query: REQUEST_UPLOAD,
                variables: {
                  id: 'company-id',
                  input: {
                    contentType: 'application/pdf',
                    extension: 'pdf',
                    metadata: {
                      typename: 'Transaction',
                    },
                  },
                },
              },
              result: {
                data: {
                  requestUpload: {
                    id: 'test-id',
                    url: 'https://temp-upload.url/',
                  },
                },
              },
            },
          ];

          await act(async () => {
            render(
              <TestProvider
                path="/accounts/:companyId/record-transaction"
                history={history}
              >
                <MockedProvider mocks={mocks}>
                  <RecordTransaction />
                </MockedProvider>
              </TestProvider>,
            );

            await waitForApollo(0);
          });
        });

        it('should redirect you back to accounts page on complete', async () => {
          const transactionType = await screen.findByLabelText(
            'transaction-form.transaction-details.transaction.options.purchase',
          );

          fireEvent.click(transactionType);

          const supplier = await screen.findByLabelText(
            'transaction-form.transaction-details.name.label',
          );
          const description = await screen.findByLabelText(
            'transaction-form.transaction-details.description.label',
          );
          const status = await screen.findByLabelText(
            'transaction-form.transaction-amount.status.options.confirmed',
          );
          const category = await screen.findByLabelText(
            'transaction-form.transaction-amount.category.label',
          );
          const amount = await screen.findByLabelText(
            'transaction-form.transaction-amount.amount.label',
          );
          const fileUpload = await screen.findByLabelText(
            'transaction-form.upload.upload.label',
          );

          await act(async () => {
            fireEvent.change(supplier, {
              target: {
                focus: () => {},
                value: 'Apple',
              },
            });

            fireEvent.change(description, {
              target: {
                focus: () => {},
                value: 'Laptop',
              },
            });

            fireEvent.click(status);

            fireEvent.change(category, {
              target: {
                value: 0,
              },
            });

            fireEvent.change(amount, {
              target: {
                focus: () => {},
                value: '999.99',
              },
            });

            fireEvent.change(fileUpload, {
              target: {
                files: [upload],
              },
            });

            await Promise.resolve();
          });

          const [, , , button] = await screen.findAllByRole('button');

          await waitFor(() => expect(button).not.toBeDisabled());

          await act(async () => {
            fireEvent.click(button);

            await waitForApollo(0);
          });

          await expect(
            screen.findByTestId('/my-companies/accounts/company-id'),
          ).resolves.toBeInTheDocument();
        });

        it('should display a success toast when transaction is added', async () => {
          const transactionType = await screen.findByLabelText(
            'transaction-form.transaction-details.transaction.options.purchase',
          );

          fireEvent.click(transactionType);

          const supplier = await screen.findByLabelText(
            'transaction-form.transaction-details.name.label',
          );
          const description = await screen.findByLabelText(
            'transaction-form.transaction-details.description.label',
          );
          const status = await screen.findByLabelText(
            'transaction-form.transaction-amount.status.options.confirmed',
          );
          const category = await screen.findByLabelText(
            'transaction-form.transaction-amount.category.label',
          );
          const amount = await screen.findByLabelText(
            'transaction-form.transaction-amount.amount.label',
          );
          const fileUpload = await screen.findByLabelText(
            'transaction-form.upload.upload.label',
          );

          await act(async () => {
            fireEvent.change(supplier, {
              target: {
                focus: () => {},
                value: 'Apple',
              },
            });

            fireEvent.change(description, {
              target: {
                focus: () => {},
                value: 'Laptop',
              },
            });

            fireEvent.click(status);

            fireEvent.change(category, {
              target: {
                value: 0,
              },
            });

            fireEvent.change(amount, {
              target: {
                focus: () => {},
                value: '999.99',
              },
            });

            fireEvent.change(fileUpload, {
              target: {
                files: [upload],
              },
            });

            await Promise.resolve();
          });

          const [, , , button] = await screen.findAllByRole('button');

          await waitFor(() => expect(button).not.toBeDisabled());

          await act(async () => {
            fireEvent.click(button);

            await waitForApollo(0);
          });

          await waitFor(() =>
            expect(add).toHaveBeenCalledWith({
              colour: 'success',
              message: 'record-transaction.success',
            }),
          );
        });

        it('should display an success toast if upload is successful', async () => {
          const transactionType = await screen.findByLabelText(
            'transaction-form.transaction-details.transaction.options.purchase',
          );

          fireEvent.click(transactionType);

          const supplier = await screen.findByLabelText(
            'transaction-form.transaction-details.name.label',
          );
          const description = await screen.findByLabelText(
            'transaction-form.transaction-details.description.label',
          );
          const status = await screen.findByLabelText(
            'transaction-form.transaction-amount.status.options.confirmed',
          );
          const category = await screen.findByLabelText(
            'transaction-form.transaction-amount.category.label',
          );
          const amount = await screen.findByLabelText(
            'transaction-form.transaction-amount.amount.label',
          );
          const fileUpload = await screen.findByLabelText(
            'transaction-form.upload.upload.label',
          );

          await act(async () => {
            fireEvent.change(supplier, {
              target: {
                focus: () => {},
                value: 'Apple',
              },
            });

            fireEvent.change(description, {
              target: {
                focus: () => {},
                value: 'Laptop',
              },
            });

            fireEvent.click(status);

            fireEvent.change(category, {
              target: {
                value: 0,
              },
            });

            fireEvent.change(amount, {
              target: {
                focus: () => {},
                value: '999.99',
              },
            });

            fireEvent.change(fileUpload, {
              target: {
                files: [upload],
              },
            });

            await Promise.resolve();
          });

          await waitFor(() =>
            expect(add).toHaveBeenCalledWith({
              colour: 'success',
              message: 'uploads.add.success',
            }),
          );
        });

        it('should display an error toast if upload is unsuccessful', async () => {
          (axios.request as jest.Mock).mockRejectedValueOnce({
            data: 'fail',
            isAxiosError: true,
          });

          const transactionType = await screen.findByLabelText(
            'transaction-form.transaction-details.transaction.options.purchase',
          );

          fireEvent.click(transactionType);

          const supplier = await screen.findByLabelText(
            'transaction-form.transaction-details.name.label',
          );
          const description = await screen.findByLabelText(
            'transaction-form.transaction-details.description.label',
          );
          const status = await screen.findByLabelText(
            'transaction-form.transaction-amount.status.options.confirmed',
          );
          const category = await screen.findByLabelText(
            'transaction-form.transaction-amount.category.label',
          );
          const amount = await screen.findByLabelText(
            'transaction-form.transaction-amount.amount.label',
          );
          const fileUpload = await screen.findByLabelText(
            'transaction-form.upload.upload.label',
          );

          await act(async () => {
            fireEvent.change(supplier, {
              target: {
                focus: () => {},
                value: 'Apple',
              },
            });

            fireEvent.change(description, {
              target: {
                focus: () => {},
                value: 'Laptop',
              },
            });

            fireEvent.click(status);

            fireEvent.change(category, {
              target: {
                value: 0,
              },
            });

            fireEvent.change(amount, {
              target: {
                focus: () => {},
                value: '999.99',
              },
            });

            fireEvent.change(fileUpload, {
              target: {
                files: [upload],
              },
            });

            await Promise.resolve();
          });

          await waitFor(() =>
            expect(add).toHaveBeenCalledWith({
              colour: 'danger',
              message: 'uploads.add.error',
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
                query: RECORD_TRANSACTION,
                variables: {
                  id: 'company-id',
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
                    ],
                    id: 'company-id',
                    vat: {
                      pay: 20,
                    },
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
                query: ADD_TRANSACTION,
                variables: {
                  input: {
                    amount: -999.99,
                    attachment: '',
                    category: 'Equipment',
                    companyId: 'company-id',
                    date: '2020-05-07T10:58:17.000Z',
                    description: 'Laptop',
                    id: '',
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
                  addTransaction: null,
                },
              },
            },
            {
              request: {
                query: REQUEST_UPLOAD,
                variables: {
                  id: 'company-id',
                  input: {
                    contentType: 'application/pdf',
                    extension: 'pdf',
                    metadata: {
                      typename: 'Transaction',
                    },
                  },
                },
              },
              result: {
                data: {
                  requestUpload: null,
                },
              },
            },
          ];

          await act(async () => {
            render(
              <TestProvider
                path="/accounts/:companyId/record-transaction"
                history={history}
              >
                <MockedProvider mocks={mocks}>
                  <RecordTransaction />
                </MockedProvider>
              </TestProvider>,
            );

            await waitForApollo(0);
          });
        });

        it('should display a warning toast', async () => {
          const transactionType = await screen.findByLabelText(
            'transaction-form.transaction-details.transaction.options.purchase',
          );

          fireEvent.click(transactionType);

          const supplier = await screen.findByLabelText(
            'transaction-form.transaction-details.name.label',
          );
          const description = await screen.findByLabelText(
            'transaction-form.transaction-details.description.label',
          );
          const status = await screen.findByLabelText(
            'transaction-form.transaction-amount.status.options.confirmed',
          );
          const category = await screen.findByLabelText(
            'transaction-form.transaction-amount.category.label',
          );
          const amount = await screen.findByLabelText(
            'transaction-form.transaction-amount.amount.label',
          );

          await act(async () => {
            fireEvent.change(supplier, {
              target: {
                focus: () => {},
                value: 'Apple',
              },
            });

            fireEvent.change(description, {
              target: {
                focus: () => {},
                value: 'Laptop',
              },
            });

            fireEvent.click(status);

            fireEvent.change(category, {
              target: {
                value: 0,
              },
            });

            fireEvent.change(amount, {
              target: {
                focus: () => {},
                value: '999.99',
              },
            });

            await Promise.resolve();
          });

          const [, , button] = await screen.findAllByRole('button');

          await waitFor(() => expect(button).not.toBeDisabled());

          await act(async () => {
            fireEvent.click(button);

            await waitForApollo(0);
          });

          await waitFor(() =>
            expect(add).toHaveBeenCalledWith({
              colour: 'danger',
              message: 'record-transaction.retry',
            }),
          );
        });

        it('should redirect you back to accounts page', async () => {
          const transactionType = await screen.findByLabelText(
            'transaction-form.transaction-details.transaction.options.purchase',
          );

          fireEvent.click(transactionType);

          const supplier = await screen.findByLabelText(
            'transaction-form.transaction-details.name.label',
          );
          const description = await screen.findByLabelText(
            'transaction-form.transaction-details.description.label',
          );
          const status = await screen.findByLabelText(
            'transaction-form.transaction-amount.status.options.confirmed',
          );
          const category = await screen.findByLabelText(
            'transaction-form.transaction-amount.category.label',
          );
          const amount = await screen.findByLabelText(
            'transaction-form.transaction-amount.amount.label',
          );

          await act(async () => {
            fireEvent.change(supplier, {
              target: {
                focus: () => {},
                value: 'Apple',
              },
            });

            fireEvent.change(description, {
              target: {
                focus: () => {},
                value: 'Laptop',
              },
            });

            fireEvent.click(status);

            fireEvent.change(category, {
              target: {
                value: 0,
              },
            });

            fireEvent.change(amount, {
              target: {
                focus: () => {},
                value: '999.99',
              },
            });

            await Promise.resolve();
          });

          const [, , button] = await screen.findAllByRole('button');

          await waitFor(() => expect(button).not.toBeDisabled());

          await act(async () => {
            fireEvent.click(button);

            await waitForApollo(0);
          });

          await expect(
            screen.findByTestId('/my-companies/accounts/company-id'),
          ).resolves.toBeInTheDocument();
        });

        it('should do nothing when uploading an attachment', async () => {
          const transactionType = await screen.findByLabelText(
            'transaction-form.transaction-details.transaction.options.purchase',
          );

          fireEvent.click(transactionType);

          const supplier = await screen.findByLabelText(
            'transaction-form.transaction-details.name.label',
          );
          const description = await screen.findByLabelText(
            'transaction-form.transaction-details.description.label',
          );
          const status = await screen.findByLabelText(
            'transaction-form.transaction-amount.status.options.confirmed',
          );
          const category = await screen.findByLabelText(
            'transaction-form.transaction-amount.category.label',
          );
          const amount = await screen.findByLabelText(
            'transaction-form.transaction-amount.amount.label',
          );
          const fileUpload = await screen.findByLabelText(
            'transaction-form.upload.upload.label',
          );

          await act(async () => {
            fireEvent.change(supplier, {
              target: {
                focus: () => {},
                value: 'Apple',
              },
            });

            fireEvent.change(description, {
              target: {
                focus: () => {},
                value: 'Laptop',
              },
            });

            fireEvent.click(status);

            fireEvent.change(category, {
              target: {
                value: 0,
              },
            });

            fireEvent.change(amount, {
              target: {
                focus: () => {},
                value: '999.99',
              },
            });

            fireEvent.change(fileUpload, {
              target: {
                files: [upload],
              },
            });

            await Promise.resolve();
          });

          await waitFor(() =>
            expect(add).toHaveBeenCalledWith({
              colour: 'danger',
              message: 'uploads.add.retry',
            }),
          );
        });
      });
    });

    describe('is a refund', () => {
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
              query: RECORD_TRANSACTION,
              variables: {
                id: 'company-id',
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
                  ],
                  id: 'company-id',
                  vat: {
                    pay: 20,
                  },
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
              query: ADD_TRANSACTION,
              variables: {
                input: {
                  amount: 999.99,
                  attachment: '',
                  category: 'Equipment',
                  companyId: 'company-id',
                  date: '2020-05-07T10:58:17.000Z',
                  description: 'Laptop',
                  id: '',
                  name: 'Apple',
                  refund: true,
                  scheduled: false,
                  status: 'confirmed',
                  vat: -166.67,
                },
              },
            },
            result: {
              data: {
                addTransaction: {
                  amount: 999.99,
                  attachment: '',
                  category: 'Equipment',
                  companyId: 'company-id',
                  date: '2020-05-07T10:58:17.000Z',
                  description: 'Laptop',
                  id: 'transaction-id',
                  name: 'Apple',
                  refund: true,
                  scheduled: false,
                  status: 'confirmed',
                  vat: -166.67,
                },
              },
            },
          },
        ];

        await act(async () => {
          render(
            <TestProvider
              path="/accounts/:companyId/record-transaction"
              history={history}
            >
              <MockedProvider mocks={mocks}>
                <RecordTransaction />
              </MockedProvider>
            </TestProvider>,
          );

          await waitForApollo(0);
        });
      });

      it('should redirect you back to accounts page on complete', async () => {
        const transactionType = await screen.findByLabelText(
          'transaction-form.transaction-details.transaction.options.purchase',
        );

        fireEvent.click(transactionType);

        const supplier = await screen.findByLabelText(
          'transaction-form.transaction-details.name.label',
        );
        const description = await screen.findByLabelText(
          'transaction-form.transaction-details.description.label',
        );
        const status = await screen.findByLabelText(
          'transaction-form.transaction-amount.status.options.confirmed',
        );
        const refund = await screen.findByLabelText(
          'transaction-form.transaction-amount.refund.options.yes',
        );
        const category = await screen.findByLabelText(
          'transaction-form.transaction-amount.category.label',
        );
        const amount = await screen.findByLabelText(
          'transaction-form.transaction-amount.amount.label',
        );

        await act(async () => {
          fireEvent.change(supplier, {
            target: {
              focus: () => {},
              value: 'Apple',
            },
          });

          fireEvent.change(description, {
            target: {
              focus: () => {},
              value: 'Laptop',
            },
          });

          fireEvent.click(status);

          fireEvent.click(refund);

          fireEvent.change(category, {
            target: {
              value: 0,
            },
          });

          fireEvent.change(amount, {
            target: {
              focus: () => {},
              value: '999.99',
            },
          });

          await Promise.resolve();
        });

        const [, , button] = await screen.findAllByRole('button');

        await waitFor(() => expect(button).not.toBeDisabled());

        await act(async () => {
          fireEvent.click(button);

          await waitForApollo(0);
        });

        await expect(
          screen.findByTestId('/my-companies/accounts/company-id'),
        ).resolves.toBeInTheDocument();
      });

      it('should display a success toast when transaction is added', async () => {
        const transactionType = await screen.findByLabelText(
          'transaction-form.transaction-details.transaction.options.purchase',
        );

        fireEvent.click(transactionType);

        const supplier = await screen.findByLabelText(
          'transaction-form.transaction-details.name.label',
        );
        const description = await screen.findByLabelText(
          'transaction-form.transaction-details.description.label',
        );
        const status = await screen.findByLabelText(
          'transaction-form.transaction-amount.status.options.confirmed',
        );
        const refund = await screen.findByLabelText(
          'transaction-form.transaction-amount.refund.options.yes',
        );
        const category = await screen.findByLabelText(
          'transaction-form.transaction-amount.category.label',
        );
        const amount = await screen.findByLabelText(
          'transaction-form.transaction-amount.amount.label',
        );

        await act(async () => {
          fireEvent.change(supplier, {
            target: {
              focus: () => {},
              value: 'Apple',
            },
          });

          fireEvent.change(description, {
            target: {
              focus: () => {},
              value: 'Laptop',
            },
          });

          fireEvent.click(status);

          fireEvent.click(refund);

          fireEvent.change(category, {
            target: {
              value: 0,
            },
          });

          fireEvent.change(amount, {
            target: {
              focus: () => {},
              value: '999.99',
            },
          });

          await Promise.resolve();
        });

        const [, , button] = await screen.findAllByRole('button');

        await waitFor(() => expect(button).not.toBeDisabled());

        await act(async () => {
          fireEvent.click(button);

          await waitForApollo(0);
        });

        await waitFor(() =>
          expect(add).toHaveBeenCalledWith({
            colour: 'success',
            message: 'record-transaction.success',
          }),
        );
      });
    });
  });

  describe('sale', () => {
    describe('is not a refund', () => {
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
              query: RECORD_TRANSACTION,
              variables: {
                id: 'company-id',
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
                  ],
                  id: 'company-id',
                  vat: {
                    pay: 20,
                  },
                },
                getTypeahead: {
                  id: 'company-id',
                  purchases: null,
                  sales: null,
                  suppliers: null,
                },
              },
            },
          },
          {
            request: {
              query: ADD_TRANSACTION,
              variables: {
                input: {
                  amount: 999.99,
                  attachment: '',
                  category: 'Sales',
                  companyId: 'company-id',
                  date: '2020-05-07T10:58:17.000Z',
                  description: 'Invoice #1',
                  id: '',
                  name: 'Motech Development',
                  refund: false,
                  scheduled: true,
                  status: 'pending',
                  vat: 200,
                },
              },
            },
            result: {
              data: {
                addTransaction: {
                  amount: 999.99,
                  attachment: '',
                  category: 'Sales',
                  companyId: 'company-id',
                  date: '2020-05-07T10:58:17.000Z',
                  description: 'Invoice #1',
                  id: 'transaction-id',
                  name: 'Motech Development',
                  refund: false,
                  scheduled: true,
                  status: 'pending',
                  vat: 200,
                },
              },
            },
          },
          {
            error: new Error(),
            request: {
              query: REQUEST_UPLOAD,
              variables: {
                id: 'company-id',
                input: {
                  contentType: 'application/pdf',
                  extension: 'pdf',
                  metadata: {
                    typename: 'Transaction',
                  },
                },
              },
            },
          },
        ];

        await act(async () => {
          render(
            <TestProvider
              path="/accounts/:companyId/record-transaction"
              history={history}
            >
              <MockedProvider mocks={mocks}>
                <RecordTransaction />
              </MockedProvider>
            </TestProvider>,
          );

          await waitForApollo(0);
        });
      });

      it('should redirect you back to accounts page on complete', async () => {
        const transactionType = await screen.findByLabelText(
          'transaction-form.transaction-details.transaction.options.sale',
        );

        fireEvent.click(transactionType);

        const supplier = await screen.findByLabelText(
          'transaction-form.transaction-details.name.label',
        );
        const description = await screen.findByLabelText(
          'transaction-form.transaction-details.description.label',
        );
        const status = await screen.findByLabelText(
          'transaction-form.transaction-amount.status.options.pending',
        );

        act(() => {
          fireEvent.change(supplier, {
            target: {
              focus: () => {},
              value: 'Motech Development',
            },
          });

          fireEvent.change(description, {
            target: {
              focus: () => {},
              value: 'Invoice #1',
            },
          });

          fireEvent.click(status);
        });

        const schedule = await screen.findByLabelText(
          'transaction-form.transaction-amount.schedule.options.yes',
        );
        const amount = await screen.findByLabelText(
          'transaction-form.transaction-amount.amount.label',
        );

        act(() => {
          fireEvent.click(schedule);

          fireEvent.change(amount, {
            target: {
              focus: () => {},
              value: '999.99',
            },
          });
        });

        const [, , button] = await screen.findAllByRole('button');

        await waitFor(() => expect(button).not.toBeDisabled());

        await act(async () => {
          fireEvent.click(button);

          await waitForApollo(0);
        });

        await expect(
          screen.findByTestId(
            '/my-companies/accounts/company-id/pending-transactions',
          ),
        ).resolves.toBeInTheDocument();
      });

      it('should display an error toast if upload is unsuccessful', async () => {
        const transactionType = await screen.findByLabelText(
          'transaction-form.transaction-details.transaction.options.sale',
        );

        fireEvent.click(transactionType);

        const supplier = await screen.findByLabelText(
          'transaction-form.transaction-details.name.label',
        );
        const description = await screen.findByLabelText(
          'transaction-form.transaction-details.description.label',
        );
        const status = await screen.findByLabelText(
          'transaction-form.transaction-amount.status.options.pending',
        );

        await act(async () => {
          fireEvent.change(supplier, {
            target: {
              focus: () => {},
              value: 'Motech Development',
            },
          });

          fireEvent.change(description, {
            target: {
              focus: () => {},
              value: 'Invoice #1',
            },
          });

          fireEvent.click(status);

          await Promise.resolve();
        });

        const schedule = await screen.findByLabelText(
          'transaction-form.transaction-amount.schedule.options.yes',
        );
        const amount = await screen.findByLabelText(
          'transaction-form.transaction-amount.amount.label',
        );
        const fileUpload = await screen.findByLabelText(
          'transaction-form.upload.upload.label',
        );

        await act(async () => {
          fireEvent.click(schedule);

          fireEvent.change(amount, {
            target: {
              focus: () => {},
              value: '999.99',
            },
          });

          fireEvent.change(fileUpload, {
            target: {
              files: [upload],
            },
          });

          await Promise.resolve();
        });

        await waitFor(() =>
          expect(add).toHaveBeenCalledWith({
            colour: 'danger',
            message: 'uploads.add.error',
          }),
        );
      });
    });

    describe('is a refund', () => {
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
              query: RECORD_TRANSACTION,
              variables: {
                id: 'company-id',
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
                  ],
                  id: 'company-id',
                  vat: {
                    pay: 20,
                  },
                },
                getTypeahead: {
                  id: 'company-id',
                  purchases: null,
                  sales: null,
                  suppliers: null,
                },
              },
            },
          },
          {
            request: {
              query: ADD_TRANSACTION,
              variables: {
                input: {
                  amount: -999.99,
                  attachment: '',
                  category: 'Sales',
                  companyId: 'company-id',
                  date: '2020-05-07T10:58:17.000Z',
                  description: 'Invoice #1',
                  id: '',
                  name: 'Motech Development',
                  refund: true,
                  scheduled: true,
                  status: 'pending',
                  vat: -200,
                },
              },
            },
            result: {
              data: {
                addTransaction: {
                  amount: -999.99,
                  attachment: '',
                  category: 'Sales',
                  companyId: 'company-id',
                  date: '2020-05-07T10:58:17.000Z',
                  description: 'Invoice #1',
                  id: 'transaction-id',
                  name: 'Motech Development',
                  refund: true,
                  scheduled: true,
                  status: 'pending',
                  vat: -200,
                },
              },
            },
          },
        ];

        await act(async () => {
          render(
            <TestProvider
              path="/accounts/:companyId/record-transaction"
              history={history}
            >
              <MockedProvider mocks={mocks}>
                <RecordTransaction />
              </MockedProvider>
            </TestProvider>,
          );

          await waitForApollo(0);
        });
      });

      it('should redirect you back to accounts page on complete', async () => {
        const transactionType = await screen.findByLabelText(
          'transaction-form.transaction-details.transaction.options.sale',
        );

        fireEvent.click(transactionType);

        const supplier = await screen.findByLabelText(
          'transaction-form.transaction-details.name.label',
        );
        const description = await screen.findByLabelText(
          'transaction-form.transaction-details.description.label',
        );
        const status = await screen.findByLabelText(
          'transaction-form.transaction-amount.status.options.pending',
        );
        const refund = await screen.findByLabelText(
          'transaction-form.transaction-amount.refund.options.yes',
        );

        await act(async () => {
          fireEvent.change(supplier, {
            target: {
              focus: () => {},
              value: 'Motech Development',
            },
          });

          fireEvent.change(description, {
            target: {
              focus: () => {},
              value: 'Invoice #1',
            },
          });

          fireEvent.click(status);

          fireEvent.click(refund);

          await Promise.resolve();
        });

        const schedule = await screen.findByLabelText(
          'transaction-form.transaction-amount.schedule.options.yes',
        );
        const amount = await screen.findByLabelText(
          'transaction-form.transaction-amount.amount.label',
        );

        await act(async () => {
          fireEvent.click(schedule);

          fireEvent.change(amount, {
            target: {
              focus: () => {},
              value: '999.99',
            },
          });

          await Promise.resolve();
        });

        const [, , button] = await screen.findAllByRole('button');

        await waitFor(() => expect(button).not.toBeDisabled());

        await act(async () => {
          fireEvent.click(button);

          await waitForApollo(0);
        });

        await expect(
          screen.findByTestId(
            '/my-companies/accounts/company-id/pending-transactions',
          ),
        ).resolves.toBeInTheDocument();
      });
    });
  });

  describe('cache', () => {
    let cache: ApolloCache<AddTransactionMutation>;

    beforeEach(() => {
      cache = new InMemoryCache({
        typePolicies: {
          Transactions: {
            keyFields: ['id', 'status'],
          },
        },
      }) as unknown as ApolloCache<AddTransactionMutation>;

      jest.spyOn(cache, 'modify');
    });

    describe('typeahead', () => {
      describe('with null data', () => {
        beforeEach(() => {
          cache.writeQuery({
            data: {
              getTypeahead: {
                __typename: 'Typeahead',
                id: 'company-id',
                purchases: [],
                sales: [],
                suppliers: [],
              } as Typeahead,
            },
            query: GET_TYPEAHEAD,
            variables: {
              id: 'company-id',
            },
          });
        });

        it('should add sale description to the typeahead', () => {
          const input = {
            data: {
              addTransaction: {
                amount: 100,
                attachment: '',
                category: 'Sales',
                companyId: 'company-id',
                date: '2021-02-22',
                description: 'A sale',
                id: 'transaction-id',
                name: 'A client',
                refund: false,
                scheduled: false,
                status: TransactionStatus.Confirmed,
                vat: 0,
              },
            },
          };

          update(cache, input, {});

          const result = cache.readQuery({
            query: GET_TYPEAHEAD,
            variables: {
              id: 'company-id',
            },
          });

          expect(result).toEqual({
            getTypeahead: {
              __typename: 'Typeahead',
              id: 'company-id',
              purchases: [],
              sales: ['A sale'],
              suppliers: [],
            },
          });
        });

        it('should add purchase description and supplier to the typeahead', () => {
          const input = {
            data: {
              addTransaction: {
                amount: 100,
                attachment: '',
                category: 'Bills',
                companyId: 'company-id',
                date: '2021-02-22',
                description: 'A purchase',
                id: 'transaction-id',
                name: 'Your favourite shop',
                refund: false,
                scheduled: false,
                status: TransactionStatus.Confirmed,
                vat: 0,
              },
            },
          };

          update(cache, input, {});

          const result = cache.readQuery({
            query: GET_TYPEAHEAD,
            variables: {
              id: 'company-id',
            },
          });

          expect(result).toEqual({
            getTypeahead: {
              __typename: 'Typeahead',
              id: 'company-id',
              purchases: ['A purchase'],
              sales: [],
              suppliers: ['Your favourite shop'],
            },
          });
        });
      });

      describe('without null data', () => {
        beforeEach(() => {
          cache.writeQuery({
            data: {
              getTypeahead: {
                __typename: 'Typeahead',
                id: 'company-id',
                purchases: ['B Purchase'],
                sales: ['B Sale'],
                suppliers: ['B Supplier'],
              } as Typeahead,
            },
            query: GET_TYPEAHEAD,
            variables: {
              id: 'company-id',
            },
          });
        });

        it('should add sale description to the typeahead', () => {
          const input = {
            data: {
              addTransaction: {
                amount: 100,
                attachment: '',
                category: 'Sales',
                companyId: 'company-id',
                date: '2021-02-22',
                description: 'A sale',
                id: 'transaction-id',
                name: 'A client',
                refund: false,
                scheduled: false,
                status: TransactionStatus.Confirmed,
                vat: 0,
              },
            },
          };

          update(cache, input, {});

          const result = cache.readQuery({
            query: GET_TYPEAHEAD,
            variables: {
              id: 'company-id',
            },
          });

          expect(result).toEqual({
            getTypeahead: {
              __typename: 'Typeahead',
              id: 'company-id',
              purchases: ['B Purchase'],
              sales: ['A sale', 'B Sale'],
              suppliers: ['B Supplier'],
            },
          });
        });

        it('should add purchase description and supplier to the typeahead', () => {
          const input = {
            data: {
              addTransaction: {
                amount: 100,
                attachment: '',
                category: 'Bills',
                companyId: 'company-id',
                date: '2021-02-22',
                description: 'A purchase',
                id: 'transaction-id',
                name: 'Your favourite shop',
                refund: false,
                scheduled: false,
                status: TransactionStatus.Confirmed,
                vat: 0,
              },
            },
          };

          update(cache, input, {});

          const result = cache.readQuery({
            query: GET_TYPEAHEAD,
            variables: {
              id: 'company-id',
            },
          });

          expect(result).toEqual({
            getTypeahead: {
              __typename: 'Typeahead',
              id: 'company-id',
              purchases: ['A purchase', 'B Purchase'],
              sales: ['B Sale'],
              suppliers: ['B Supplier', 'Your favourite shop'],
            },
          });
        });
      });

      describe('with set data', () => {
        beforeEach(() => {
          cache.writeQuery({
            data: {
              getTypeahead: {
                __typename: 'Typeahead',
                id: 'company-id',
                purchases: ['A purchase'],
                sales: ['A sale'],
                suppliers: ['Your favourite shop'],
              } as Typeahead,
            },
            query: GET_TYPEAHEAD,
            variables: {
              id: 'company-id',
            },
          });
        });

        it('should not add sale description to the typeahead', () => {
          const input = {
            data: {
              addTransaction: {
                amount: 100,
                attachment: '',
                category: 'Sales',
                companyId: 'company-id',
                date: '2021-02-22',
                description: 'A sale',
                id: 'transaction-id',
                name: 'A client',
                refund: false,
                scheduled: false,
                status: TransactionStatus.Confirmed,
                vat: 0,
              },
            },
          };

          update(cache, input, {});

          const result = cache.readQuery({
            query: GET_TYPEAHEAD,
            variables: {
              id: 'company-id',
            },
          });

          expect(result).toEqual({
            getTypeahead: {
              __typename: 'Typeahead',
              id: 'company-id',
              purchases: ['A purchase'],
              sales: ['A sale'],
              suppliers: ['Your favourite shop'],
            },
          });
        });

        it('should not add purchase description and supplier to the typeahead', () => {
          const input = {
            data: {
              addTransaction: {
                amount: 100,
                attachment: '',
                category: 'Bills',
                companyId: 'company-id',
                date: '2021-02-22',
                description: 'A purchase',
                id: 'transaction-id',
                name: 'Your favourite shop',
                refund: false,
                scheduled: false,
                status: TransactionStatus.Confirmed,
                vat: 0,
              },
            },
          };

          update(cache, input, {});

          const result = cache.readQuery({
            query: GET_TYPEAHEAD,
            variables: {
              id: 'company-id',
            },
          });

          expect(result).toEqual({
            getTypeahead: {
              __typename: 'Typeahead',
              id: 'company-id',
              purchases: ['A purchase'],
              sales: ['A sale'],
              suppliers: ['Your favourite shop'],
            },
          });
        });
      });
    });

    describe('transactions', () => {
      beforeEach(() => {
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
      });

      it('should add transaction to transactions list', () => {
        const input = {
          data: {
            addTransaction: {
              __typename: 'Transaction',
              amount: 100,
              attachment: '',
              category: 'Bills',
              companyId: 'company-id',
              date: '2021-02-22',
              description: 'A purchase',
              id: 'transaction-id-2',
              name: 'Your favourite shop',
              refund: false,
              scheduled: false,
              status: TransactionStatus.Confirmed,
              vat: 0,
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
                date: '2021-02-21',
                description: 'A purchase',
                id: 'transaction-id-0',
                name: 'Your favourite shop',
                scheduled: false,
              },
              {
                __typename: 'Transaction',
                amount: 100,
                attachment: '',
                date: '2021-02-22',
                description: 'A purchase',
                id: 'transaction-id-2',
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
          },
        });
      });

      it('should not add a duplicate transaction', () => {
        const input = {
          data: {
            addTransaction: {
              amount: 999,
              attachment: '',
              category: 'Bills',
              companyId: 'company-id',
              date: '2021-02-22',
              description: 'A purchase',
              id: 'transaction-id-1',
              name: 'Your favourite shop',
              refund: false,
              scheduled: false,
              status: TransactionStatus.Confirmed,
              vat: 0,
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
          },
        });
      });
    });

    it('should not modify cache if no data is passed', () => {
      update(cache, {}, {});

      expect(cache.modify).not.toHaveBeenCalled();
    });
  });
});
