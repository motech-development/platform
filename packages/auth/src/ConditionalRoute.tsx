import { FC, memo } from 'react';
import { Redirect, Route, RouteProps } from 'react-router-dom';

export interface IConditionalRouteProps extends RouteProps {
  condition: boolean;
  redirect: string;
}

const ConditionalRoute: FC<IConditionalRouteProps> = ({
  condition,
  redirect,
  ...rest
  // eslint-disable-next-line react/jsx-props-no-spreading
}) => (condition ? <Route {...rest} /> : <Redirect to={redirect} />);

export default memo(ConditionalRoute);
