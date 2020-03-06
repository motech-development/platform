import { ProtectedRoute } from '@motech-development/auth';
import React, { FC, lazy, memo } from 'react';
import { Switch } from 'react-router-dom';

const Clients = lazy(() => import('./Clients'));

const Routes: FC = () => (
  <Switch>
    <ProtectedRoute
      exact
      component={Clients}
      path="/my-companies/clients/:companyId"
    />
  </Switch>
);

export default memo(Routes);
