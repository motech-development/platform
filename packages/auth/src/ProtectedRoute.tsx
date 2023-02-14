import { ComponentType, useEffect } from 'react';
import { Route, RouteProps } from 'react-router-dom';
import { useAuth } from './AuthProvider';

export interface IProtectedRouteProps extends RouteProps {
  component: ComponentType;
}

function ProtectedRoute({
  component: Component,
  path,
  ...rest
}: IProtectedRouteProps) {
  const { isAuthenticated, isLoading, loginWithRedirect } = useAuth();

  useEffect(() => {
    if (isLoading || isAuthenticated) {
      return;
    }

    loginWithRedirect({
      appState: {
        targetUrl: window.location.pathname,
      },
    })?.then(
      () => {},
      () => {},
    );
  }, [isAuthenticated, isLoading, loginWithRedirect]);

  return isAuthenticated ? (
    // eslint-disable-next-line react/jsx-props-no-spreading
    <Route path={path} component={Component} {...rest} />
  ) : null;
}

export default ProtectedRoute;
