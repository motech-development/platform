import { AuthProvider, IAppState } from '@motech-development/auth';
import React from 'react';
import { render } from 'react-dom';
import { Router } from 'react-router-dom';
import App from './App';
import history from './history';

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
      <App />
    </AuthProvider>
  </Router>,
  document.getElementById('root'),
);
