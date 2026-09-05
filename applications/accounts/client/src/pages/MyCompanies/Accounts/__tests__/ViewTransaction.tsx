import { MockedProvider, MockedResponse } from '@apollo/client/testing';
import { waitForApollo } from '@motech-development/appsync-apollo';
import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
} from '@testing-library/react';
import { saveAs } from 'file-saver';
import { Link } from 'react-router-dom';
import type { Mock } from 'vitest';
import { useTransactionState } from '../../../../components/TransactionUpdates';
import {
  GetTransactionStateQuery,
  TransactionStatus,
} from '../../../../graphql/graphql';
import TestProvider, {
  add,
  createFetchResponse,
} from '../../../../utils/TestProvider';
import { GET_BALANCE } from '../Accounts';
import { REQUEST_UPLOAD } from '../shared/UploadAttachment';
import { DELETE_FILE, REQUEST_DOWNLOAD } from '../shared/ViewAttachment';
import ViewTransaction, {
  DELETE_TRANSACTION,
  UPDATE_TRANSACTION,
  VIEW_TRANSACTION,
} from '../ViewTransaction';

vi.mock('pdfjs-dist/build/pdf.worker.min.mjs?url', () => ({
  default: 'pdfjs-dist/build/pdf.worker.min.mjs',
}));

vi.mock(
  '../../../../components/TransactionUpdates',
  async (importOriginal) => ({
    ...(await importOriginal<
      typeof import('../../../../components/TransactionUpdates')
    >()),
    useTransactionState: vi.fn(),
  }),
);

