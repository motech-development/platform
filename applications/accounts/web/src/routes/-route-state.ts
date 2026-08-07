export type AccountsPendingView =
  | 'authentication'
  | 'companies'
  | 'dashboard'
  | 'record-transaction'
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

  if (pathname === '/my-companies') {
    return 'companies';
  }

  return 'authentication';
}
