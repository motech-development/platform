import { Auth0Provider } from '@auth0/auth0-react';
import {
  BaseStyles,
  ScrollToTop,
  ToastProvider,
} from '@motech-development/breeze-ui';
import sendToAnalytics from '@motech-development/ga-web-vitals';
import {
  BrowserTracing,
  init,
  reactRouterV6Instrumentation,
  Replay,
} from '@sentry/react';
import { StrictMode, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import { initialize } from 'react-ga';
import {
  BrowserRouter,
  createRoutesFromChildren,
  matchRoutes,
  useLocation,
  useNavigate,
  useNavigationType,
} from 'react-router-dom';
import App from './App';
import './i18n';
import reportWebVitals from './reportWebVitals';
import * as serviceWorkerRegistration from './serviceWorkerRegistration';
import invariant from './utils/invariant';

const {
  REACT_APP_AUTH0_AUDIENCE,
  REACT_APP_AUTH0_CLIENT_ID,
  REACT_APP_AUTH0_DOMAIN,
  REACT_APP_GA,
  REACT_APP_SENTRY_DSN,
} = process.env;

invariant(REACT_APP_SENTRY_DSN);

init({
  dsn: REACT_APP_SENTRY_DSN,
  integrations: [
    new BrowserTracing({
      routingInstrumentation: reactRouterV6Instrumentation(
        useEffect,
        useLocation,
        useNavigationType,
        createRoutesFromChildren,
        matchRoutes,
      ),
      tracePropagationTargets: ['localhost'],
    }),
    new Replay(),
  ],
  replaysOnErrorSampleRate: 1.0,
  replaysSessionSampleRate: 0.1,
  tracesSampleRate: 1.0,
});

invariant(REACT_APP_GA);

initialize(REACT_APP_GA);

function Bootstrap() {
  invariant(REACT_APP_AUTH0_AUDIENCE);
  invariant(REACT_APP_AUTH0_CLIENT_ID);
  invariant(REACT_APP_AUTH0_DOMAIN);

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
