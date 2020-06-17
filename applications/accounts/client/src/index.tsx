import { AuthProvider, IAppState } from '@motech-development/auth';
import {
  BaseStyles,
  ScrollToTop,
  ToastProvider,
} from '@motech-development/breeze-ui';
import sendToAnalytics from '@motech-development/ga-web-vitals';
import React, { StrictMode } from 'react';
import { render } from 'react-dom';
import { initialize, pageview, set } from 'react-ga';
import { Router } from 'react-router-dom';
import App from './App';
import history from './history';
import './i18n';
import reportWebVitals from './reportWebVitals';
import * as serviceWorker from './serviceWorker';

const { REACT_APP_GA } = process.env;

if (!REACT_APP_GA) {
  throw new Error('Reporting error');
}

initialize(REACT_APP_GA);

history.listen(location => {
  set({
    page: location.pathname,
  });
  pageview(location.pathname);
});

const onRedirectCallback = (appState: IAppState) => {
  history.push(
    appState && appState.targetUrl
      ? appState.targetUrl
      : window.location.pathname,
  );
};

render(
  <StrictMode>
    <Router history={history}>
      <AuthProvider onRedirectCallback={onRedirectCallback}>
        <BaseStyles />

        <ScrollToTop />

        <ToastProvider>
          <App />
        </ToastProvider>
      </AuthProvider>
    </Router>
  </StrictMode>,
  document.getElementById('root'),
);

serviceWorker.register({
  onUpdate: async registration => {
    await registration.update();
  },
});

reportWebVitals(sendToAnalytics);
