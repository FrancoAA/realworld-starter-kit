import React, { useState, useContext, useEffect } from "react";

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
  IonIcon,
} from "@ionic/react";

import { close } from "ionicons/icons";

import { Store } from "./AppStore";
import { useMutationPublishArticle } from '../common/hooks';

import { CREATE_ARTICLE, UPDATE_ARTICLE } from "./constants";
import { getProp } from "../common/utils";

const ComposeModal = ({ closeModal }) => {
  const formInitialState = {
    title: "",
    description: "",
    body: "",
    tagList: [],
  };

  const { state, dispatch } = useContext(Store);
  const { showComposeModal, edit, article } = state;
  const [formData, setFormData] = useState(formInitialState);
  const [editOrCreateArticle] = useMutationPublishArticle();

  useEffect(() => {
    setFormData(edit ? { ...article } : formInitialState);
  }, [showComposeModal]);

  const updateValues = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const publishArticle = async (user) => {
    const article = await editOrCreateArticle({ user, articleInfo: formData });

    if (!edit) {
      dispatch({
        type: CREATE_ARTICLE,
        payload: article,
      });
    } else {
      dispatch({
        type: UPDATE_ARTICLE,
        payload: article,
      });
    }

    closeModal();
  };

  return (
    <IonModal isOpen={showComposeModal}>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonButton onClick={closeModal}>
              <IonIcon icon={close} />
            </IonButton>
          </IonButtons>
          <IonTitle>Compose</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonList lines="full" class="ion-no-margin ion-no-padding">
          <IonItem>
            <IonLabel position="stacked">Title</IonLabel>
            <IonInput
              name="title"
              value={formData.title}
              onIonChange={(e) => updateValues(e.target.name, e.target.value)}
            ></IonInput>
          </IonItem>
          <IonItem>
            <IonLabel position="stacked">Description</IonLabel>
            <IonInput
              name="description"
              value={formData.description}
              onIonChange={(e) => updateValues(e.target.name, e.target.value)}
            ></IonInput>
          </IonItem>
          <IonItem>
            <IonLabel position="stacked">Content</IonLabel>
            <IonTextarea
              name="body"
              value={formData.body}
              rows="10"
              onIonChange={(e) => updateValues(e.target.name, e.target.value)}
            ></IonTextarea>
          </IonItem>
          <IonItem>
            <IonLabel position="stacked">Tags</IonLabel>
            <IonInput
              name="tagList"
              value={getProp(formData, "tagList", []).join(" ")}
              onIonChange={(e) =>
                updateValues(e.target.name, e.target.value.split(/\s+/))
              }
            ></IonInput>
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
