import { Auth0Provider } from '@auth0/auth0-react';
import {
  BaseStyles,
  ScrollToTop,
  ToastProvider,
} from '@motech-development/breeze-ui';
import sendToAnalytics from '@motech-development/ga-web-vitals';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { initialize } from 'react-ga';
import { BrowserRouter, useNavigate } from 'react-router-dom';
import App from './App';
import './i18n';
import reportWebVitals from './reportWebVitals';
import * as serviceWorkerRegistration from './serviceWorkerRegistration';

const {
  REACT_APP_AUTH0_AUDIENCE,
  REACT_APP_AUTH0_CLIENT_ID,
  REACT_APP_AUTH0_DOMAIN,
  REACT_APP_GA,
} = process.env;

if (!REACT_APP_GA) {
  throw new Error('Reporting error');
}

initialize(REACT_APP_GA);

function Bootstrap() {
  if (
    !REACT_APP_AUTH0_AUDIENCE ||
    !REACT_APP_AUTH0_CLIENT_ID ||
    !REACT_APP_AUTH0_DOMAIN
  ) {
    throw new Error('Auth error');
  }

  const navigate = useNavigate();

  return (
    <Auth0Provider
      authorizationParams={{
        audience: REACT_APP_AUTH0_AUDIENCE,
        redirect_uri: window.location.origin,
      }}
      cacheLocation="localstorage"
      clientId={REACT_APP_AUTH0_CLIENT_ID}
      domain={REACT_APP_AUTH0_DOMAIN}
      onRedirectCallback={(appState) => {
        navigate(
          appState && appState.returnTo
            ? appState.returnTo
            : window.location.pathname,
        );
      }}
      useRefreshTokens
    >
      <BaseStyles />

      <ScrollToTop />

      <ToastProvider>
        <App />
      </ToastProvider>
    </Auth0Provider>
  );
}

const container = document.getElementById('root');

if (container) {
  const root = createRoot(container);

  root.render(
    <StrictMode>
      <BrowserRouter>
        <Bootstrap />
      </BrowserRouter>
    </StrictMode>,
  );
}

serviceWorkerRegistration.register({
  onUpdate: (registration) => {
    registration.update().catch(() => {});
  },
});

reportWebVitals(sendToAnalytics);
