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
  IonFooter
} from "@ionic/react";

import { lock } from "ionicons/icons";

import ErrorMessage from "./ErrorMessage/ErrorMessage";

const ComposeModal = ({ isOpen, closeModal }) => {
  return (
    <IonModal isOpen={isOpen}>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonButton onClick={closeModal}>Cancel</IonButton>
          </IonButtons>
          <IonTitle>Compose</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <ErrorMessage
          icon={lock}
          title="Login required"
          message="Please login or register to continue"
          callToActionComponent={<IonButton fill="outline">Login</IonButton>}
        />
        {/* <IonList lines="full" class="ion-no-margin ion-no-padding">
          <IonItem>
            <IonLabel position="stacked">Title</IonLabel>
            <IonInput></IonInput>
          </IonItem>
          <IonItem>
            <IonLabel position="stacked">Description</IonLabel>
            <IonInput></IonInput>
          </IonItem>
          <IonItem>
            <IonLabel position="stacked">Content</IonLabel>
            <IonTextarea></IonTextarea>
          </IonItem>
          <IonItem>
            <IonLabel position="stacked">Tags</IonLabel>
            <IonInput></IonInput>
          </IonItem>
        </IonList> */}
      </IonContent>
      <IonFooter>
        <IonButton expand="full" onClick={closeModal}>
          Publish
        </IonButton>
      </IonFooter>
    </IonModal>
  );
};

export default ComposeModal;
