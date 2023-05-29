import { useAuth0 } from '@auth0/auth0-react';
import { ReactNode, useEffect } from 'react';

interface IProtectedRoutePropsWithChildren {
  children: ReactNode;
}

interface IProtectedRoutePropsWithElement {
  element: JSX.Element;
}

export type TProtectedRouteProps =
  | IProtectedRoutePropsWithChildren
  | IProtectedRoutePropsWithElement;

function ProtectedRoute({ ...props }: TProtectedRouteProps) {
  const { isAuthenticated, isLoading, loginWithRedirect } = useAuth0();

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

  if (isAuthenticated) {
    return 'children' in props ? <>{props.children}</> : props.element;
  }

  return null;
}

export default ProtectedRoute;
