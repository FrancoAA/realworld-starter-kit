import React, { useState } from 'react';
import { Redirect, Route } from 'react-router-dom';
import {
  IonApp,
  IonIcon,
  IonLabel,
  IonRouterOutlet,
  IonTabBar,
  IonTabButton,
  IonTabs,
  IonFab,
  IonFabButton,
  IonButton
} from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import { apps, flash, send, home, search, contact, add, create } from 'ionicons/icons';
import Home from './pages/Home/Home';
import Search from './pages/Search';
import Profile from './pages/Profile/Profile';
import Details from './pages/Details';

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

import ComposeModal from './common/ComposeModal';
import { LoginPage, LoginWithAuth } from './pages/Login/Login';
import { AuthConsumer, AuthProvider } from './common/AuthContextProvider';

const App = () =>  {
  const [show, showModal] = useState(false);

  return (
  <AuthProvider fake={true}>
    <IonApp>
      <LoginWithAuth protectedComponent={
        <>
          <ComposeModal isOpen={show} closeModal={() => showModal(false)}/>

          <IonFab horizontal="center" vertical="bottom">
            <IonFabButton onClick={() => showModal(true)}>
              <IonIcon icon={add} />
            </IonFabButton>
          </IonFab>

          <IonReactRouter>
            <IonTabs>
              <IonRouterOutlet>
                <Route path="/home" component={Home} exact={true} />
                <Route path="/home/:slug" component={Details} />
                <Route path="/search" component={Search} exact={true} />
                <Route path="/search/details" component={Details} />
                <Route path="/profile" component={Profile} />
                <Route path="/" render={() => <Redirect to="/home" />} exact={true} />
              </IonRouterOutlet>
              <IonTabBar color="light" slot="bottom">
                <IonTabButton tab="home" href="/home">
                  <IonIcon icon={home} />
                  <IonLabel>Home</IonLabel>
                </IonTabButton>
                <IonTabButton tab="">
                </IonTabButton>
                <IonTabButton tab="profile" href="/profile">
                  <IonIcon icon={contact} />
                  <IonLabel>Profile</IonLabel>
                </IonTabButton>
              </IonTabBar>
            </IonTabs>
          </IonReactRouter>
        </>
      }/>
    </IonApp>
  </AuthProvider>
  );
};

export default App;