describe('ViewTransaction', () => {
  let history: string[];
  let mocks: MockedResponse[];

  beforeEach(() => {
    vi.setConfig({ testTimeout: 120000 });

    history = ['/accounts/company-id/view-transaction/transaction-id'];

    global.fetch = vi.fn().mockResolvedValue(
      createFetchResponse({
        body: 'success',
      }),
    );
  });

  describe('authoritative transaction corrections', () => {
    const cachedTransaction: NonNullable<
      GetTransactionStateQuery['getTransactionState']
    > = {
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
      status: TransactionStatus.Pending,
      vat: 166.67,
    };

    beforeEach(() => {
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
              getClients: { id: 'company-id', items: [] },
              getSettings: {
                categories: [{ name: 'Equipment', vatRate: 20 }],
                id: 'company-id',
                vat: { pay: 20 },
              },
              getTransaction: cachedTransaction,
              getTypeahead: {
                id: 'company-id',
                purchases: [],
                sales: [],
                suppliers: [],
              },
            },
          },
        },
      ];
    });

    const renderTransaction = () =>
      render(<ViewTransaction />, {
        wrapper: ({ children }) => (
          <TestProvider
            path="/accounts/:companyId/view-transaction/:transactionId"
            history={history}
          >
            <MockedProvider mocks={mocks}>{children}</MockedProvider>
          </TestProvider>
        ),
      });

    it('opens the current transaction without resurrecting a removed attachment', async () => {
      vi.mocked(useTransactionState).mockReturnValue({
        ...cachedTransaction,
        attachment: '',
        description: 'Corrected laptop',
      });

      renderTransaction();

      expect(
        await screen.findByLabelText(
          'transaction-form.transaction-details.description.label',
        ),
      ).toHaveValue('Corrected laptop');
      expect(
        screen.getByLabelText('transaction-form.upload.upload.label'),
      ).toBeInTheDocument();
      expect(
        screen.queryByText('transaction-form.upload.view-file'),
      ).not.toBeInTheDocument();
    });

    it('removes a live attachment without resetting unsaved edits and saves the cleaned state', async () => {
      const savedTransaction = {
        ...cachedTransaction,
        attachment: '',
        description: 'My unsaved description',
      };
      const result = vi.fn(() => ({
        data: { updateTransaction: savedTransaction },
      }));
      mocks.push({
        request: {
          query: UPDATE_TRANSACTION,
          variables: { input: savedTransaction },
        },
        result,
      });
      const { rerender } = renderTransaction();
      const description = await screen.findByLabelText(
        'transaction-form.transaction-details.description.label',
      );
      await screen.findByText('transaction-form.upload.view-file');

      fireEvent.change(description, {
        target: { value: savedTransaction.description },
      });
      vi.mocked(useTransactionState).mockReturnValue({
        ...cachedTransaction,
        attachment: '',
        description: 'A different server description',
      });
      rerender(<ViewTransaction />);

      expect(description).toHaveValue(savedTransaction.description);
      expect(
        screen.queryByText('transaction-form.upload.view-file'),
      ).not.toBeInTheDocument();
      expect(
        screen.getByLabelText('transaction-form.upload.upload.label'),
      ).toBeInTheDocument();

      const save = screen.getByRole('button', {
        name: 'transaction-form.save',
      });
      await waitFor(() => expect(save).not.toBeDisabled());
      fireEvent.click(save);

      await waitFor(() => expect(result).toHaveBeenCalledOnce());
    });

    it('keeps a locally uploaded replacement when delayed cleanup removes the old server attachment', async () => {
      const savedTransaction = {
        ...cachedTransaction,
        attachment: 'company-id/replacement.pdf',
      };
      const result = vi.fn(() => ({
        data: { updateTransaction: savedTransaction },
      }));
      mocks.push(
        {
          request: {
            query: DELETE_FILE,
            variables: {
              id: 'company-id',
              path: cachedTransaction.attachment,
            },
          },
          result: {
            data: { deleteFile: { path: cachedTransaction.attachment } },
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
                metadata: { id: 'transaction-id', typename: 'Transaction' },
              },
            },
          },
          result: {
            data: {
              requestUpload: {
                id: 'replacement',
                url: 'https://example.com/upload',
              },
            },
          },
        },
        {
          request: {
            query: UPDATE_TRANSACTION,
            variables: { input: savedTransaction },
          },
          result,
        },
      );
      const { rerender } = renderTransaction();
      fireEvent.click(
        await screen.findByText('transaction-form.upload.delete-file'),
      );
      const upload = await screen.findByLabelText(
        'transaction-form.upload.upload.label',
      );
      fireEvent.change(upload, {
        target: {
          files: [
            new File(['replacement'], 'replacement.pdf', {
              type: 'application/pdf',
            }),
          ],
        },
      });
      await screen.findByText('transaction-form.upload.view-file');

      vi.mocked(useTransactionState).mockReturnValue({
        ...cachedTransaction,
        attachment: '',
      });
      rerender(<ViewTransaction />);

      expect(
        screen.getByText('transaction-form.upload.view-file'),
      ).toBeInTheDocument();
      const save = screen.getByRole('button', {
        name: 'transaction-form.save',
      });
      await waitFor(() => expect(save).not.toBeDisabled());
      fireEvent.click(save);

      await waitFor(() => expect(result).toHaveBeenCalledOnce());
    });

    it.each([
      [
        TransactionStatus.Pending,
        '/my-companies/accounts/company-id/pending-transactions',
      ],
      [TransactionStatus.Confirmed, '/my-companies/accounts/company-id'],
    ])(
      'returns a deleted or moved %s transaction to its account list',
      async (status, destination) => {
        vi.mocked(useTransactionState).mockReturnValue({
          ...cachedTransaction,
          status,
        });
        const { rerender } = renderTransaction();
        await screen.findByText('view-transaction.title');

        vi.mocked(useTransactionState).mockReturnValue(null);
        rerender(<ViewTransaction />);

        expect(screen.queryByRole('form')).not.toBeInTheDocument();
        expect(
          screen.queryByText('view-transaction.delete-transaction'),
        ).not.toBeInTheDocument();
        expect(await screen.findByTestId(destination)).toBeInTheDocument();
      },
    );

    it('does not carry a local upload into a different transaction on the same route', async () => {
      mocks.push(
        {
          request: {
            query: DELETE_FILE,
            variables: {
              id: 'company-id',
              path: cachedTransaction.attachment,
            },
          },
          result: {
            data: { deleteFile: { path: cachedTransaction.attachment } },
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
                metadata: { id: 'transaction-id', typename: 'Transaction' },
              },
            },
          },
          result: {
            data: {
              requestUpload: {
                id: 'replacement',
                url: 'https://example.com/upload',
              },
            },
          },
        },
        {
          request: {
            query: VIEW_TRANSACTION,
            variables: {
              companyId: 'company-id',
              transactionId: 'other-transaction',
            },
          },
          result: {
            data: {
              getClients: { id: 'company-id', items: [] },
              getSettings: {
                categories: [{ name: 'Equipment', vatRate: 20 }],
                id: 'company-id',
                vat: { pay: 20 },
              },
              getTransaction: {
                ...cachedTransaction,
                attachment: '',
                description: 'Other transaction',
                id: 'other-transaction',
              },
              getTypeahead: {
                id: 'company-id',
                purchases: [],
                sales: [],
                suppliers: [],
              },
            },
          },
        },
      );
      render(
        <TestProvider
          path="/accounts/:companyId/view-transaction/:transactionId"
          history={history}
        >
          <MockedProvider mocks={mocks}>
            <>
              <Link to="/accounts/company-id/view-transaction/other-transaction">
                Open other transaction
              </Link>
              <ViewTransaction />
            </>
          </MockedProvider>
        </TestProvider>,
      );
      fireEvent.click(
        await screen.findByText('transaction-form.upload.delete-file'),
      );
      const upload = await screen.findByLabelText(
        'transaction-form.upload.upload.label',
      );
      fireEvent.change(upload, {
        target: {
          files: [
            new File(['replacement'], 'replacement.pdf', {
              type: 'application/pdf',
            }),
          ],
        },
      });
      await screen.findByText('transaction-form.upload.view-file');

      fireEvent.click(screen.getByText('Open other transaction'));

      await waitFor(() =>
        expect(
          screen.getByLabelText(
            'transaction-form.transaction-details.description.label',
          ),
        ).toHaveValue('Other transaction'),
      );
      expect(
        screen.getByLabelText('transaction-form.upload.upload.label'),
      ).toBeInTheDocument();
    });

    it('saves a live publication without overwriting it or losing an unsaved description', async () => {
      vi.mocked(useTransactionState).mockReturnValue({
        ...cachedTransaction,
        scheduled: true,
      });
      const published = {
        ...cachedTransaction,
        status: TransactionStatus.Confirmed,
      };
      const savedTransaction = {
        ...published,
        description: 'My unsaved description',
      };
      const result = vi.fn(() => ({
        data: { updateTransaction: savedTransaction },
      }));
      mocks.push({
        request: {
          query: UPDATE_TRANSACTION,
          variables: { input: savedTransaction },
        },
        result,
      });
      const { rerender } = renderTransaction();
      const description = await screen.findByLabelText(
        'transaction-form.transaction-details.description.label',
      );
      expect(
        screen.getByLabelText(
          'transaction-form.transaction-amount.schedule.options.yes',
        ),
      ).toBeChecked();
      fireEvent.change(description, {
        target: { value: savedTransaction.description },
      });

      vi.mocked(useTransactionState).mockReturnValue(published);
      rerender(<ViewTransaction />);

      await waitFor(() =>
        expect(
          screen.getByLabelText(
            'transaction-form.transaction-amount.status.options.confirmed',
          ),
        ).toBeChecked(),
      );
      expect(
        screen.queryByLabelText(
          'transaction-form.transaction-amount.schedule.options.yes',
        ),
      ).not.toBeInTheDocument();
      expect(description).toHaveValue(savedTransaction.description);
      const save = screen.getByRole('button', {
        name: 'transaction-form.save',
      });
      await waitFor(() => expect(save).not.toBeDisabled());
      fireEvent.click(save);

      await waitFor(() => expect(result).toHaveBeenCalledOnce());
    });

    it('updates unchanged fields even after blur while retaining local edits across server revisions', async () => {
      const { rerender } = renderTransaction();
      const name = await screen.findByLabelText(
        'transaction-form.transaction-details.name.label',
      );
      const description = screen.getByLabelText(
        'transaction-form.transaction-details.description.label',
      );
      fireEvent.change(name, { target: { value: 'My local supplier' } });
      fireEvent.blur(description);

      vi.mocked(useTransactionState).mockReturnValue({
        ...cachedTransaction,
        description: 'First server revision',
        name: 'First server supplier',
      });
      rerender(<ViewTransaction />);

      await waitFor(() =>
        expect(description).toHaveValue('First server revision'),
      );
      expect(name).toHaveValue('My local supplier');

      vi.mocked(useTransactionState).mockReturnValue({
        ...cachedTransaction,
        description: 'Second server revision',
        name: 'Second server supplier',
      });
      rerender(<ViewTransaction />);

      await waitFor(() =>
        expect(description).toHaveValue('Second server revision'),
      );
      expect(name).toHaveValue('My local supplier');
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
        const viewButton = await screen.findByText(
          'transaction-form.upload.view-file',
        );

        await act(async () => {
          fireEvent.click(viewButton);

          await waitForApollo(0);
        });

        await screen.findByRole('dialog');

        const downloadButton = await screen.findByLabelText('download');

        await act(async () => {
          fireEvent.click(downloadButton);

          await waitForApollo(0);
        });

        await waitFor(() =>
          expect(saveAs).toHaveBeenCalledWith('success', 'attachment.pdf'),
        );
      });

      it('should display a success toast when attachment is downloaded', async () => {
        const viewButton = await screen.findByText(
          'transaction-form.upload.view-file',
        );

        await act(async () => {
          fireEvent.click(viewButton);

          await waitForApollo(0);
        });

        await screen.findByRole('dialog');

        const downloadButton = await screen.findByLabelText('download');

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
        (fetch as Mock).mockResolvedValueOnce(
          createFetchResponse({
            body: 'fail',
            ok: false,
            status: 400,
          }),
        );

        const viewButton = await screen.findByText(
          'transaction-form.upload.view-file',
        );

        await act(async () => {
          fireEvent.click(viewButton);

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
          const [, , , , , , deleteButton] =
            await screen.findAllByRole('button');

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
        const viewButton = await screen.findByText(
          'transaction-form.upload.view-file',
        );

        await act(async () => {
          fireEvent.click(viewButton);

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
          const [, , , , , , deleteButton] =
            await screen.findAllByRole('button');

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
          const [, , , , , , deleteButton] =
            await screen.findAllByRole('button');

          await waitFor(() => expect(deleteButton).not.toBeDisabled());

          fireEvent.click(deleteButton);

          await waitForApollo(0);
        });

        await expect(
          screen.findByTestId('/my-companies/accounts/company-id'),
        ).resolves.toBeInTheDocument();
      });

      it('should display an error toast if file fails to delete', async () => {
        const viewButton = await screen.findByText(
          'transaction-form.upload.view-file',
        );

        await act(async () => {
          fireEvent.click(viewButton);

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
