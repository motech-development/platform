import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { useLocation } from 'react-router-dom';
import createAuth0Client, {
  Auth0Client,
  GetIdTokenClaimsOptions,
  GetTokenSilentlyOptions,
  IdToken,
  LogoutOptions,
  PopupLoginOptions,
  RedirectLoginOptions,
} from '@auth0/auth0-spa-js';

export type TUseAuth = () => IAuthContext;

export type AuthUser = Omit<IdToken, '__raw'>;

export interface IAuthContext {
  buildAuthorizeUrl: (o?: RedirectLoginOptions) => Promise<string>;
  getIdTokenClaims: (
    o?: GetIdTokenClaimsOptions,
  ) => Promise<IdToken | undefined>;
  getTokenSilently: (
    o?: GetTokenSilentlyOptions,
  ) => Promise<string | undefined>;
  isAuthenticated: boolean;
  isLoading: boolean;
  loginWithPopup: (o?: PopupLoginOptions) => Promise<void>;
  loginWithRedirect: (o?: RedirectLoginOptions) => Promise<void>;
  logout: (o?: LogoutOptions) => void | Promise<void>;
  user?: AuthUser;
}

export const AuthContext = createContext<IAuthContext | null>(null);

export const useAuth: TUseAuth = () => useContext(AuthContext)!;

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

function AuthProvider({
  children,
  onRedirectCallback = defaultRedirectCallback,
}: IAuthProviderProps) {
  const {
    NODE_ENV,
    REACT_APP_AUTH0_AUDIENCE,
    REACT_APP_AUTH0_CLIENT_ID,
    REACT_APP_AUTH0_DOMAIN,
  } = process.env;

  const [auth0Client, setAuth0Client] = useState<Auth0Client>();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<AuthUser>();
  const { pathname, search } = useLocation();

  useEffect(() => {
    if (
      NODE_ENV !== 'test' &&
      REACT_APP_AUTH0_AUDIENCE &&
      REACT_APP_AUTH0_CLIENT_ID &&
      REACT_APP_AUTH0_DOMAIN
    ) {
      const config = {
        audience: REACT_APP_AUTH0_AUDIENCE,
        cacheLocation: 'localstorage' as const,
        client_id: REACT_APP_AUTH0_CLIENT_ID,
        domain: REACT_APP_AUTH0_DOMAIN,
        redirect_uri: window.location.origin,
        useRefreshTokens: true,
      };

      createAuth0Client(config).then(
        (client) => {
          setAuth0Client(client);
        },
        () => {},
      );
    }
  }, [
    NODE_ENV,
    REACT_APP_AUTH0_AUDIENCE,
    REACT_APP_AUTH0_CLIENT_ID,
    REACT_APP_AUTH0_DOMAIN,
  ]);

  useEffect(() => {
    if (auth0Client) {
      if (search.includes('code=')) {
        auth0Client.handleRedirectCallback<IAppState>().then(
          ({ appState }) => {
            if (appState) {
              onRedirectCallback(appState);
            }
          },
          () => {},
        );
      }

      auth0Client.isAuthenticated().then(
        async (authenticated) => {
          if (authenticated) {
            const retrievedUser = await auth0Client.getUser();

            setIsAuthenticated(authenticated);

            setUser(retrievedUser);
          }

          setIsLoading(false);
        },
        () => {},
      );
    }
  }, [auth0Client, onRedirectCallback, pathname, search]);

  const buildAuthorizeUrl = useCallback(
    (options?: RedirectLoginOptions) => auth0Client!.buildAuthorizeUrl(options),
    [auth0Client],
  );

  const getIdTokenClaims = useCallback(
    (options?: GetIdTokenClaimsOptions) =>
      auth0Client!.getIdTokenClaims(options),
    [auth0Client],
  );

  const getTokenSilently = useCallback(
    (options?: GetTokenSilentlyOptions) =>
      auth0Client!.getTokenSilently(options),
    [auth0Client],
  );

  const loginWithPopup = useCallback(
    (options?: PopupLoginOptions) => auth0Client!.loginWithPopup(options),
    [auth0Client],
  );

  const loginWithRedirect = useCallback(
    (options?: RedirectLoginOptions) => auth0Client!.loginWithRedirect(options),
    [auth0Client],
  );

  const logout = useCallback(
    (options?: LogoutOptions) => auth0Client!.logout(options),
    [auth0Client],
  );

  const value = useMemo(
    () => ({
      buildAuthorizeUrl,
      getIdTokenClaims,
      getTokenSilently,
      isAuthenticated,
      isLoading,
      loginWithPopup,
      loginWithRedirect,
      logout,
      user,
    }),
    [
      buildAuthorizeUrl,
      getIdTokenClaims,
      getTokenSilently,
      isAuthenticated,
      isLoading,
      loginWithPopup,
      loginWithRedirect,
      logout,
      user,
    ],
  );

  if (NODE_ENV === 'test') {
    return <>{children}</>;
  }

  if (!auth0Client) {
    return null;
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export default AuthProvider;
