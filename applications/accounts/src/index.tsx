import Auth0Provider from '@motech-development/auth';
import React from 'react';
import { render } from 'react-dom';
import App from './App';

render(
  <Auth0Provider>
    <App />
  </Auth0Provider>,
  document.getElementById('root'),
);
