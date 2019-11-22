import React from "react";

import {
  IonHeader,
  IonToolbar,
  IonPage,
  IonTitle,
  IonContent,
  IonAvatar,
  IonButton
} from "@ionic/react";

import { lock } from 'ionicons/icons';

import ErrorMessage from '../common/ErrorMessage/ErrorMessage';

const Profile = () => {
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Profile</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <ErrorMessage icon={lock} title="Login required" message="Please login or register to continue"
          callToActionComponent={
            <IonButton fill="outline">Login</IonButton>
          }/>
      </IonContent>
    </IonPage>
  );
};

export default Profile;
