import { ProtectedRoute } from '@motech-development/auth';
import React, { FC, lazy, memo } from 'react';
import { Route, Switch } from 'react-router-dom';

const Bank = lazy(() => import('./Bank'));
const Settings = lazy(() => import('./Settings'));

const Routes: FC = () => (
  <Switch>
    <Route component={Bank} path="/my-companies/settings/:companyId/bank" />
    <ProtectedRoute
      exact
      component={Settings}
      path="/my-companies/settings/:companyId"
    />
  </Switch>
);

export default memo(Routes);
