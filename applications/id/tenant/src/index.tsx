import { Loader } from '@motech-development/breeze-ui';
import React, { FC, StrictMode, Suspense } from 'react';
import { hydrate, render } from 'react-dom';
import App from './App';
import './i18n';

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
