import { Loader } from '@motech-development/breeze-ui';
import sendToAnalytics from '@motech-development/ga-web-vitals';
import { StrictMode, Suspense } from 'react';
import { createRoot, hydrateRoot } from 'react-dom/client';
import { initialize } from 'react-ga';
import App from './App';
import './i18n';
import reportWebVitals from './reportWebVitals';

const { REACT_APP_GA } = process.env;

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
