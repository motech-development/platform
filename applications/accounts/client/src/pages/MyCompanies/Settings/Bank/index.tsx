import { ProtectedRoute } from '@motech-development/auth';
import { lazy } from 'react';
import { Switch } from 'react-router-dom';

const Callback = lazy(() => import('./Callback'));
const Bank = lazy(() => import('./Bank'));
const SelectAccount = lazy(() => import('./SelectAccount'));

function Routes() {
  return (
    <Switch>
      <ProtectedRoute
        exact
        component={Callback}
        path="/my-companies/settings/:companyId/bank/callback"
      />
      <ProtectedRoute
        exact
        component={SelectAccount}
        path="/my-companies/settings/:companyId/bank/select-account"
      />
      <ProtectedRoute
        exact
        component={Bank}
        path="/my-companies/settings/:companyId/bank"
      />
    </Switch>
  );
}

export default Routes;
