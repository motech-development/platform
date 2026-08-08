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
    ['/my-companies/accounts/company-1', 'transactions'],
    ['/my-companies/dashboard/company-1', 'dashboard'],
    ['/my-companies/update-details/company-1', 'company-details'],
    ['/my-companies/settings/company-1', 'settings'],
    ['/my-companies/add-company', 'companies'],
    ['/my-companies', 'companies'],
    ['/', 'authentication'],
  ] as const)('maps %s to %s', (pathname, view) => {
    expect(accountsPendingView(pathname)).toBe(view);
  });
});
