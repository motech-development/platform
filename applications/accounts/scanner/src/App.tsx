import {
  IonApp,
  IonIcon,
  IonRouterOutlet,
  IonTabBar,
  IonTabButton,
  IonTabs,
} from '@ionic/react';
import { camera, personCircleOutline, receipt } from 'ionicons/icons';
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

const Receipts = lazy(() => import('./pages/Receipts'));
const Profile = lazy(() => import('./pages/Profile'));

const App: FC = () => (
  <IonApp>
    <IonTabs>
      <IonRouterOutlet>
        <Route exact path="/receipts" component={Receipts} />
        <Route exact path="/profile" component={Profile} />
        <Route exact path="/" render={() => <Redirect to="/receipts" />} />
      </IonRouterOutlet>

      <IonTabBar color="dark" slot="bottom">
        <IonTabButton tab="receipts" href="/receipts">
          <IonIcon icon={receipt} />
        </IonTabButton>
        <IonTabButton tab="camera">
          <IonIcon icon={camera} />
        </IonTabButton>
        <IonTabButton tab="profile" href="/profile">
          <IonIcon icon={personCircleOutline} />
        </IonTabButton>
      </IonTabBar>
    </IonTabs>
  </IonApp>
);

export default withAuth(App);
