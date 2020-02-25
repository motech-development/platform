import React, { FC, lazy, memo } from 'react';
import { Route, Switch } from 'react-router-dom';

const AddCompany = lazy(() => import('./AddCompany'));
const MyCompanies = lazy(() => import('./MyCompanies'));
const UpdateDetails = lazy(() => import('./UpdateDetails'));

const Routes: FC = () => (
  <Switch>
    <Route exact component={MyCompanies} path="/my-companies" />
    <Route exact component={AddCompany} path="/my-companies/add-company" />
    <Route
      exact
      component={UpdateDetails}
      path="/my-companies/update-details/:pk"
    />
  </Switch>
);

export default memo(Routes);
