export type AccountsPendingView =
  | 'add-company'
  | 'add-client'
  | 'authentication'
  | 'client-details'
  | 'clients'
  | 'companies'
  | 'company-details'
  | 'dashboard'
  | 'pending-transactions'
  | 'record-transaction'
  | 'settings'
  | 'transactions';

export function accountsPendingView(pathname: string): AccountsPendingView {
  if (pathname.includes('/record-transaction')) {
    return 'record-transaction';
  }

  if (pathname.includes('/my-companies/clients/')) {
    if (pathname.includes('/add-client')) return 'add-client';
    if (pathname.includes('/update-details/')) return 'client-details';
    return 'clients';
  }

  if (pathname.includes('/my-companies/accounts/')) {
    if (pathname.includes('/pending-transactions')) {
      return 'pending-transactions';
    }

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

  if (pathname.startsWith('/my-companies/add-company')) {
    return 'add-company';
  }

  if (pathname === '/my-companies') {
    return 'companies';
  }

  return 'authentication';
}
