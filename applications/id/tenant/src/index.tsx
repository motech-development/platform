import { Loader } from '@motech-development/breeze-ui';
import sendToAnalytics from '@motech-development/ga-web-vitals';
import React, { FC, StrictMode, Suspense } from 'react';
import { hydrate, render } from 'react-dom';
import { initialize } from 'react-ga';
import App from './App';
import './i18n';
import reportWebVitals from './reportWebVitals';

const { REACT_APP_GA } = process.env;

if (!REACT_APP_GA) {
  throw new Error('Reporting error');
}

initialize(REACT_APP_GA);

const rootElement = document.getElementById('root');

const Bootstrap: FC = () => (
  <StrictMode>
    <Suspense fallback={<Loader />}>
      <App />
    </Suspense>
  </StrictMode>
);

if (rootElement?.hasChildNodes()) {
  hydrate(<Bootstrap />, rootElement);
} else {
  render(<Bootstrap />, rootElement);
}

reportWebVitals(sendToAnalytics);
