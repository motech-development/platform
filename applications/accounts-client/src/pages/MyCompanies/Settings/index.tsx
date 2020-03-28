import { ProtectedRoute } from '@motech-development/auth';
import React, { FC, lazy, memo } from 'react';
import { Switch } from 'react-router-dom';

const SelectBank = lazy(() => import('./SelectBank'));
const Settings = lazy(() => import('./Settings'));

const Routes: FC = () => (
  <Switch>
    <ProtectedRoute
      exact
      component={SelectBank}
      path="/my-companies/settings/:companyId/select-bank"
    />
    <ProtectedRoute
      exact
      component={Settings}
      path="/my-companies/settings/:companyId"
    />
  </Switch>
);

export default memo(Routes);
