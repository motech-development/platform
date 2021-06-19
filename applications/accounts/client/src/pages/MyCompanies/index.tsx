import { ProtectedRoute, useAuth } from '@motech-development/auth';
import { Loader } from '@motech-development/breeze-ui';
import { FC, lazy, Suspense } from 'react';
import { Route, Switch } from 'react-router-dom';
import ApolloClient from '../../components/ApolloClient';
import Container from '../../components/Container';
import UserBar from '../../components/UserBar';
import UserNotifications from './UserNotifications';

const Accounts = lazy(() => import('./Accounts'));
const AddCompany = lazy(() => import('./AddCompany'));
const Clients = lazy(() => import('./Clients'));
const Dashboard = lazy(() => import('./Dashboard'));
const MyCompanies = lazy(() => import('./MyCompanies'));
const Reports = lazy(() => import('./Reports'));
const Settings = lazy(() => import('./Settings'));
const UpdateDetails = lazy(() => import('./UpdateDetails'));

const Routes: FC = () => {
  const { logout, user } = useAuth();
  const logOut = () =>
    logout({
      returnTo: window.location.origin,
    });

  return (
    <ApolloClient>
      {user && (
        <UserBar
          name={user.name}
          notifications={<UserNotifications id={user.sub} />}
          picture={user.picture}
          logOut={logOut}
        />
      )}

      <Suspense fallback={<Loader />}>
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
              component={Reports}
              path="/my-companies/reports/:companyId"
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
      </Suspense>
    </ApolloClient>
  );
};

export default Routes;
