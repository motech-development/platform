import { createRouter } from '@tanstack/react-router';
import {
  createAccountsAuthenticationProvider,
  createRouterAuthentication,
} from './auth/router';
import { readAccountsWebConfig } from './config';
import {
  createAccountsApolloClient,
  routerWithApolloClient,
} from './data/client';
import {
  PublicRouteNotFound,
  RouteError,
  RoutePending,
} from './routes/-RouteState';
import { routeTree } from './routeTree.gen';

export function getRouter() {
  const config = readAccountsWebConfig();
  const apolloClient = createAccountsApolloClient(config);
  const authentication = createRouterAuthentication();
  const router = createRouter({
    context: {
      ...routerWithApolloClient.defaultContext,
      authentication,
    },
    defaultErrorComponent: RouteError,
    defaultNotFoundComponent: PublicRouteNotFound,
    defaultPendingComponent: RoutePending,
    defaultPreload: 'intent',
    notFoundMode: 'root',
    routeTree,
    scrollRestoration: true,
  });

  router.update({
    ...router.options,
    Wrap: createAccountsAuthenticationProvider({
      apolloClient,
      authentication,
      config,
      router,
    }),
  });

  return routerWithApolloClient(router, apolloClient);
}

declare module '@tanstack/react-router' {
  interface Register {
    router: ReturnType<typeof getRouter>;
  }
}
