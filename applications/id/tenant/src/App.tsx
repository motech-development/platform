import {
  AppBar,
  BaseStyles,
  Loader,
  ToastProvider,
  Typography,
} from '@motech-development/breeze-ui';
import React, { FC, lazy, memo, Suspense } from 'react';
import { Route, Router, Switch } from 'react-router-dom';
import history from './history';
import AppTitle from './components/AppTitle';
import Window from './components/Window';

const Index = lazy(() => import('./pages/Index'));

const App: FC = () => (
  <>
    <AppBar>
      <Typography component="h1" variant="h4" margin="none">
        ID
      </Typography>
    </AppBar>

    <Suspense fallback={<Loader />}>
      <ToastProvider>
        <Router history={history}>
          <Window>
            <AppTitle />

            <Switch>
              <Route path="/" component={Index} />
            </Switch>
          </Window>
        </Router>
      </ToastProvider>
    </Suspense>

    <BaseStyles />
  </>
);

export default memo(App);
