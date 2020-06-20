import { Management } from 'auth0-js';
import { useEffect, useState } from 'react';

const useManagement = () => {
  const [client, setClient] = useState<Management>();

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
      const webAuth = new Management(params);

      setClient(webAuth);
    }
  }, []);

  return client!;
};

export default useManagement;
