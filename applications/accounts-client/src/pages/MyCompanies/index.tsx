import { ProtectedRoute, useAuth } from '@motech-development/auth';
import { Loader } from '@motech-development/breeze-ui';
import React, { FC, lazy, memo, Suspense } from 'react';
import { Route, Switch } from 'react-router-dom';
import Apollo from '../../components/Apollo';
import UserBar from '../../components/UserBar';

const Accounts = lazy(() => import('./Accounts'));
const AddCompany = lazy(() => import('./AddCompany'));
const Clients = lazy(() => import('./Clients'));
const Dashboard = lazy(() => import('./Dashboard'));
const MyCompanies = lazy(() => import('./MyCompanies'));
const Settings = lazy(() => import('./Settings'));
const UpdateDetails = lazy(() => import('./UpdateDetails'));

const Routes: FC = () => {
  const { logout, user } = useAuth();
  const logOut = () =>
    logout({
      returnTo: window.location.origin,
    });

  return (
    <>
      {user && (
        <UserBar name={user.name} picture={user.picture} logOut={logOut} />
      )}

      <Suspense fallback={<Loader />}>
        <Apollo>
          <Switch>
            <ProtectedRoute
              exact
              component={MyCompanies}
              path="/my-companies"
            />
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
            <Route
              component={Accounts}
              path="/my-companies/accounts/:companyId"
            />
            <Route
              component={Clients}
              path="/my-companies/clients/:companyId"
            />
            <Route
              component={Settings}
              path="/my-companies/settings/:companyId"
            />
            <ProtectedRoute
              exact
              component={UpdateDetails}
              path="/my-companies/update-details/:companyId"
            />
          </Switch>
        </Apollo>
      </Suspense>
    </>
  );
};

export default memo(Routes);
