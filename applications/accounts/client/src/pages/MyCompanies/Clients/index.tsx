import { ProtectedRoute } from '@motech-development/auth';
import { FC, lazy, memo } from 'react';
import { Switch } from 'react-router-dom';

const AddClient = lazy(() => import('./AddClient'));
const Clients = lazy(() => import('./Clients'));
const UpdateDetails = lazy(() => import('./UpdateDetails'));

const Routes: FC = () => (
  <Switch>
    <ProtectedRoute
      exact
      component={Clients}
      path="/my-companies/clients/:companyId"
    />
    <ProtectedRoute
      exact
      component={AddClient}
      path="/my-companies/clients/:companyId/add-client"
    />
    <ProtectedRoute
      exact
      component={UpdateDetails}
      path="/my-companies/clients/:companyId/update-details/:clientId"
    />
  </Switch>
);

export default memo(Routes);
