import { WebAuth } from 'auth0-js';
import { useEffect, useState } from 'react';

const useAuth = () => {
  const [client, setClient] = useState<WebAuth>();

  useEffect(() => {
    const { config } = window;

    if (config) {
      const params = {
        ...config.internalOptions,
        clientID: config.clientID,
        domain: config.auth0Domain,
        redirectUri: config.callbackURL,
        responseType: 'code',
      };
      const webAuth = new WebAuth(params);

      setClient(webAuth);
    }
  }, []);

  return client as WebAuth;
};

export default useAuth;
