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

export interface AuthUser extends Omit<IdToken, '__raw'> {}

export interface IAuthContext {
  getIdTokenClaims(o?: getIdTokenClaimsOptions): Promise<IdToken>;
  getTokenSilently(o?: GetTokenSilentlyOptions): Promise<string | undefined>;
  isAuthenticated: boolean;
  isLoading: boolean;
  loginWithRedirect(o?: RedirectLoginOptions): Promise<void>;
  logout(o?: LogoutOptions): void;
  user?: AuthUser;
}

export const AuthContext = createContext<IAuthContext | null>(null);

export const useAuth = () => useContext(AuthContext)!;

export interface IAuthProviderProps {
  children: ReactNode;
}

const AuthProvider: FC<IAuthProviderProps> = ({ children }) => {
  const [auth0Client, setAuth0Client] = useState<Auth0Client>();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<AuthUser>();

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
    <AuthContext.Provider
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
    </AuthContext.Provider>
  );
};

export default AuthProvider;
