import type { ComponentType } from 'react';
import { DashboardPageContent } from './DashboardPageContent';
import { PendingTransactionsPageContent } from './PendingTransactionsPageContent';
import { TransactionsPageContent } from './TransactionsPageContent';

export type TransactionPageOrigin = 'dashboard' | 'pending' | 'transactions';

type TransactionCollectionRoute =
  | '/my-companies/accounts/$companyId'
  | '/my-companies/accounts/$companyId/pending-transactions'
  | '/my-companies/dashboard/$companyId';

interface TransactionPageOriginConfiguration {
  Background: ComponentType<Readonly<{ companyId: string }>>;
  closeTo: TransactionCollectionRoute;
  confirmedReturnTo: Exclude<
    TransactionCollectionRoute,
    '/my-companies/accounts/$companyId/pending-transactions'
  >;
}

export const transactionPageOrigins = {
  dashboard: {
    Background: DashboardPageContent,
    closeTo: '/my-companies/dashboard/$companyId',
    confirmedReturnTo: '/my-companies/dashboard/$companyId',
  },
  pending: {
    Background: PendingTransactionsPageContent,
    closeTo: '/my-companies/accounts/$companyId/pending-transactions',
    confirmedReturnTo: '/my-companies/accounts/$companyId',
  },
  transactions: {
    Background: TransactionsPageContent,
    closeTo: '/my-companies/accounts/$companyId',
    confirmedReturnTo: '/my-companies/accounts/$companyId',
  },
} as const satisfies Record<
  TransactionPageOrigin,
  TransactionPageOriginConfiguration
>;
