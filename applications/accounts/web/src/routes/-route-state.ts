export type AccountsPendingView =
  | 'authentication'
  | 'companies'
  | 'company-details'
  | 'dashboard'
  | 'record-transaction'
  | 'settings'
  | 'transactions';

export function accountsPendingView(pathname: string): AccountsPendingView {
  if (pathname.includes('/record-transaction')) {
    return 'record-transaction';
  }

  if (pathname.includes('/my-companies/accounts/')) {
    return 'transactions';
  }

  if (pathname.includes('/my-companies/dashboard/')) {
    return 'dashboard';
  }

  if (pathname.includes('/my-companies/update-details/')) {
    return 'company-details';
  }

  if (pathname.includes('/my-companies/settings/')) {
    return 'settings';
  }

  if (
    pathname === '/my-companies' ||
    pathname.startsWith('/my-companies/add-company')
  ) {
    return 'companies';
  }

  return 'authentication';
}
