import { AuthProvider, IAppState } from '@motech-development/auth';
import {
  BaseStyles,
  ScrollToTop,
  ToastProvider,
} from '@motech-development/breeze-ui';
import React from 'react';
import { render } from 'react-dom';
import { Router } from 'react-router-dom';
import App from './App';
import Apollo from './components/Apollo';
import history from './history';
import './i18n';

const onRedirectCallback = (appState: IAppState) => {
  history.push(
    appState && appState.targetUrl
      ? appState.targetUrl
      : window.location.pathname,
  );
};

render(
  <Router history={history}>
    <AuthProvider onRedirectCallback={onRedirectCallback}>
      <BaseStyles />

      <ScrollToTop />

      <Apollo>
        <ToastProvider>
          <App />
        </ToastProvider>
      </Apollo>
    </AuthProvider>
  </Router>,
  document.getElementById('root'),
);
