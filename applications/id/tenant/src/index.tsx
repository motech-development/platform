import React from 'react';
import { hydrate, render } from 'react-dom';
import App from './App';

declare global {
  interface Window {
    config: {
      auth0Domain: string;
      callbackURL: string;
      clientID: string;
      dict: {
        signin: {
          title: string;
        };
      };
      internalOptions: object;
    };
  }
}

const rootElement = document.getElementById('root');

if (rootElement?.hasChildNodes()) {
  hydrate(<App />, rootElement);
} else {
  render(<App />, rootElement);
}
