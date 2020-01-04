import { ProtectedRoute, withAuth } from '@motech-development/auth';
import { Loader } from '@motech-development/breeze-ui';
import React, { FC, lazy, memo, Suspense } from 'react';
import { Route, Switch } from 'react-router-dom';

const Dashboard = lazy(() => import('./pages/Dashboard'));
const Index = lazy(() => import('./pages/Index'));

const App: FC = () => (
  <Suspense fallback={<Loader />}>
    <Switch>
      <Route exact path="/" component={Index} />
      <ProtectedRoute exact path="/dashboard" component={Dashboard} />
    </Switch>
  </Suspense>
);

export default memo(withAuth(App));
