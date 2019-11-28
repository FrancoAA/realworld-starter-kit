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

import { close } from "ionicons/icons";

import { Store } from "../../../common/AppStore";
import { AUTH_FETCH_USER } from "../../../common/constants";
import ApiService from "../../../common/api.service";

const EditProfileModal = ({ isOpen, closeModal }) => {
  const { state, dispatch } = useContext(Store);
  const { user } = state;
  const [formData, setFormData] = useState({ ...user });

  const updateValues = (name, value) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleUpdateProfile = async () => {
    try {
      const { data } = await ApiService.put('user', { user: formData });
      dispatch({
        type: AUTH_FETCH_USER,
        payload: data.user
      });
    } catch (error) {
      console.error(error);
    } finally {
      closeModal();
    }
  };

  return (
    <IonModal isOpen={isOpen}>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonButton onClick={closeModal}>
              <IonIcon icon={close} />
            </IonButton>
          </IonButtons>
          <IonTitle>Edit Profile</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonList lines="full" class="ion-no-margin ion-no-padding">
          <IonItem>
            <IonLabel position="stacked">Avatar</IonLabel>
            <IonInput
              name="image"
              type="url"
              value={formData.image}
              onIonChange={e => updateValues(e.target.name, e.target.value)}
            ></IonInput>
          </IonItem>
          <IonItem>
            <IonLabel position="stacked">Username</IonLabel>
            <IonInput
              name="username"
              value={formData.username}
              onIonChange={e => updateValues(e.target.name, e.target.value)}
            />
          </IonItem>
          <IonItem>
            <IonLabel position="stacked">Bio</IonLabel>
            <IonTextarea
              name="bio"
              value={formData.bio}
              onIonChange={e => updateValues(e.target.name, e.target.value)}
            ></IonTextarea>
          </IonItem>
          <IonItem>
            <IonLabel position="stacked">Email</IonLabel>
            <IonInput
              name="email"
              value={formData.email}
              onIonChange={e => updateValues(e.target.name, e.target.value)}
            />
          </IonItem>
          <IonItem>
            <IonLabel position="stacked">New Password</IonLabel>
            <IonInput
              type="password"
              name="password"
              value={formData.password}
              onIonChange={e => updateValues(e.target.name, e.target.value)}
            />
          </IonItem>
        </IonList>
      </IonContent>
      <IonFooter>
        <IonButton expand="full" onClick={handleUpdateProfile}>
          Update Settings
        </IonButton>
      </IonFooter>
    </IonModal>
  );
};

export default EditProfileModal;
