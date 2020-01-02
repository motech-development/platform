import React, {
  createContext,
  FC,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from 'react';
import createAuth0Client from '@auth0/auth0-spa-js';
// eslint-disable-next-line import/no-unresolved
import Auth0Client from '@auth0/auth0-spa-js/dist/typings/Auth0Client';

export interface Auth0User extends Omit<IdToken, '__raw'> {}

export interface IAuth0Context {
  getIdTokenClaims(o?: getIdTokenClaimsOptions): Promise<IdToken>;
  getTokenSilently(o?: GetTokenSilentlyOptions): Promise<string | undefined>;
  isAuthenticated: boolean;
  isLoading: boolean;
  loginWithRedirect(o?: RedirectLoginOptions): Promise<void>;
  logout(o?: LogoutOptions): void;
  user?: Auth0User;
}

export const Auth0Context = createContext<IAuth0Context | null>(null);

export const useAuth0 = () => useContext(Auth0Context)!;

export interface IAuth0ProviderProps {
  children: ReactNode;
}

const Auth0Provider: FC<IAuth0ProviderProps> = ({ children }) => {
  const [auth0Client, setAuth0Client] = useState<Auth0Client>();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<Auth0User>();

  useEffect(() => {
    (async function initializeAuth0() {
      const { REACT_APP_AUTH0_CLIENT_ID, REACT_APP_AUTH0_DOMAIN } = process.env;

      if (REACT_APP_AUTH0_CLIENT_ID && REACT_APP_AUTH0_DOMAIN) {
        const config = {
          client_id: REACT_APP_AUTH0_CLIENT_ID,
          domain: REACT_APP_AUTH0_DOMAIN,
          redirect_uri: window.location.origin,
        };

        const client = await createAuth0Client(config);

        setAuth0Client(client);

        if (window.location.search.includes('code=')) {
          // return handleRedirectCallback();
          await client.handleRedirectCallback();

          window.history.replaceState(
            {},
            document.title,
            window.location.pathname,
          );
        }

        const authenticated = await client.isAuthenticated();

        if (authenticated) {
          const retrievedUser = await client.getUser();

          setIsAuthenticated(authenticated);
          setUser(retrievedUser);
        }

        setIsLoading(false);
      }
    })();
  }, []);

  const getIdTokenClaims = (options?: getIdTokenClaimsOptions) =>
    auth0Client!.getIdTokenClaims(options);

  const getTokenSilently = (options?: GetTokenSilentlyOptions) =>
    auth0Client!.getTokenSilently(options);

  const loginWithRedirect = (options?: RedirectLoginOptions) =>
    auth0Client!.loginWithRedirect(options);

  const logout = (options?: LogoutOptions) => auth0Client!.logout(options);

  return (
    <Auth0Context.Provider
      value={{
        getIdTokenClaims,
        getTokenSilently,
        isAuthenticated,
        isLoading,
        loginWithRedirect,
        logout,
        user,
      }}
    >
      {children}
    </Auth0Context.Provider>
  );
};

export default Auth0Provider;
