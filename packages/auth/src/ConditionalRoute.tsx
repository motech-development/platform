import { Redirect, Route, RouteProps } from 'react-router-dom';

export interface IConditionalRouteProps extends RouteProps {
  condition: boolean;
  redirect: string;
}

function ConditionalRoute({
  condition,
  redirect,
  ...rest
}: IConditionalRouteProps) {
  // eslint-disable-next-line react/jsx-props-no-spreading
  return condition ? <Route {...rest} /> : <Redirect to={redirect} />;
}

export default ConditionalRoute;
