import {
  IonApp,
  IonIcon,
  IonLoading,
  IonRouterOutlet,
  IonTabBar,
  IonTabButton,
  IonTabs,
} from '@ionic/react';
import { Apollo } from '@motech-development/appsync-apollo';
import { useAuth } from '@motech-development/auth';
import {
  businessOutline,
  personCircleOutline,
  scanOutline,
} from 'ionicons/icons';
import React, { FC, lazy } from 'react';
import { Redirect, Route } from 'react-router-dom';
import withAuth from './utils/withAuth';

/* Core CSS required for Ionic components to work properly */
import '@ionic/react/css/core.css';

/* Basic CSS for apps built with Ionic */
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';

/* Optional CSS utils that can be commented out */
import '@ionic/react/css/padding.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/display.css';

/* Theme variables */
import './theme/variables.css';

const ErrorPage = lazy(() => import('./components/ErrorPage'));
const MyCompanies = lazy(() => import('./pages/MyCompanies'));
const Profile = lazy(() => import('./pages/Profile'));
const Scan = lazy(() => import('./pages/Scan'));
const Transactions = lazy(() => import('./pages/Transactions'));

const App: FC = () => {
  const { getTokenSilently, isAuthenticated, isLoading } = useAuth();

  return (
    <IonApp>
      <Apollo
        error={<ErrorPage namespace="error" />}
        fallback={<IonLoading isOpen />}
        getTokenSilently={getTokenSilently}
        isAuthenticated={isAuthenticated}
        isLoading={isLoading}
        unauthorised={<ErrorPage namespace="unauthorised" />}
      >
        <IonTabs>
          <IonRouterOutlet>
            <Route exact path="/my-companies" component={MyCompanies} />
            <Route exact path="/profile" component={Profile} />
            <Route exact path="/scan" component={Scan} />
            <Route
              exact
              path="/transactions/:companyId"
              component={Transactions}
            />
            <Route
              exact
              path="/"
              render={() => <Redirect to="/my-companies" />}
            />
          </IonRouterOutlet>

          <IonTabBar slot="bottom">
            <IonTabButton tab="my-companies" href="/my-companies">
              <IonIcon icon={businessOutline} />
            </IonTabButton>

            <IonTabButton tab="scan" href="/scan">
              <IonIcon icon={scanOutline} />
            </IonTabButton>

            <IonTabButton tab="profile" href="/profile">
              <IonIcon icon={personCircleOutline} />
            </IonTabButton>
          </IonTabBar>
        </IonTabs>
      </Apollo>
    </IonApp>
  );
};

export default withAuth(App);
