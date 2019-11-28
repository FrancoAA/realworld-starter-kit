import React, { useState, useContext } from "react";

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

import { Store } from '../../../common/AppStore';
import { FETCH_ARTICLE_COMMENTS } from '../../../common/constants';
import { CommentsService } from '../../../common/api.service';

const CommentModal = ({ isOpen, closeModal }) => {
  const { state, dispatch } = useContext(Store);
  const { user, article, comments } = state;

  const [formData, setFormData] = useState({
    body: ''
  });

  const updateValues = (name, value) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const publishComment = async() => {
    console.log('Comment: ', formData);
    
    const { data } = await CommentsService.post(article.slug, formData.body);
    
    dispatch({
      type: FETCH_ARTICLE_COMMENTS,
      payload: [ data.comment, ...comments ]
    });

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
        <IonButton expand="full" onClick={() => publishComment()}>
          Publish
        </IonButton>
      </IonFooter>
    </IonModal>
  );
};

export default CommentModal;
