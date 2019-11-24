import React from "react";

import {
  IonModal,
  IonButton,
  IonHeader,
  IonContent,
  IonToolbar,
  IonTitle,
  IonButtons,
  IonLabel,
  IonInput,
  IonList,
  IonTextarea,
  IonItem,
  IonFooter,
  IonIcon
} from "@ionic/react";

import { close } from 'ionicons/icons';

const EditProfileModal = ({ isOpen, closeModal }) => {
  return (
    <IonModal isOpen={isOpen}>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonButton onClick={closeModal}>
              <IonIcon icon={close}/>
            </IonButton>
          </IonButtons>
          <IonTitle>Edit Profile</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonList lines="full" class="ion-no-margin ion-no-padding">
          <IonItem>
            <IonLabel position="stacked">Avatar</IonLabel>
            <IonInput type="url"></IonInput>
          </IonItem>
          <IonItem>
            <IonLabel position="stacked">Username</IonLabel>
            <IonInput></IonInput>
          </IonItem>
          <IonItem>
            <IonLabel position="stacked">Bio</IonLabel>
            <IonTextarea></IonTextarea>
          </IonItem>
          <IonItem>
            <IonLabel position="stacked">Email</IonLabel>
            <IonInput></IonInput>
          </IonItem>
          <IonItem>
            <IonLabel position="stacked">New Password</IonLabel>
            <IonInput type="password"></IonInput>
          </IonItem>
        </IonList>
      </IonContent>
      <IonFooter>
        <IonButton expand="full" onClick={closeModal}>
          Update Settings
        </IonButton>
      </IonFooter>
    </IonModal>
  );
};

export default EditProfileModal;
