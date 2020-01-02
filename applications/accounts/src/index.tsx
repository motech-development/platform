import { AuthProvider } from '@motech-development/auth';
import React from 'react';
import { render } from 'react-dom';
import App from './App';

render(
  <AuthProvider>
    <App />
  </AuthProvider>,
  document.getElementById('root'),
);
