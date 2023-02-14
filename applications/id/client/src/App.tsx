import {
  AppBar,
  BaseStyles,
  Loader,
  ToastProvider,
  Typography,
} from '@motech-development/breeze-ui';
import { lazy, Suspense } from 'react';
import { useTranslation } from 'react-i18next';
import { Route, Router, Switch } from 'react-router-dom';
import history from './history';
import Wrapper from './components/Wrapper';

const Login = lazy(() => import('./pages/Login'));
const Reset = lazy(() => import('./pages/Reset'));

function App() {
  const { t } = useTranslation();

  return (
    <Wrapper>
      <AppBar fixed>
        <Typography component="h1" variant="h4" margin="none">
          {t('app-name')}
        </Typography>
      </AppBar>

      <Suspense fallback={<Loader />}>
        <ToastProvider>
          <Router history={history}>
            <Switch>
              <Route exact path="/login" component={Login} />
              <Route exact path="/lo/reset" component={Reset} />
            </Switch>
          </Router>
        </ToastProvider>
      </Suspense>

      <BaseStyles />
    </Wrapper>
  );
}

export default App;
