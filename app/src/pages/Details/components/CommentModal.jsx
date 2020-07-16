import React, { useState, useContext } from "react";
import { useMutation, queryCache } from 'react-query';

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

import { useMutationPostComment } from '../../../common/hooks';

const CommentModal = ({ isOpen, article, closeModal }) => {
  const [mutate] = useMutationPostComment(article);

  const [formData, setFormData] = useState({
    body: ''
  });

  const updateValues = (name, value) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const publishComment = async() => {
    await mutate(formData.body);
    closeModal();
  };

  return (
    <IonModal isOpen={isOpen}>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonButton onClick={closeModal}>
              <IonIcon icon={close}/>
            </IonButton>
          </IonButtons>
          <IonTitle>New Comment</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonList lines="full" class="ion-no-margin ion-no-padding">
          <IonItem>
            <IonLabel position="stacked">Comment</IonLabel>
            <IonTextarea name="body" rows="10" onIonChange={e => updateValues(e.target.name, e.target.value)}></IonTextarea>
          </IonItem>
        </IonList>
      </IonContent>
      <IonFooter>
        <IonButton expand="full" onClick={publishComment}>
          Publish
        </IonButton>
      </IonFooter>
    </IonModal>
  );
};

export default CommentModal;
