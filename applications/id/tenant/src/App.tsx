import {
  AppBar,
  BaseStyles,
  Loader,
  ToastProvider,
  Typography,
  Window,
} from '@motech-development/breeze-ui';
import React, { FC, lazy, memo, Suspense } from 'react';
import { useTranslation } from 'react-i18next';
import { Route, Router, Switch } from 'react-router-dom';
import history from './history';
import AppTitle from './components/AppTitle';
import Wrapper from './components/Wrapper';

const Login = lazy(() => import('./pages/Login'));
const Reset = lazy(() => import('./pages/Reset'));

const App: FC = () => {
  const { t } = useTranslation();
  const showContent = window.passwordReset || window.config;

  return (
    <Wrapper>
      <AppBar fixed>
        <Typography component="h1" variant="h4" margin="none">
          {t('app-name')}
        </Typography>
      </AppBar>

      <Suspense fallback={<Loader />}>
        <ToastProvider>
          {showContent ? (
            <Window>
              <AppTitle />

              <Router history={history}>
                <Switch>
                  <Route exact path="/login" component={Login} />
                  <Route exact path="/lo/reset" component={Reset} />
                </Switch>
              </Router>
            </Window>
          ) : (
            <Loader />
          )}
        </ToastProvider>
      </Suspense>

      <BaseStyles />
    </Wrapper>
  );
};

export default memo(App);
