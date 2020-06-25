import {
  MockedProvider,
  MockedResponse,
  wait as apolloWait,
} from '@apollo/react-testing';
import {
  act,
  fireEvent,
  render,
  RenderResult,
  wait,
} from '@testing-library/react';
import axios from 'axios';
import { saveAs } from 'file-saver';
import { createMemoryHistory, MemoryHistory } from 'history';
import React from 'react';
import GET_BALANCE from '../../../../graphql/balance/GET_BALANCE';
import DELETE_TRANSACTION from '../../../../graphql/transaction/DELETE_TRANSACTION';
import UPDATE_TRANSACTION from '../../../../graphql/transaction/UPDATE_TRANSACTION';
import TestProvider, { add } from '../../../../utils/TestProvider';
import { DELETE_FILE, REQUEST_DOWNLOAD } from '../shared/ViewAttachment';
import ViewTransaction, { VIEW_TRANSACTION } from '../ViewTransaction';

jest.mock('file-saver', () => ({
  saveAs: jest.fn(),
}));

describe('ViewTransaction', () => {
  let component: RenderResult;
  let history: MemoryHistory;
  let mocks: MockedResponse[];

  beforeEach(() => {
    history = createMemoryHistory({
      initialEntries: ['/accounts/company-id/view-transaction/transaction-id'],
    });

    jest.spyOn(history, 'push');

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
                  date: '2020-05-07T10:58:17+00:00',
                  description: 'Laptop',
                  id: 'transaction-id',
                  name: 'Apple',
                  status: 'pending',
                  vat: 166.66,
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
                  date: '2020-05-07T10:58:17+00:00',
                  description: 'Laptop',
                  id: 'transaction-id',
                  name: 'Apple',
                  status: 'pending',
                  vat: 166.66,
                },
              },
            },
            result: {
              data: {
                updateTransaction: {
                  amount: -999.99,
                  attachment: '',
                  category: 'Equipment',
                  companyId: 'company-id',
                  date: '2020-05-07T10:58:17+00:00',
                  description: 'Laptop',
                  id: 'transaction-id',
                  name: 'Apple',
                  status: 'pending',
                  vat: 166.66,
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
          component = render(
            <TestProvider
              path="/accounts/:companyId/view-transaction/:transactionId"
              history={history}
            >
              <MockedProvider mocks={mocks} addTypename={false}>
                <ViewTransaction />
              </MockedProvider>
            </TestProvider>,
          );
        });
      });

      it('should redirect you back to accounts page on complete', async () => {
        const { findAllByRole, findByTestId, findByText } = component;

        await act(async () => {
          await findByText('view-transaction.title');

          const [, , button] = await findAllByRole('button');

          fireEvent.click(button);

          await wait();

          await apolloWait(0);

          await findByTestId('next-page');
        });

        expect(history.push).toHaveBeenCalledWith(
          '/my-companies/accounts/company-id/pending-transactions',
        );
      });

      it('should display a success toast', async () => {
        const { findAllByRole, findByTestId, findByText } = component;

        await act(async () => {
          await findByText('view-transaction.title');

          const [, , button] = await findAllByRole('button');

          fireEvent.click(button);

          await wait();

          await apolloWait(0);

          await findByTestId('next-page');
        });

        await wait(() =>
          expect(add).toHaveBeenCalledWith({
            colour: 'success',
            message: 'view-transaction.success',
          }),
        );
      });

      it('should display delete confirmation modal', async () => {
        const { findByRole, findByText } = component;
        const button = await findByText('view-transaction.delete-transaction');

        fireEvent.click(button);

        await expect(findByRole('dialog')).resolves.toBeInTheDocument();
      });

      it('should hide the delete confirmation modal', async () => {
        const {
          findAllByRole,
          findByRole,
          findByText,
          queryByRole,
        } = component;

        await act(async () => {
          await findByText('view-transaction.title');

          const [, , , button] = await findAllByRole('button');

          fireEvent.click(button);

          await findByRole('dialog');

          const [, , , , cancelButton] = await findAllByRole('button');

          fireEvent.click(cancelButton);
        });

        expect(queryByRole('dialog')).not.toBeInTheDocument();
      });

      it('should delete the transaction', async () => {
        const {
          findAllByRole,
          findByLabelText,
          findByTestId,
          findByText,
        } = component;

        await act(async () => {
          await findByText('view-transaction.title');

          const [, , , button] = await findAllByRole('button');

          fireEvent.click(button);

          const input = await findByLabelText('confirm-delete');

          fireEvent.change(input, {
            target: {
              focus: () => {},
              value: 'Apple',
            },
          });

          await wait();

          const [, , , , , deleteButton] = await findAllByRole('button');

          fireEvent.click(deleteButton);

          await apolloWait(0);

          await wait();

          await findByTestId('next-page');
        });

        expect(history.push).toHaveBeenCalledWith(
          '/my-companies/accounts/company-id/pending-transactions',
        );
      });

      it('should display a success toast when deleting a transaction', async () => {
        const { findAllByRole, findByLabelText, findByText } = component;

        await act(async () => {
          await findByText('view-transaction.title');

          const [, , , button] = await findAllByRole('button');

          fireEvent.click(button);

          const input = await findByLabelText('confirm-delete');

          fireEvent.change(input, {
            target: {
              focus: () => {},
              value: 'Apple',
            },
          });

          await wait();

          const [, , , , , deleteButton] = await findAllByRole('button');

          fireEvent.click(deleteButton);

          await apolloWait(0);

          await wait();
        });

        await wait(() =>
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
                  date: '2020-05-07T10:58:17+00:00',
                  description: 'Laptop',
                  id: 'transaction-id',
                  name: 'Apple',
                  status: 'confirmed',
                  vat: 166.66,
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
                  date: '2020-05-07T10:58:17+00:00',
                  description: 'Laptop',
                  id: 'transaction-id',
                  name: 'Apple',
                  status: 'confirmed',
                  vat: 166.66,
                },
              },
            },
            result: {
              data: {
                updateTransaction: {
                  amount: -999.99,
                  attachment: 'path/to/attachment.pdf',
                  category: 'Equipment',
                  companyId: 'company-id',
                  date: '2020-05-07T10:58:17+00:00',
                  description: 'Laptop',
                  id: 'transaction-id',
                  name: 'Apple',
                  status: 'confirmed',
                  vat: 166.66,
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
          component = render(
            <TestProvider
              path="/accounts/:companyId/view-transaction/:transactionId"
              history={history}
            >
              <MockedProvider mocks={mocks} addTypename={false}>
                <ViewTransaction />
              </MockedProvider>
            </TestProvider>,
          );
        });
      });

      it('should remove download attachment', async () => {
        const { findByLabelText, findByText } = component;

        await act(async () => {
          const deleteButton = await findByText(
            'transaction-form.upload.delete-file',
          );

          fireEvent.click(deleteButton);

          await apolloWait(0);

          await wait();
        });

        await expect(
          findByLabelText('transaction-form.upload.upload.label'),
        ).resolves.toBeInTheDocument();
      });

      it('should display success toast when attachment is removed', async () => {
        const { findByText } = component;

        await act(async () => {
          const deleteButton = await findByText(
            'transaction-form.upload.delete-file',
          );

          fireEvent.click(deleteButton);

          await apolloWait(0);

          await wait();
        });

        await wait(() =>
          expect(add).toHaveBeenCalledWith({
            colour: 'success',
            message: 'uploads.delete.success',
          }),
        );
      });

      it('should download the attachment', async () => {
        const { findByText } = component;

        await act(async () => {
          const downloadButton = await findByText(
            'transaction-form.upload.download-file',
          );

          fireEvent.click(downloadButton);

          await apolloWait(0);

          await wait();
        });

        expect(saveAs).toHaveBeenCalledWith('success', 'attachment.pdf');
      });

      it('should display a success toast when attachment is downloaded', async () => {
        const { findByText } = component;

        await act(async () => {
          const downloadButton = await findByText(
            'transaction-form.upload.download-file',
          );

          fireEvent.click(downloadButton);

          await apolloWait(0);

          await wait();
        });

        await wait(() =>
          expect(add).toHaveBeenCalledWith({
            colour: 'success',
            message: 'uploads.download.success',
          }),
        );
      });

      it('should display an error toast if file fails to download', async () => {
        (axios.request as jest.Mock).mockRejectedValueOnce({
          data: 'fail',
        });

        const { findByText } = component;

        await act(async () => {
          const downloadButton = await findByText(
            'transaction-form.upload.download-file',
          );

          fireEvent.click(downloadButton);

          await apolloWait(0);

          await wait();
        });

        await wait(() =>
          expect(add).toHaveBeenCalledWith({
            colour: 'danger',
            message: 'uploads.download.error',
          }),
        );
      });
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
                balance: 180,
                currency: 'GBP',
                id: 'company-id',
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
                date: '2020-05-07T10:58:17+00:00',
                description: 'Invoice #1',
                id: 'transaction-id',
                name: 'Motech Development',
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
                date: '2020-05-07T10:58:17+00:00',
                description: 'Invoice #1',
                id: 'transaction-id',
                name: 'Motech Development',
                status: 'confirmed',
                vat: 200,
              },
            },
          },
          result: {
            data: {
              updateTransaction: {
                amount: 999.99,
                attachment: 'path/to/attachment.pdf',
                category: 'Sales',
                companyId: 'company-id',
                date: '2020-05-07T10:58:17+00:00',
                description: 'Invoice #1',
                id: 'transaction-id',
                name: 'Motech Development',
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
        component = render(
          <TestProvider
            path="/accounts/:companyId/view-transaction/:transactionId"
            history={history}
          >
            <MockedProvider mocks={mocks} addTypename={false}>
              <ViewTransaction />
            </MockedProvider>
          </TestProvider>,
        );
      });
    });

    it('should redirect you back to accounts page on complete', async () => {
      const { findAllByRole, findByTestId, findByText } = component;

      await act(async () => {
        await findByText('view-transaction.title');

        const [, , , button] = await findAllByRole('button');

        fireEvent.click(button);

        await wait();

        await apolloWait(0);

        await findByTestId('next-page');
      });

      expect(history.push).toHaveBeenCalledWith(
        '/my-companies/accounts/company-id',
      );
    });

    it('should display a success toast', async () => {
      const { findAllByRole, findByTestId, findByText } = component;

      await act(async () => {
        await findByText('view-transaction.title');

        const [, , , button] = await findAllByRole('button');

        fireEvent.click(button);

        await wait();

        await apolloWait(0);

        await findByTestId('next-page');
      });

      await wait(() =>
        expect(add).toHaveBeenCalledWith({
          colour: 'success',
          message: 'view-transaction.success',
        }),
      );
    });

    it('should display an error toast when deleting a transaction', async () => {
      const { findAllByRole, findByLabelText, findByText } = component;

      await act(async () => {
        await findByText('view-transaction.title');

        const [, , , , button] = await findAllByRole('button');

        fireEvent.click(button);

        const input = await findByLabelText('confirm-delete');

        fireEvent.change(input, {
          target: {
            focus: () => {},
            value: 'Motech Development',
          },
        });

        await wait();

        const [, , , , , , deleteButton] = await findAllByRole('button');

        fireEvent.click(deleteButton);

        await apolloWait(0);

        await wait();
      });

      await wait(() =>
        expect(add).toHaveBeenCalledWith({
          colour: 'danger',
          message: 'delete-transaction.error',
        }),
      );
    });

    it('should display an error toast if file fails to download', async () => {
      const { findByText } = component;

      await act(async () => {
        const downloadButton = await findByText(
          'transaction-form.upload.download-file',
        );

        fireEvent.click(downloadButton);

        await apolloWait(0);

        await wait();
      });

      await wait(() =>
        expect(add).toHaveBeenCalledWith({
          colour: 'danger',
          message: 'uploads.download.error',
        }),
      );
    });

    it('should display an error toast if file fails to delete', async () => {
      const { findByText } = component;

      await act(async () => {
        const deleteButton = await findByText(
          'transaction-form.upload.delete-file',
        );

        fireEvent.click(deleteButton);

        await apolloWait(0);

        await wait();
      });

      await wait(() =>
        expect(add).toHaveBeenCalledWith({
          colour: 'danger',
          message: 'uploads.delete.error',
        }),
      );
    });
  });
});
