import { ProtectedRoute, useAuth, withAuth } from '@motech-development/auth';
import { Loader } from '@motech-development/breeze-ui';
import React, { FC, lazy, memo, Suspense } from 'react';
import IdleTimer from 'react-idle-timer';
import { Route, Switch } from 'react-router-dom';

const Dashboard = lazy(() => import('./pages/Dashboard'));
const Index = lazy(() => import('./pages/Index'));
const MyCompanies = lazy(() => import('./pages/MyCompanies/Routes'));
const NotFound = lazy(() => import('./pages/NotFound'));

const App: FC = () => {
  const { isAuthenticated, logout } = useAuth();
  const timeout = process.env.NODE_ENV === 'production' ? 600000 : 3600000;

  return (
    <Suspense fallback={<Loader />}>
      {isAuthenticated && <IdleTimer onIdle={logout} timeout={timeout} />}

      <Switch>
        <Route exact path="/" component={Index} />
        <ProtectedRoute
          exact
          path="/dashboard/:companyId"
          component={Dashboard}
        />
        <Route path="/my-companies" component={MyCompanies} />
        <Route component={NotFound} />
      </Switch>
    </Suspense>
  );
};

export default memo(withAuth(App));
