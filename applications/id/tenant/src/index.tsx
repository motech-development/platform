import { Loader } from '@motech-development/breeze-ui';
import React, { FC, Suspense } from 'react';
import { hydrate, render } from 'react-dom';
import App from './App';
import './i18n';

const rootElement = document.getElementById('root');

const Bootstrap: FC = () => (
  <Suspense fallback={<Loader />}>
    <App />
  </Suspense>
);

if (rootElement?.hasChildNodes()) {
  hydrate(<Bootstrap />, rootElement);
} else {
  render(<Bootstrap />, rootElement);
}
