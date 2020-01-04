import { ProtectedRoute, withAuth } from '@motech-development/auth';
import React, { FC, memo } from 'react';
import { Route, Switch } from 'react-router-dom';
import ProtectedPage from './containers/ProtectedPage';
import PublicPage from './containers/PublicPage';

const App: FC = () => (
  <Switch>
    <Route exact path="/" component={PublicPage} />
    <ProtectedRoute exact path="/protected" component={ProtectedPage} />
  </Switch>
);

export default memo(withAuth(App));
