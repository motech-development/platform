import { ProtectedRoute, withAuth } from '@motech-development/auth';
import { Loader } from '@motech-development/breeze-ui';
import React, { FC, lazy, memo, Suspense } from 'react';
import { Route, Switch } from 'react-router-dom';

const PublicPage = lazy(() => import('./containers/PublicPage'));
const ProtectedPage = lazy(() => import('./containers/ProtectedPage'));

const App: FC = () => (
  <Suspense fallback={<Loader />}>
    <Switch>
      <Route exact path="/" component={PublicPage} />
      <ProtectedRoute exact path="/protected" component={ProtectedPage} />
    </Switch>
  </Suspense>
);

export default memo(withAuth(App));
