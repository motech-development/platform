import { InMemoryCache } from '@apollo/client/cache';
import { MockedProvider, MockedResponse } from '@apollo/client/testing';
import { waitForApollo } from '@motech-development/appsync-apollo';
import {
  act,
  fireEvent,
  render,
  RenderResult,
  wait,
} from '@testing-library/react';
import axios from 'axios';
import { createMemoryHistory, MemoryHistory } from 'history';
import { advanceTo, clear } from 'jest-date-mock';
import React from 'react';
import GET_BALANCE from '../../../../graphql/balance/GET_BALANCE';
import ADD_TRANSACTION from '../../../../graphql/transaction/ADD_TRANSACTION';
import GET_TRANSACTIONS from '../../../../graphql/transaction/GET_TRANSACTIONS';
import TestProvider, { add } from '../../../../utils/TestProvider';
import RecordTransaction, { RECORD_TRANSACTION } from '../RecordTransaction';
import { REQUEST_UPLOAD } from '../shared/UploadAttachment';

describe('RecordTransaction', () => {
  let cache: InMemoryCache;
  let component: RenderResult;
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

    cache = new InMemoryCache({});

    cache.writeQuery({
      data: {
        getBalance: {
          __typename: 'Balance',
          currency: 'GBP',
          id: 'company-id',
        },
        getTransactions: {
          __typename: 'Transactions',
          id: 'company-id',
          items: [],
        },
      },
      query: GET_TRANSACTIONS,
      variables: {
        companyId: 'company-id',
        status: 'pending',
      },
    });

    cache.writeQuery({
      data: {
        getBalance: {
          __typename: 'Balance',
          currency: 'GBP',
          id: 'company-id',
        },
        getTransactions: {
          __typename: 'Transactions',
          id: 'company-id',
          items: [],
        },
      },
      query: GET_TRANSACTIONS,
      variables: {
        companyId: 'company-id',
        status: 'confirmed',
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
                __typename: 'Balance',
                balance: 180,
                currency: 'GBP',
                id: 'company-id',
                transactions: [
                  {
                    __typename: 'BalanceTransaction',
                    balance: 180,
                    currency: 'GBP',
                    date: '2020-04-15T14:07:18Z',
                    items: [
                      {
                        __typename: 'Transaction',
                        amount: -20,
                        attachment: '',
                        description: 'Lunch',
                        id: 'transaction-2',
                        name: 'KFC',
                      },
                    ],
                  },
                  {
                    __typename: 'BalanceTransaction',
                    balance: 200,
                    currency: 'GBP',
                    date: '2020-04-13T14:07:18Z',
                    items: [
                      {
                        __typename: 'Transaction',
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
                  __typename: 'BalanceVat',
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
                __typename: 'Clients',
                id: 'company-id',
                items: [],
              },
              getSettings: {
                __typename: 'Settings',
                categories: [
                  {
                    __typename: 'ExpenseCategory',
                    name: 'Equipment',
                    vatRate: 20,
                  },
                ],
                id: 'company-id',
                vat: {
                  __typename: 'VatSettings',
                  pay: 20,
                },
              },
              getTypeahead: {
                __typename: 'Typeahead',
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
                date: '2020-05-07T10:58:17Z',
                description: 'Laptop',
                id: '',
                name: 'Apple',
                scheduled: false,
                status: 'confirmed',
                vat: 166.66,
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
                date: '2020-05-07T10:58:17Z',
                description: 'Laptop',
                id: 'transaction-id',
                name: 'Apple',
                scheduled: false,
                status: 'confirmed',
                vat: 166.66,
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
                __typename: 'StorageUpload',
                id: 'test-id',
                url: 'https://temp-upload.url/',
              },
            },
          },
        },
      ];

      await act(async () => {
        component = render(
          <TestProvider
            path="/accounts/:companyId/record-transaction"
            history={history}
          >
            <MockedProvider mocks={mocks} cache={cache}>
              <RecordTransaction />
            </MockedProvider>
          </TestProvider>,
        );
      });
    });

    it('should redirect you back to accounts page on complete', async () => {
      const { findAllByRole, findByLabelText, findByTestId } = component;

      await act(async () => {
        const transactionType = await findByLabelText(
          'transaction-form.transaction-details.transaction.options.purchase',
        );

        fireEvent.click(transactionType);

        await wait();

        const supplier = await findByLabelText(
          'transaction-form.transaction-details.name.label',
        );
        const description = await findByLabelText(
          'transaction-form.transaction-details.description.label',
        );
        const status = await findByLabelText(
          'transaction-form.transaction-amount.status.options.confirmed',
        );
        const category = await findByLabelText(
          'transaction-form.transaction-amount.category.label',
        );
        const amount = await findByLabelText(
          'transaction-form.transaction-amount.amount.label',
        );
        const fileUpload = await findByLabelText(
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

        Object.defineProperty(fileUpload, 'files', {
          value: [upload],
        });

        fireEvent.change(fileUpload);

        await wait();

        const [, , , button] = await findAllByRole('button');

        fireEvent.click(button);

        await waitForApollo(0);

        await findByTestId('next-page');
      });

      expect(history.push).toHaveBeenCalledWith(
        '/my-companies/accounts/company-id',
      );
    });

    it('should display a success toast when transaction is added', async () => {
      const { findAllByRole, findByLabelText, findByTestId } = component;

      await act(async () => {
        const transactionType = await findByLabelText(
          'transaction-form.transaction-details.transaction.options.purchase',
        );

        fireEvent.click(transactionType);

        await wait();

        const supplier = await findByLabelText(
          'transaction-form.transaction-details.name.label',
        );
        const description = await findByLabelText(
          'transaction-form.transaction-details.description.label',
        );
        const status = await findByLabelText(
          'transaction-form.transaction-amount.status.options.confirmed',
        );
        const category = await findByLabelText(
          'transaction-form.transaction-amount.category.label',
        );
        const amount = await findByLabelText(
          'transaction-form.transaction-amount.amount.label',
        );
        const fileUpload = await findByLabelText(
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

        Object.defineProperty(fileUpload, 'files', {
          value: [upload],
        });

        fireEvent.change(fileUpload);

        await wait();

        const [, , , button] = await findAllByRole('button');

        fireEvent.click(button);

        await waitForApollo(0);

        await findByTestId('next-page');
      });

      await wait(() =>
        expect(add).toHaveBeenCalledWith({
          colour: 'success',
          message: 'record-transaction.success',
        }),
      );
    });

    it('should display an success toast if upload is successful', async () => {
      const { findByLabelText } = component;

      await act(async () => {
        const transactionType = await findByLabelText(
          'transaction-form.transaction-details.transaction.options.purchase',
        );

        fireEvent.click(transactionType);

        await wait();

        const supplier = await findByLabelText(
          'transaction-form.transaction-details.name.label',
        );
        const description = await findByLabelText(
          'transaction-form.transaction-details.description.label',
        );
        const status = await findByLabelText(
          'transaction-form.transaction-amount.status.options.confirmed',
        );
        const category = await findByLabelText(
          'transaction-form.transaction-amount.category.label',
        );
        const amount = await findByLabelText(
          'transaction-form.transaction-amount.amount.label',
        );
        const fileUpload = await findByLabelText(
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

        Object.defineProperty(fileUpload, 'files', {
          value: [upload],
        });

        fireEvent.change(fileUpload);

        await wait();
      });

      await wait(() =>
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

      const { findByLabelText } = component;

      await act(async () => {
        const transactionType = await findByLabelText(
          'transaction-form.transaction-details.transaction.options.purchase',
        );

        fireEvent.click(transactionType);

        await wait();

        const supplier = await findByLabelText(
          'transaction-form.transaction-details.name.label',
        );
        const description = await findByLabelText(
          'transaction-form.transaction-details.description.label',
        );
        const status = await findByLabelText(
          'transaction-form.transaction-amount.status.options.confirmed',
        );
        const category = await findByLabelText(
          'transaction-form.transaction-amount.category.label',
        );
        const amount = await findByLabelText(
          'transaction-form.transaction-amount.amount.label',
        );
        const fileUpload = await findByLabelText(
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

        Object.defineProperty(fileUpload, 'files', {
          value: [upload],
        });

        fireEvent.change(fileUpload);

        await wait();
      });

      await wait(() =>
        expect(add).toHaveBeenCalledWith({
          colour: 'danger',
          message: 'uploads.add.error',
        }),
      );
    });
  });

  describe('sale', () => {
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
                __typename: 'Balance',
                balance: 180,
                currency: 'GBP',
                id: 'company-id',
                transactions: [
                  {
                    __typename: 'BalanceTransaction',
                    balance: 180,
                    currency: 'GBP',
                    date: '2020-04-15T14:07:18Z',
                    items: [
                      {
                        __typename: 'Transaction',
                        amount: -20,
                        attachment: '',
                        description: 'Lunch',
                        id: 'transaction-2',
                        name: 'KFC',
                      },
                    ],
                  },
                  {
                    __typename: 'BalanceTransaction',
                    balance: 200,
                    currency: 'GBP',
                    date: '2020-04-13T14:07:18Z',
                    items: [
                      {
                        __typename: 'Transaction',
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
                  __typename: 'BalanceVat',
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
                __typename: 'Clients',
                id: 'company-id',
                items: [
                  {
                    __typename: 'Client',
                    id: 'client-id',
                    name: 'Motech Development',
                  },
                ],
              },
              getSettings: {
                __typename: 'Settings',
                categories: [
                  {
                    __typename: 'ExpenseCategory',
                    name: 'Equipment',
                    vatRate: 20,
                  },
                ],
                id: 'company-id',
                vat: {
                  __typename: 'VatSettings',
                  pay: 20,
                },
              },
              getTypeahead: {
                __typename: 'Typeahead',
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
                date: '2020-05-07T10:58:17Z',
                description: 'Invoice #1',
                id: '',
                name: 'Motech Development',
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
                date: '2020-05-07T10:58:17Z',
                description: 'Invoice #1',
                id: 'transaction-id',
                name: 'Motech Development',
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
              },
            },
          },
        },
      ];

      await act(async () => {
        component = render(
          <TestProvider
            path="/accounts/:companyId/record-transaction"
            history={history}
          >
            <MockedProvider mocks={mocks} cache={cache}>
              <RecordTransaction />
            </MockedProvider>
          </TestProvider>,
        );
      });
    });

    it('should redirect you back to accounts page on complete', async () => {
      const { findAllByRole, findByLabelText, findByTestId } = component;

      await act(async () => {
        const transactionType = await findByLabelText(
          'transaction-form.transaction-details.transaction.options.sale',
        );

        fireEvent.click(transactionType);

        await wait();

        const supplier = await findByLabelText(
          'transaction-form.transaction-details.name.label',
        );
        const description = await findByLabelText(
          'transaction-form.transaction-details.description.label',
        );
        const status = await findByLabelText(
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

        await wait();

        const schedule = await findByLabelText(
          'transaction-form.transaction-amount.schedule.options.yes',
        );
        const amount = await findByLabelText(
          'transaction-form.transaction-amount.amount.label',
        );

        fireEvent.click(schedule);

        fireEvent.change(amount, {
          target: {
            focus: () => {},
            value: '999.99',
          },
        });

        await wait();

        const [, , button] = await findAllByRole('button');

        fireEvent.click(button);

        await waitForApollo(0);

        await findByTestId('next-page');
      });

      expect(history.push).toHaveBeenCalledWith(
        '/my-companies/accounts/company-id/pending-transactions',
      );
    });

    it('should display an error toast if upload is unsuccessful', async () => {
      const { findByLabelText } = component;

      await act(async () => {
        const transactionType = await findByLabelText(
          'transaction-form.transaction-details.transaction.options.sale',
        );

        fireEvent.click(transactionType);

        await wait();

        const supplier = await findByLabelText(
          'transaction-form.transaction-details.name.label',
        );
        const description = await findByLabelText(
          'transaction-form.transaction-details.description.label',
        );
        const status = await findByLabelText(
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

        await wait();

        const schedule = await findByLabelText(
          'transaction-form.transaction-amount.schedule.options.yes',
        );
        const amount = await findByLabelText(
          'transaction-form.transaction-amount.amount.label',
        );
        const fileUpload = await findByLabelText(
          'transaction-form.upload.upload.label',
        );

        fireEvent.click(schedule);

        fireEvent.change(amount, {
          target: {
            focus: () => {},
            value: '999.99',
          },
        });

        Object.defineProperty(fileUpload, 'files', {
          value: [upload],
        });

        fireEvent.change(fileUpload);

        await wait();
      });

      await wait(() =>
        expect(add).toHaveBeenCalledWith({
          colour: 'danger',
          message: 'uploads.add.error',
        }),
      );
    });
  });
});
