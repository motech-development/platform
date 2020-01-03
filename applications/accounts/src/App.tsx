import {
  AuthProvider,
  IAppState,
  ProtectedRoute,
} from '@motech-development/auth';
import React, { FC, memo } from 'react';
import { Route, Router, Switch } from 'react-router-dom';
import ProtectedPage from './containers/ProtectedPage';
import PublicPage from './containers/PublicPage';
import history from './history';

const onRedirectCallback = (appState: IAppState) => {
  history.push(
    appState && appState.targetUrl
      ? appState.targetUrl
      : window.location.pathname,
  );
};

const App: FC = () => (
  <Router history={history}>
    <AuthProvider onRedirectCallback={onRedirectCallback}>
      <Switch>
        <Route exact path="/" component={PublicPage} />
        <ProtectedRoute exact path="/protected" component={ProtectedPage} />
      </Switch>
    </AuthProvider>
  </Router>
);

export default memo(App);
