import { InMemoryCache } from '@apollo/client/cache';
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
import { createMemoryHistory, MemoryHistory } from 'history';
import { advanceTo, clear } from 'jest-date-mock';
import GET_BALANCE from '../../../../graphql/balance/GET_BALANCE';
import ADD_TRANSACTION from '../../../../graphql/transaction/ADD_TRANSACTION';
import GET_TRANSACTIONS from '../../../../graphql/transaction/GET_TRANSACTIONS';
import GET_TYPEAHEAD from '../../../../graphql/typeahead/GET_TYPEAHEAD';
import TestProvider, { add } from '../../../../utils/TestProvider';
import RecordTransaction, { RECORD_TRANSACTION } from '../RecordTransaction';
import { REQUEST_UPLOAD } from '../shared/UploadAttachment';

describe('RecordTransaction', () => {
  let cache: InMemoryCache;
  let history: MemoryHistory;
  let mocks: MockedResponse[];
  let upload: File;

  beforeAll(() => {
    advanceTo('2020-05-07T11:58:17+01:00');
  });

  beforeEach(() => {
    history = createMemoryHistory({
      initialEntries: ['/accounts/company-id/record-transaction'],
    });

    jest.spyOn(history, 'push');

    cache = new InMemoryCache();

    cache.writeQuery({
      data: {
        getBalance: {
          __typename: 'Balance',
          currency: 'GBP',
          id: 'company-id',
          transactions: [],
        },
        getTransactions: {
          __typename: 'Transactions',
          id: 'company-id',
          items: [],
          status: 'pending',
        },
      },
      query: GET_TRANSACTIONS,
      variables: {
        id: 'company-id',
        status: 'pending',
      },
    });

    cache.writeQuery({
      data: {
        getBalance: {
          __typename: 'Balance',
          currency: 'GBP',
          id: 'company-id',
          transactions: [],
        },
        getTransactions: {
          __typename: 'Transactions',
          id: 'company-id',
          items: [],
          status: 'confirmed',
        },
      },
      query: GET_TRANSACTIONS,
      variables: {
        id: 'company-id',
        status: 'confirmed',
      },
    });

    cache.writeQuery({
      data: {
        getTypeahead: {
          __typename: 'Typeahead',
          id: 'company-id',
          purchases: [],
          sales: null,
          suppliers: [],
        },
      },
      query: GET_TYPEAHEAD,
      variables: {
        id: 'company-id',
      },
    });

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
                    __typename: 'Transaction',
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
                      id: undefined,
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
                <MockedProvider mocks={mocks} cache={cache}>
                  <RecordTransaction />
                </MockedProvider>
              </TestProvider>,
            );

            await waitForApollo(0);
          });
        });

        it('should redirect you back to accounts page on complete', async () => {
          await act(async () => {
            const transactionType = await screen.findByLabelText(
              'transaction-form.transaction-details.transaction.options.purchase',
            );

            fireEvent.click(transactionType);
          });

          await act(async () => {
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
          });

          await act(async () => {
            const [, , , button] = await screen.findAllByRole('button');

            fireEvent.click(button);

            await waitForApollo(0);
          });

          await waitFor(() =>
            expect(history.push).toHaveBeenCalledWith(
              '/my-companies/accounts/company-id',
            ),
          );
        });

        it('should display a success toast when transaction is added', async () => {
          await act(async () => {
            const transactionType = await screen.findByLabelText(
              'transaction-form.transaction-details.transaction.options.purchase',
            );

            fireEvent.click(transactionType);
          });

          await act(async () => {
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
          });

          await act(async () => {
            const [, , , button] = await screen.findAllByRole('button');

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
          await act(async () => {
            const transactionType = await screen.findByLabelText(
              'transaction-form.transaction-details.transaction.options.purchase',
            );

            fireEvent.click(transactionType);
          });

          await act(async () => {
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
          });

          await act(async () => {
            const transactionType = await screen.findByLabelText(
              'transaction-form.transaction-details.transaction.options.purchase',
            );

            fireEvent.click(transactionType);
          });

          await act(async () => {
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
                      id: undefined,
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
                <MockedProvider mocks={mocks} cache={cache}>
                  <RecordTransaction />
                </MockedProvider>
              </TestProvider>,
            );

            await waitForApollo(0);
          });
        });

        it('should display a warning toast', async () => {
          await act(async () => {
            const transactionType = await screen.findByLabelText(
              'transaction-form.transaction-details.transaction.options.purchase',
            );

            fireEvent.click(transactionType);
          });

          await act(async () => {
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
          });

          await act(async () => {
            const [, , button] = await screen.findAllByRole('button');

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
          await act(async () => {
            const transactionType = await screen.findByLabelText(
              'transaction-form.transaction-details.transaction.options.purchase',
            );

            fireEvent.click(transactionType);
          });

          await act(async () => {
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
          });

          await act(async () => {
            const [, , button] = await screen.findAllByRole('button');

            fireEvent.click(button);

            await waitForApollo(0);
          });

          await waitFor(() =>
            expect(history.push).toHaveBeenCalledWith(
              '/my-companies/accounts/company-id',
            ),
          );
        });

        it('should do nothing when uploading an attachment', async () => {
          await act(async () => {
            const transactionType = await screen.findByLabelText(
              'transaction-form.transaction-details.transaction.options.purchase',
            );

            fireEvent.click(transactionType);
          });

          await act(async () => {
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
                  __typename: 'Transaction',
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
              <MockedProvider mocks={mocks} cache={cache}>
                <RecordTransaction />
              </MockedProvider>
            </TestProvider>,
          );

          await waitForApollo(0);
        });
      });

      it('should redirect you back to accounts page on complete', async () => {
        await act(async () => {
          const transactionType = await screen.findByLabelText(
            'transaction-form.transaction-details.transaction.options.purchase',
          );

          fireEvent.click(transactionType);
        });

        await act(async () => {
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
        });

        await act(async () => {
          const [, , button] = await screen.findAllByRole('button');

          fireEvent.click(button);

          await waitForApollo(0);
        });

        await waitFor(() =>
          expect(history.push).toHaveBeenCalledWith(
            '/my-companies/accounts/company-id',
          ),
        );
      });

      it('should display a success toast when transaction is added', async () => {
        await act(async () => {
          const transactionType = await screen.findByLabelText(
            'transaction-form.transaction-details.transaction.options.purchase',
          );

          fireEvent.click(transactionType);
        });

        await act(async () => {
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
        });

        await act(async () => {
          const [, , button] = await screen.findAllByRole('button');

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
                  __typename: 'Transaction',
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
                    id: undefined,
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
              <MockedProvider mocks={mocks} cache={cache}>
                <RecordTransaction />
              </MockedProvider>
            </TestProvider>,
          );

          await waitForApollo(0);
        });
      });

      it('should redirect you back to accounts page on complete', async () => {
        await act(async () => {
          const transactionType = await screen.findByLabelText(
            'transaction-form.transaction-details.transaction.options.sale',
          );

          fireEvent.click(transactionType);
        });

        await act(async () => {
          const supplier = await screen.findByLabelText(
            'transaction-form.transaction-details.name.label',
          );
          const description = await screen.findByLabelText(
            'transaction-form.transaction-details.description.label',
          );
          const status = await screen.findByLabelText(
            'transaction-form.transaction-amount.status.options.pending',
          );

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

        await act(async () => {
          const schedule = await screen.findByLabelText(
            'transaction-form.transaction-amount.schedule.options.yes',
          );
          const amount = await screen.findByLabelText(
            'transaction-form.transaction-amount.amount.label',
          );

          fireEvent.click(schedule);

          fireEvent.change(amount, {
            target: {
              focus: () => {},
              value: '999.99',
            },
          });
        });

        await act(async () => {
          const [, , button] = await screen.findAllByRole('button');

          fireEvent.click(button);

          await waitForApollo(0);
        });

        await waitFor(() =>
          expect(history.push).toHaveBeenCalledWith(
            '/my-companies/accounts/company-id/pending-transactions',
          ),
        );
      });

      it('should display an error toast if upload is unsuccessful', async () => {
        await act(async () => {
          const transactionType = await screen.findByLabelText(
            'transaction-form.transaction-details.transaction.options.sale',
          );

          fireEvent.click(transactionType);
        });

        await act(async () => {
          const supplier = await screen.findByLabelText(
            'transaction-form.transaction-details.name.label',
          );
          const description = await screen.findByLabelText(
            'transaction-form.transaction-details.description.label',
          );
          const status = await screen.findByLabelText(
            'transaction-form.transaction-amount.status.options.pending',
          );

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

        await act(async () => {
          const schedule = await screen.findByLabelText(
            'transaction-form.transaction-amount.schedule.options.yes',
          );
          const amount = await screen.findByLabelText(
            'transaction-form.transaction-amount.amount.label',
          );
          const fileUpload = await screen.findByLabelText(
            'transaction-form.upload.upload.label',
          );

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
                  __typename: 'Transaction',
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
              <MockedProvider mocks={mocks} cache={cache}>
                <RecordTransaction />
              </MockedProvider>
            </TestProvider>,
          );

          await waitForApollo(0);
        });
      });

      it('should redirect you back to accounts page on complete', async () => {
        await act(async () => {
          const transactionType = await screen.findByLabelText(
            'transaction-form.transaction-details.transaction.options.sale',
          );

          fireEvent.click(transactionType);
        });

        await act(async () => {
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
        });

        await act(async () => {
          const schedule = await screen.findByLabelText(
            'transaction-form.transaction-amount.schedule.options.yes',
          );
          const amount = await screen.findByLabelText(
            'transaction-form.transaction-amount.amount.label',
          );

          fireEvent.click(schedule);

          fireEvent.change(amount, {
            target: {
              focus: () => {},
              value: '999.99',
            },
          });
        });

        await act(async () => {
          const [, , button] = await screen.findAllByRole('button');

          fireEvent.click(button);

          await waitForApollo(0);
        });

        await waitFor(() =>
          expect(history.push).toHaveBeenCalledWith(
            '/my-companies/accounts/company-id/pending-transactions',
          ),
        );
      });
    });
  });
});
