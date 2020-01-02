import React from 'react';
import { render } from 'react-dom';
import Auth0Provider from './contexts/auth0';
import App from './App';

render(
  <Auth0Provider>
    <App />
  </Auth0Provider>,
  document.getElementById('root'),
);
