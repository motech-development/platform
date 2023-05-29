import {
  AppBar,
  BaseStyles,
  Loader,
  ToastProvider,
  Typography,
} from '@motech-development/breeze-ui';
import { lazy, Suspense } from 'react';
import { useTranslation } from 'react-i18next';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
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
          <BrowserRouter>
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/lo/reset" element={<Reset />} />
            </Routes>
          </BrowserRouter>
        </ToastProvider>
      </Suspense>

      <BaseStyles />
    </Wrapper>
  );
}

export default App;
