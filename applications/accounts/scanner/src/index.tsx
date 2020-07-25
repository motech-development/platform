import { Capacitor, Plugins, StatusBarStyle } from '@capacitor/core';
import { IonReactRouter } from '@ionic/react-router';
import { AuthProvider, IAppState } from '@motech-development/auth';
import React from 'react';
import { render } from 'react-dom';
import App from './App';
import history from './history';
import './i18n';
import * as serviceWorker from './serviceWorker';

const { App: CapacitorApp, Browser, StatusBar } = Plugins;

if (Capacitor.isNative) {
  (async () => {
    await StatusBar.setStyle({
      style: StatusBarStyle.Dark,
    });
  })();

  CapacitorApp.addListener('appUrlOpen', async ({ url }) => {
    if (url) {
      await Browser.close();

      const { pathname, search } = new URL(url);

      if (pathname || search) {
        history.push(pathname + search);
      }
    }
  });
}

const onRedirectCallback = (appState: IAppState) => {
  history.push(
    appState && appState.targetUrl
      ? appState.targetUrl
      : window.location.pathname,
  );
};

render(
  <IonReactRouter history={history}>
    <AuthProvider onRedirectCallback={onRedirectCallback}>
      <App />
    </AuthProvider>
  </IonReactRouter>,
  document.getElementById('root'),
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
