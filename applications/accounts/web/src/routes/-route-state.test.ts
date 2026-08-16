import { accountsPendingView } from './-route-state';

describe('Accounts pending view', () => {
  it.each([
    [
      '/my-companies/accounts/company-1/record-transaction/',
      'record-transaction',
    ],
    [
      '/my-companies/accounts/company-1/record-transaction',
      'record-transaction',
    ],
    [
      '/my-companies/accounts/company-1/view-transaction/transaction-1',
      'transaction-details',
    ],
    [
      '/my-companies/accounts/company-1/pending-transactions/view-transaction/transaction-1',
      'pending-transaction-details',
    ],
    ['/my-companies/accounts/company-1', 'transactions'],
    ['/my-companies/clients/company-1', 'clients'],
    ['/my-companies/clients/company-1/add-client', 'add-client'],
    [
      '/my-companies/clients/company-1/update-details/client-1',
      'client-details',
    ],
    ['/my-companies/dashboard/company-1', 'dashboard'],
    ['/my-companies/update-details/company-1', 'company-details'],
    ['/my-companies/settings/company-1', 'settings'],
    ['/my-companies/add-company', 'add-company'],
    ['/my-companies', 'companies'],
    ['/', 'authentication'],
  ] as const)('maps %s to %s', (pathname, view) => {
    expect(accountsPendingView(pathname)).toBe(view);
  });
});
