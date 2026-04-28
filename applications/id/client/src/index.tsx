import { Loader } from '@motech-development/breeze-ui';
import sendToAnalytics from '@motech-development/ga-web-vitals';
import { BrowserTracing, init, Replay } from '@sentry/react';
import { StrictMode, Suspense } from 'react';
import { createRoot, hydrateRoot } from 'react-dom/client';
import { initialize } from 'react-ga';
import App from './App';
import reportWebVitals from './reportWebVitals';
import './i18n';

const { REACT_APP_GA, REACT_APP_SENTRY_DSN, STAGE } = process.env;

if (!REACT_APP_SENTRY_DSN) {
  throw new Error('Missing REACT_APP_SENTRY_DSN');
}

init({
  dsn: REACT_APP_SENTRY_DSN,
  enabled: process.env.NODE_ENV === 'production',
  environment: STAGE,
  integrations: [new BrowserTracing(), new Replay()],
  replaysOnErrorSampleRate: 1.0,
  replaysSessionSampleRate: 0.1,
  tracesSampleRate: 1.0,
});

if (!REACT_APP_GA) {
  throw new Error('Reporting error');
}

initialize(REACT_APP_GA);

const rootElement = document.getElementById('root') as HTMLElement;

function Bootstrap() {
  return (
    <StrictMode>
      <Suspense fallback={<Loader />}>
        <App />
      </Suspense>
    </StrictMode>
  );
}

if (rootElement.hasChildNodes()) {
  hydrateRoot(rootElement, <Bootstrap />);
} else {
  const root = createRoot(rootElement);

  root.render(<Bootstrap />);
}

reportWebVitals(sendToAnalytics);
