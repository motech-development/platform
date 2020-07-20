import {
  IonApp,
  IonIcon,
  IonRouterOutlet,
  IonTabBar,
  IonTabButton,
  IonTabs,
} from '@ionic/react';
import { camera, list, person } from 'ionicons/icons';
import React, { FC } from 'react';
import { Redirect, Route } from 'react-router-dom';
import MyCompanies from './pages/MyCompanies';
import Profile from './pages/Profile';
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

const App: FC = () => (
  <IonApp>
    <IonTabs>
      <IonRouterOutlet>
        <Route exact path="/my-companies" component={MyCompanies} />
        <Route exact path="/profile" component={Profile} />
        <Route exact path="/" render={() => <Redirect to="/my-companies" />} />
      </IonRouterOutlet>

      <IonTabBar slot="bottom">
        <IonTabButton tab="my-companies" href="/my-companies">
          <IonIcon icon={list} />
        </IonTabButton>
        <IonTabButton tab="camera">
          <IonIcon icon={camera} />
        </IonTabButton>
        <IonTabButton tab="profile" href="/profile">
          <IonIcon icon={person} />
        </IonTabButton>
      </IonTabBar>
    </IonTabs>
  </IonApp>
);

export default withAuth(App);
