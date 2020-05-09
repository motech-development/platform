import { MockedProvider, MockedResponse } from '@apollo/react-testing';
import { act, render, RenderResult, wait } from '@testing-library/react';
import { createMemoryHistory, MemoryHistory } from 'history';
import React from 'react';
import GET_BALANCE from '../../../../graphql/balance/GET_BALANCE';
import TestProvider from '../../../../utils/TestProvider';
import Accounts from '../Accounts';

describe('Accounts', () => {
  let component: RenderResult;
  let history: MemoryHistory;
  let mocks: MockedResponse[];

  beforeEach(async () => {
    history = createMemoryHistory({
      initialEntries: ['/accounts/company-id'],
    });

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
          query: GET_BALANCE,
          variables: {
            id: 'company-id',
          },
        },
        result: {
          data: {
            getBalance: {
              balance: 200,
              currency: 'GBP',
              id: 'company-id',
              transactions: [
                {
                  balance: 0,
                  currency: 'GBP',
                  date: '2020-04-15T14:07:18+0000',
                  items: [],
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
                paid: 0,
              },
            },
          },
        },
      },
    ];

    await act(async () => {
      component = render(
        <TestProvider path="/accounts/:companyId" history={history}>
          <MockedProvider mocks={mocks} addTypename={false}>
            <Accounts />
          </MockedProvider>
        </TestProvider>,
      );

      await wait();
    });
  });

  it('should show the correct page title', async () => {
    const { findAllByRole } = component;
    const [, title] = await findAllByRole('heading');

    expect(title).toHaveTextContent('accounts.title');
  });

  it('should show the overview card', async () => {
    const { findAllByRole } = component;
    const [, , title] = await findAllByRole('heading');

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
    const [, , , title] = await findAllByRole('heading');

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
    const [, , , , title] = await findAllByRole('heading');

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
    const [, , , , , title] = await findAllByRole('heading');

    expect(title).toHaveTextContent('accounts.dashboard.title');
  });

  it('should have the correct dashboard link', async () => {
    const { findAllByRole } = component;
    const [, , link] = await findAllByRole('link');

    expect(link).toHaveAttribute('href', '/my-companies/dashboard/company-id');
  });

  it('should show the transaction list table', async () => {
    const { findByRole } = component;

    await expect(findByRole('table')).resolves.toBeInTheDocument();
  });
});
