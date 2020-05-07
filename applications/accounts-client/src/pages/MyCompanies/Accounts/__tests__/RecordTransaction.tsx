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
import { createMemoryHistory, MemoryHistory } from 'history';
import { advanceTo, clear } from 'jest-date-mock';
import React from 'react';
import GET_BALANCE from '../../../../graphql/balance/GET_BALANCE';
import TestProvider, { add } from '../../../../utils/TestProvider';
import RecordTransaction, {
  ADD_TRANSACTION,
  RECORD_TRANSACTION,
} from '../RecordTransaction';

describe('RecordTransaction', () => {
  let component: RenderResult;
  let history: MemoryHistory;
  let mocks: MockedResponse[];

  beforeAll(() => {
    advanceTo('2020-05-07T11:58:17+01:00');
  });

  beforeEach(async () => {
    history = createMemoryHistory({
      initialEntries: ['/accounts/company-id/record-transaction'],
    });

    jest.spyOn(history, 'push');

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
              items: [],
            },
            getSettings: {
              categories: [
                {
                  name: 'Equipment',
                  vatRate: 20,
                },
              ],
              vat: {
                pay: 20,
              },
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
              category: 'Equipment',
              companyId: 'company-id',
              date: '2020-05-07T10:58:17+00:00',
              description: 'Laptop',
              id: '',
              name: 'Apple',
              status: 'confirmed',
              vat: 166.66,
            },
          },
        },
        result: {
          data: {
            addTransaction: {
              companyId: 'company-id',
              id: 'transaction-id',
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
          <MockedProvider mocks={mocks} addTypename={false}>
            <RecordTransaction />
          </MockedProvider>
        </TestProvider>,
      );
    });
  });

  afterAll(() => {
    clear();
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

      await wait();

      const [, , button] = await findAllByRole('button');

      fireEvent.click(button);

      await apolloWait(0);

      await findByTestId('next-page');
    });

    expect(history.push).toHaveBeenCalledWith(
      '/my-companies/accounts/company-id',
    );
  });

  it('should display a success toast', async () => {
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

      await wait();

      const [, , button] = await findAllByRole('button');

      fireEvent.click(button);

      await apolloWait(0);

      await findByTestId('next-page');
    });

    expect(add).toHaveBeenCalledWith({
      colour: 'success',
      message: 'record-transaction.success',
    });
  });
});
