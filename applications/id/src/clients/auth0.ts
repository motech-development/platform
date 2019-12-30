import { WebAuth } from 'auth0-js';

interface IConfig {
  auth0Domain: string;
  callbackURL: string;
  clientID: string;
  internalOptions: object;
}

declare const config: IConfig;

const auth0 = new WebAuth({
  clientID: config.clientID,
  domain: config.auth0Domain,
  redirectUri: config.callbackURL,
  responseType: 'code',
  ...config.internalOptions,
});

export default auth0;
