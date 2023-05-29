import { useAuth0 } from '@auth0/auth0-react';
import { Loader } from '@motech-development/breeze-ui';
import { lazy, Suspense } from 'react';
import { Route, Routes } from 'react-router-dom';
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

function MyCompaniesRoutes() {
  const { logout, user } = useAuth0();
  const logOut = () => {
    logout({
      logoutParams: {
        returnTo: window.location.origin,
      },
    });
  };

  return (
    <ApolloClient>
      {user && (
        <UserBar
          name={user.name as string}
          notifications={<UserNotifications id={user.sub as string} />}
          picture={user.picture as string}
          logOut={logOut}
        />
      )}

      <Suspense fallback={<Loader />}>
        <Container>
          <Routes>
            <Route element={<MyCompanies />} path="/" />
            <Route element={<AddCompany />} path="add-company" />
            <Route element={<Dashboard />} path="dashboard/:companyId" />
            <Route element={<Accounts />} path="accounts/:companyId/*" />
            <Route element={<Clients />} path="clients/:companyId/*" />
            <Route element={<Reports />} path="reports/:companyId/*" />
            <Route element={<Settings />} path="settings/:companyId" />
            <Route
              element={<UpdateDetails />}
              path="update-details/:companyId"
            />
          </Routes>
        </Container>
      </Suspense>
    </ApolloClient>
  );
}

export default MyCompaniesRoutes;
