import React, { FC, memo } from 'react';
import { Redirect, Route, RouteProps } from 'react-router-dom';

export interface IConditionalRouteProps extends RouteProps {
  condition: boolean;
  redirect: string;
}

// eslint-disable-next-line react/jsx-props-no-spreading
const ConditionalRoute: FC<IConditionalRouteProps> = ({
  condition,
  redirect,
  ...rest
}) => (condition ? <Route {...rest} /> : <Redirect to={redirect} />);

export default memo(ConditionalRoute);
