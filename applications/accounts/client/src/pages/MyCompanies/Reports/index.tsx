import { ProtectedRoute } from '@motech-development/auth';
import { FC, lazy, memo } from 'react';
import { Switch } from 'react-router-dom';

const CreateReport = lazy(() => import('./CreateReport'));
const Reports = lazy(() => import('./Reports'));

const Routes: FC = () => (
  <Switch>
    <ProtectedRoute
      exact
      component={Reports}
      path="/my-companies/reports/:companyId"
    />
    <ProtectedRoute
      exact
      component={CreateReport}
      path="/my-companies/reports/:companyId/create-report"
    />
  </Switch>
);

export default memo(Routes);
