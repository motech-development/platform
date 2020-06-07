import {
  BaseStyles,
  Loader,
  ToastProvider,
} from '@motech-development/breeze-ui';
import React, { FC, memo, Suspense } from 'react';
import { Route, Router, Switch } from 'react-router-dom';
import history from './history';
import LogIn from './pages/LogIn';

const App: FC = () => (
  <Suspense fallback={<Loader />}>
    <ToastProvider>
      <Router history={history}>
        <Switch>
          <Route path="/" component={LogIn} />
        </Switch>
      </Router>
    </ToastProvider>

    <BaseStyles />
  </Suspense>
);

export default memo(App);
