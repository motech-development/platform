import { createAccountsCache } from '../../data/cache';
import {
  GET_COMPANY_DASHBOARD,
  GET_CONFIRMED_TRANSACTIONS,
} from '../../data/operations';
import { addConfirmedTransactionToCache } from './cache-updates';

const companyId = 'company-1';
const dashboardVariables = {
  count: 5,
  id: companyId,
  status: 'confirmed' as const,
};
const ledgerVariables = {
  count: 100,
  id: companyId,
  status: 'confirmed' as const,
};

function transaction(id: string, date: string) {
  return {
    __typename: 'Transaction' as const,
    amount: 10,
    attachment: null,
    category: 'Sales',
    date,
    description: `${id} description`,
    id,
    name: 'Example client',
  };
}

describe('AddTransaction cache outcome', () => {
  it('updates both populated confirmed views once without losing their other data', () => {
    const cache = createAccountsCache();
    const dashboardData = {
      getBalance: {
        __typename: 'Balance',
        balance: 100,
        currency: 'GBP',
        id: companyId,
        vat: { owed: 20, paid: 0 },
      },
      getCompany: {
        __typename: 'Company',
        companyNumber: '12345678',
        id: companyId,
        name: 'VAT registered co.',
      },
      getTransactions: {
        __typename: 'Transactions',
        id: companyId,
        items: [
          transaction('dashboard-transaction', '2026-07-26T00:00:00.000Z'),
        ],
        nextToken: null,
        status: 'confirmed' as const,
      },
    };
    const ledgerData = {
      getBalance: {
        __typename: 'Balance',
        balance: 100,
        currency: 'GBP',
        id: companyId,
        vat: { owed: 20, paid: 0 },
      },
      getTransactions: {
        __typename: 'Transactions',
        id: companyId,
        items: [transaction('ledger-transaction', '2026-07-25T00:00:00.000Z')],
        nextToken: 'next-page',
        status: 'confirmed' as const,
      },
    };

    cache.writeQuery({
      data: dashboardData,
      query: GET_COMPANY_DASHBOARD,
      variables: dashboardVariables,
    });
    cache.writeQuery({
      data: ledgerData,
      query: GET_CONFIRMED_TRANSACTIONS,
      variables: ledgerVariables,
    });
    const confirmedSale = {
      __typename: 'Transaction' as const,
      amount: 25,
      attachment: '',
      category: 'Sales',
      companyId,
      date: '2026-07-27T00:00:00.000Z',
      description: 'Consulting',
      id: 'transaction-1',
      name: 'Acme Ltd',
      refund: false,
      scheduled: false,
      status: 'confirmed' as const,
      vat: 5,
    };

    addConfirmedTransactionToCache(cache, confirmedSale);
    addConfirmedTransactionToCache(cache, confirmedSale);

    const dashboard = cache.readQuery({
      query: GET_COMPANY_DASHBOARD,
      variables: dashboardVariables,
    });
    const ledger = cache.readQuery({
      query: GET_CONFIRMED_TRANSACTIONS,
      variables: ledgerVariables,
    });

    expect(dashboard?.getTransactions.items.map(({ id }) => id)).toEqual([
      'transaction-1',
      'dashboard-transaction',
    ]);
    expect(dashboard?.getCompany.name).toBe('VAT registered co.');
    expect(dashboard?.getBalance.balance).toBe(100);
    expect(ledger?.getTransactions.items.map(({ id }) => id)).toEqual([
      'transaction-1',
      'ledger-transaction',
    ]);
    expect(ledger?.getTransactions.nextToken).toBe('next-page');
    expect(ledger?.getBalance.balance).toBe(100);
  });

  it('does not create a ledger that has not been loaded', () => {
    const cache = createAccountsCache();

    addConfirmedTransactionToCache(cache, {
      amount: 25,
      attachment: '',
      category: 'Sales',
      companyId,
      date: '2026-07-27T00:00:00.000Z',
      description: 'Consulting',
      id: 'transaction-1',
      name: 'Acme Ltd',
      refund: false,
      scheduled: false,
      status: 'confirmed',
      vat: 5,
    });

    expect(
      cache.readQuery({
        query: GET_COMPANY_DASHBOARD,
        variables: dashboardVariables,
      }),
    ).toBeNull();
    expect(
      cache.readQuery({
        query: GET_CONFIRMED_TRANSACTIONS,
        variables: ledgerVariables,
      }),
    ).toBeNull();
  });
});
