export type AccountsPendingView =
  | 'add-company'
  | 'add-client'
  | 'authentication'
  | 'client-details'
  | 'clients'
  | 'companies'
  | 'company-details'
  | 'dashboard'
  | 'pending-record-transaction'
  | 'pending-transaction-details'
  | 'pending-transactions'
  | 'record-transaction'
  | 'settings'
  | 'transaction-details'
  | 'transactions';

interface PendingViewMatcher {
  readonly matches: (pathname: string) => boolean;
  readonly view: AccountsPendingView;
}

const includesPath = (segment: string) => (pathname: string) =>
  pathname.includes(segment);

// Keep specific drawer routes before their parent collection routes.
const pendingViewMatchers: readonly PendingViewMatcher[] = [
  {
    matches: includesPath('/pending-transactions/record-transaction'),
    view: 'pending-record-transaction',
  },
  {
    matches: includesPath('/record-transaction'),
    view: 'record-transaction',
  },
  {
    matches: includesPath('/pending-transactions/view-transaction/'),
    view: 'pending-transaction-details',
  },
  {
    matches: includesPath('/view-transaction/'),
    view: 'transaction-details',
  },
  {
    matches: (pathname) =>
      pathname.includes('/my-companies/clients/') &&
      pathname.includes('/add-client'),
    view: 'add-client',
  },
  {
    matches: (pathname) =>
      pathname.includes('/my-companies/clients/') &&
      pathname.includes('/update-details/'),
    view: 'client-details',
  },
  {
    matches: includesPath('/my-companies/clients/'),
    view: 'clients',
  },
  {
    matches: includesPath('/pending-transactions'),
    view: 'pending-transactions',
  },
  {
    matches: includesPath('/my-companies/accounts/'),
    view: 'transactions',
  },
  {
    matches: includesPath('/my-companies/dashboard/'),
    view: 'dashboard',
  },
  {
    matches: includesPath('/my-companies/update-details/'),
    view: 'company-details',
  },
  {
    matches: includesPath('/my-companies/settings/'),
    view: 'settings',
  },
  {
    matches: (pathname) => pathname.startsWith('/my-companies/add-company'),
    view: 'add-company',
  },
  {
    matches: (pathname) => pathname === '/my-companies',
    view: 'companies',
  },
];

export function accountsPendingView(pathname: string): AccountsPendingView {
  return (
    pendingViewMatchers.find(({ matches }) => matches(pathname))?.view ??
    'authentication'
  );
}
