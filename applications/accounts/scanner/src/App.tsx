import {
  IonApp,
  IonIcon,
  IonRouterOutlet,
  IonTabBar,
  IonTabButton,
  IonTabs,
} from '@ionic/react';
import {
  personCircleOutline,
  receiptOutline,
  scanOutline,
} from 'ionicons/icons';
import React, { FC, lazy } from 'react';
import { Redirect, Route } from 'react-router-dom';
import bootstrap from './utils/bootstrap';

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

const Profile = lazy(() => import('./pages/Profile'));
const Receipts = lazy(() => import('./pages/Receipts'));
const Scan = lazy(() => import('./pages/Scan'));

const App: FC = () => (
  <IonApp>
    <IonTabs>
      <IonRouterOutlet>
        <Route exact path="/profile" component={Profile} />
        <Route exact path="/receipts" component={Receipts} />
        <Route exact path="/scan" component={Scan} />
        <Route exact path="/" render={() => <Redirect to="/receipts" />} />
      </IonRouterOutlet>

      <IonTabBar color="dark" slot="bottom">
        <IonTabButton tab="receipts" href="/receipts">
          <IonIcon icon={receiptOutline} />
        </IonTabButton>

        <IonTabButton tab="scan" href="/scan">
          <IonIcon icon={scanOutline} />
        </IonTabButton>

        <IonTabButton tab="profile" href="/profile">
          <IonIcon icon={personCircleOutline} />
        </IonTabButton>
      </IonTabBar>
    </IonTabs>
  </IonApp>
);

export default bootstrap(App);
