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

const Index = lazy(() => import('./pages/Index'));

const App: FC = () => {
  const { t } = useTranslation();

  return (
    <>
      <AppBar fixed>
        <Typography component="h1" variant="h4" margin="none">
          {t('app-name')}
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
};

export default memo(App);
