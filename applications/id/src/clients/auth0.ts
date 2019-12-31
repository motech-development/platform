import { WebAuth } from 'auth0-js';

interface IConfig {
  auth0Domain: string;
  callbackURL: string;
  clientID: string;
  internalOptions: object;
}

declare const auth0Config: IConfig;

const auth0 = new WebAuth({
  clientID: auth0Config.clientID,
  domain: auth0Config.auth0Domain,
  redirectUri: auth0Config.callbackURL,
  responseType: 'code',
  ...auth0Config.internalOptions,
});

export default auth0;
