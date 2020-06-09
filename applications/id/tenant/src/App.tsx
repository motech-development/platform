import {
  AppBar,
  BaseStyles,
  Loader,
  ToastProvider,
  Typography,
} from '@motech-development/breeze-ui';
import React, { FC, memo, Suspense } from 'react';
import { Route, Router, Switch } from 'react-router-dom';
import history from './history';
import LogIn from './pages/LogIn';

const App: FC = () => (
  <Suspense fallback={<Loader />}>
    <AppBar>
      <Typography component="h1" variant="h4" margin="none">
        ID
      </Typography>
    </AppBar>

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
