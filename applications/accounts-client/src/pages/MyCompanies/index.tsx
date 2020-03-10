import { ProtectedRoute } from '@motech-development/auth';
import React, { FC, lazy, memo } from 'react';
import { Route, Switch } from 'react-router-dom';

const AddCompany = lazy(() => import('./AddCompany'));
const Clients = lazy(() => import('./Clients'));
const Dashboard = lazy(() => import('./Dashboard'));
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
      component={Dashboard}
      path="/my-companies/dashboard/:companyId"
    />
    <Route component={Clients} path="/my-companies/clients/:companyId" />
    <ProtectedRoute
      exact
      component={UpdateDetails}
      path="/my-companies/update-details/:companyId"
    />
  </Switch>
);

export default memo(Routes);
