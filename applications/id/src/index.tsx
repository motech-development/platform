import { BaseStyles } from '@motech-development/breeze-ui';
import React from 'react';
import { render } from 'react-dom';
import { Router } from 'react-router-dom';
import App from './App';
import history from './history';

render(
  <Router history={history}>
    <BaseStyles />

    <App />
  </Router>,
  document.getElementById('root'),
);
