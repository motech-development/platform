import { ProtectedRoute } from '@motech-development/auth';
import React, { FC, lazy, memo } from 'react';
import { Switch } from 'react-router-dom';

const AddCompany = lazy(() => import('./AddCompany'));
const MyCompanies = lazy(() => import('./MyCompanies'));
const UpdateDetails = lazy(() => import('./UpdateDetails'));

const Routes: FC = () => (
  <Switch>
    <ProtectedRoute exact component={MyCompanies} path="/my-companies" />
    <ProtectedRoute
      exact
      component={AddCompany}
      path="/my-companies/add-company"
    />
    <ProtectedRoute
      exact
      component={UpdateDetails}
      path="/my-companies/update-details/:pk"
    />
  </Switch>
);

export default memo(Routes);
