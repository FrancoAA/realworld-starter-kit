import React from "react";

import {
  IonHeader,
  IonToolbar,
  IonPage,
  IonTitle,
  IonContent,
  IonAvatar
} from "@ionic/react";

const Profile = () => {
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Profile</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <h1>User Profile</h1>
      </IonContent>
    </IonPage>
  );
};

export default Profile;
