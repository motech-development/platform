import React, {
  createContext,
  FC,
  memo,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from 'react';
import { useLocation } from 'react-router-dom';
import createAuth0Client, {
  Auth0Client,
  GetIdTokenClaimsOptions,
  GetTokenSilentlyOptions,
  IdToken,
  LogoutOptions,
  RedirectLoginOptions,
} from '@auth0/auth0-spa-js';

export type AuthUser = Omit<IdToken, '__raw'>;

export interface IAuthContext {
  getIdTokenClaims(o?: GetIdTokenClaimsOptions): Promise<IdToken>;
  getTokenSilently(o?: GetTokenSilentlyOptions): Promise<string | undefined>;
  isAuthenticated: boolean;
  isLoading: boolean;
  loginWithRedirect(o?: RedirectLoginOptions): Promise<void>;
  logout(o?: LogoutOptions): void;
  user?: AuthUser;
}

export const AuthContext = createContext<IAuthContext | null>(null);

export const useAuth = () => useContext(AuthContext)!;

const defaultRedirectCallback = () => {
  window.history.replaceState({}, document.title, window.location.pathname);
};

export interface IAppState {
  targetUrl: string;
}

export interface IAuthProviderProps {
  children: ReactNode;
  onRedirectCallback?(appState: IAppState): void;
}

const AuthProvider: FC<IAuthProviderProps> = ({
  children,
  onRedirectCallback = defaultRedirectCallback,
}) => {
  const [auth0Client, setAuth0Client] = useState<Auth0Client>();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<AuthUser>();
  const { pathname, search } = useLocation();

  useEffect(() => {
    (async () => {
      const {
        NODE_ENV,
        REACT_APP_AUTH0_AUDIENCE,
        REACT_APP_AUTH0_CLIENT_ID,
        REACT_APP_AUTH0_DOMAIN,
      } = process.env;

      if (
        NODE_ENV !== 'test' &&
        REACT_APP_AUTH0_AUDIENCE &&
        REACT_APP_AUTH0_CLIENT_ID &&
        REACT_APP_AUTH0_DOMAIN
      ) {
        const config = {
          audience: REACT_APP_AUTH0_AUDIENCE,
          client_id: REACT_APP_AUTH0_CLIENT_ID,
          domain: REACT_APP_AUTH0_DOMAIN,
          redirect_uri: window.location.origin,
        };

        const client = await createAuth0Client(config);

        setAuth0Client(client);
      }
    })();
  }, []);

  useEffect(() => {
    (async () => {
      if (auth0Client) {
        if (search.includes('code=')) {
          const { appState } = await auth0Client.handleRedirectCallback();

          onRedirectCallback(appState);
        }

        const authenticated = await auth0Client.isAuthenticated();

        if (authenticated) {
          const retrievedUser = await auth0Client.getUser();

          setIsAuthenticated(authenticated);
          setUser(retrievedUser);
        }

        setIsLoading(false);
      }
    })();
  }, [auth0Client, onRedirectCallback, pathname, search]);

  const getIdTokenClaims = (options?: GetIdTokenClaimsOptions) =>
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

export default memo(AuthProvider);
