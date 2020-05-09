import { ProtectedRoute } from '@motech-development/auth';
import React, { FC, lazy, memo } from 'react';
import { Switch } from 'react-router-dom';

const Accounts = lazy(() => import('./Accounts'));
const PendingTransactions = lazy(() => import('./PendingTransactions'));
const RecordTransaction = lazy(() => import('./RecordTransaction'));
const ViewTransaction = lazy(() => import('./ViewTransaction'));

const Routes: FC = () => (
  <Switch>
    <ProtectedRoute
      exact
      component={Accounts}
      path="/my-companies/accounts/:companyId"
    />
    <ProtectedRoute
      exact
      component={PendingTransactions}
      path="/my-companies/accounts/:companyId/pending-transactions"
    />
    <ProtectedRoute
      exact
      component={RecordTransaction}
      path="/my-companies/accounts/:companyId/record-transaction"
    />
    <ProtectedRoute
      exact
      component={ViewTransaction}
      path="/my-companies/accounts/:companyId/view-transaction/:transactionId"
    />
  </Switch>
);

export default memo(Routes);
