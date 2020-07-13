import { ProtectedRoute, useAuth } from '@motech-development/auth';
import { Loader } from '@motech-development/breeze-ui';
import React, { FC, lazy, memo, Suspense } from 'react';
import { Route, Switch } from 'react-router-dom';
import Apollo from '../../components/Apollo';
import Container from '../../components/Container';
import UserBar from '../../components/UserBar';
import UserNotifications from '../../components/UserNotifications';

const Accounts = lazy(() => import('./Accounts'));
const AddCompany = lazy(() => import('./AddCompany'));
const Clients = lazy(() => import('./Clients'));
const Dashboard = lazy(() => import('./Dashboard'));
const MyCompanies = lazy(() => import('./MyCompanies'));
const Settings = lazy(() => import('./Settings'));
const UpdateDetails = lazy(() => import('./UpdateDetails'));

// TODO: Replace with real data
const data = {
  getNotifications: {
    items: [
      {
        createdAt: '2020-07-01T00:00:00.000Z',
        message: 'A transaction has been published',
        read: false,
      },
      {
        createdAt: '2020-07-01T00:00:00.000Z',
        message: 'A transaction has been published',
        read: false,
      },
      {
        createdAt: '2020-07-01T00:00:00.000Z',
        message: 'An upload failed a virus scan',
        read: true,
      },
    ],
  },
};

const Routes: FC = () => {
  const { logout, user } = useAuth();
  const logOut = () =>
    logout({
      returnTo: window.location.origin,
    });

  return (
    <>
      {user && data && (
        <UserBar
          name={user.name}
          notifications={
            <UserNotifications
              messages={data.getNotifications.items}
              markAsRead={async () => {
                // TODO: Mark as read
              }}
            />
          }
          picture={user.picture}
          logOut={logOut}
        />
      )}

      <Suspense fallback={<Loader />}>
        <Apollo>
          <Container>
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
          </Container>
        </Apollo>
      </Suspense>
    </>
  );
};

export default memo(Routes);
