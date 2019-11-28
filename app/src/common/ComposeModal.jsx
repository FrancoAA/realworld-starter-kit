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

import { Store } from './AppStore';
import { FETCH_ARTICLES } from './constants';
import { ArticlesService } from '../common/api.service';

const ComposeModal = ({ isOpen, closeModal }) => {
  const { state, dispatch } = useContext(Store);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    body: '',
    tagList: []
  });

  const updateValues = (name, value) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const publishArticle = async(user) => {
    const { id, username, bio, image, email } = user;
    const article = {
      author : {
        id,
        username,
        bio,
        image,
        email
      },
      ...formData
    };
    
    console.log('Article: ', article);
    
    ArticlesService.create(article);
    
    dispatch({
      type: FETCH_ARTICLES,
      payload: [ article, ...state.articles ]
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
          <IonTitle>Compose</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonList lines="full" class="ion-no-margin ion-no-padding">
          <IonItem>
            <IonLabel position="stacked">Title</IonLabel>
            <IonInput name="title" onIonChange={e => updateValues(e.target.name, e.target.value)}></IonInput>
          </IonItem>
          <IonItem>
            <IonLabel position="stacked">Description</IonLabel>
            <IonInput name="description" onIonChange={e => updateValues(e.target.name, e.target.value)}></IonInput>
          </IonItem>
          <IonItem>
            <IonLabel position="stacked">Content</IonLabel>
            <IonTextarea name="body" rows="10" onIonChange={e => updateValues(e.target.name, e.target.value)}></IonTextarea>
          </IonItem>
          <IonItem>
            <IonLabel position="stacked">Tags</IonLabel>
            <IonInput name="tagList" onIonChange={e => updateValues(e.target.name, e.target.value.split(/\s+/))}></IonInput>
          </IonItem>
        </IonList>
      </IonContent>
      <IonFooter>
        <IonButton expand="full" onClick={() => publishArticle(state.user)}>
          Publish
        </IonButton>
      </IonFooter>
    </IonModal>
  );
};

export default ComposeModal;
