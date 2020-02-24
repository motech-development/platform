import React, { FC, lazy, memo } from 'react';
import { Route, Switch } from 'react-router-dom';

const MyCompanies = lazy(() => import('./MyCompanies'));

const Routes: FC = () => (
  <Switch>
    <Route component={MyCompanies} path="/my-companies" />
  </Switch>
);

export default memo(Routes);
