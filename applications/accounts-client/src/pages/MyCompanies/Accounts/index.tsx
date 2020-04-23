import { ProtectedRoute } from '@motech-development/auth';
import React, { FC, lazy, memo } from 'react';
import { Switch } from 'react-router-dom';

const Accounts = lazy(() => import('./Accounts'));
const AddPurchase = lazy(() => import('./AddPurchase'));
const AddSale = lazy(() => import('./AddSale'));

const Routes: FC = () => (
  <Switch>
    <ProtectedRoute
      exact
      component={Accounts}
      path="/my-companies/accounts/:companyId"
    />
    <ProtectedRoute
      exact
      component={AddPurchase}
      path="/my-companies/accounts/:companyId/add-purchase"
    />
    <ProtectedRoute
      exact
      component={AddSale}
      path="/my-companies/accounts/:companyId/add-sale"
    />
  </Switch>
);

export default memo(Routes);
