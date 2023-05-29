import { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';

interface IConditionalRoutePropsWithChildren {
  children: ReactNode;
  condition: boolean;
  redirect: string;
}

interface IConditionalRoutePropsWithElement {
  element: JSX.Element;
  condition: boolean;
  redirect: string;
}

export type TConditionalRouteProps =
  | IConditionalRoutePropsWithChildren
  | IConditionalRoutePropsWithElement;

function ConditionalRoute({
  condition,
  redirect,
  ...rest
}: TConditionalRouteProps) {
  if (condition) {
    return 'children' in rest ? <>{rest.children}</> : rest.element;
  }

  return <Navigate to={redirect} />;
}

export default ConditionalRoute;
