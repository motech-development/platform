import React, { ExoticComponent, FC, useEffect } from 'react';
import { Route, RouteProps } from 'react-router-dom';
import { useAuth } from './AuthProvider';

export interface IProtectedRouteProps extends RouteProps {
  component: ExoticComponent;
}

const ProtectedRoute: FC<IProtectedRouteProps> = ({
  component: Component,
  path,
  ...rest
}) => {
  const { isAuthenticated, isLoading, loginWithRedirect } = useAuth();

  useEffect(() => {
    if (isLoading || isAuthenticated) {
      return;
    }

    (async () => {
      await loginWithRedirect({
        appState: {
          targetUrl: path,
        },
      });
    })();
  }, [isAuthenticated, isLoading, loginWithRedirect, path]);

  const render = (props: {}) =>
    // eslint-disable-next-line react/jsx-props-no-spreading
    isAuthenticated ? <Component {...props} /> : null;

  // eslint-disable-next-line react/jsx-props-no-spreading
  return <Route path={path} component={render} {...rest} />;
};

export default ProtectedRoute;
