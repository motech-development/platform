import { ProtectedRoute } from '@motech-development/auth';
import React, { FC, lazy, memo } from 'react';
import { Switch } from 'react-router-dom';

const Accounts = lazy(() => import('./Accounts'));
const RecordTransaction = lazy(() => import('./RecordTransaction'));
const ViewPurchase = lazy(() => import('./ViewPurchase'));
const ViewSale = lazy(() => import('./ViewSale'));

const Routes: FC = () => (
  <Switch>
    <ProtectedRoute
      exact
      component={Accounts}
      path="/my-companies/accounts/:companyId"
    />
    <ProtectedRoute
      exact
      component={RecordTransaction}
      path="/my-companies/accounts/:companyId/record-transaction"
    />
    <ProtectedRoute
      exact
      component={ViewPurchase}
      path="/my-companies/accounts/:companyId/view-purchase/:transactionId"
    />
    <ProtectedRoute
      exact
      component={ViewSale}
      path="/my-companies/accounts/:companyId/view-sale/:transactionId"
    />
  </Switch>
);

export default memo(Routes);
