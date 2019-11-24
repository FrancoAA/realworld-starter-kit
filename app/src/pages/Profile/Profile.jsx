import React, { useState, useEffect } from "react";

import {
  IonHeader,
  IonToolbar,
  IonPage,
  IonTitle,
  IonContent,
  IonAvatar,
  IonButton,
  IonButtons,
  IonSegment,
  IonSegmentButton,
  IonLabel,
  IonIcon
} from "@ionic/react";

import { create } from 'ionicons/icons';

import './Profile.scss';

import ListSkeleton from '../../common/ListSkeleton';
import EditProfileModal from './components/EditProfileModal';

const Profile = () => {
  const [section, setSection] = useState('my-articles');
  const [editProfile, setEditProfile] = useState(false);

  return (
    <IonPage className="Profile">
      <IonHeader>
        <IonToolbar>
          <IonTitle>franco89</IonTitle>
          <IonButtons slot="end">
            <IonButton onClick={() => setEditProfile(true)}>
              <IonIcon icon={create} />
            </IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>

      <EditProfileModal isOpen={editProfile} closeModal={() => setEditProfile(false)}/>

      <IonContent>

        <div className="Profile-PageHeader">
          <div className="Profile-PageHeader_Avatar">
            <IonAvatar>
              <img src="https://placeimg.com/100/100/people" alt="avatar"/>
            </IonAvatar>
            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean tempor felis eros, id volutpat mauris rutrum vel. Mauris sagittis, nunc tristique sed.</p>
          </div>
        </div>

        <IonToolbar color="light">
          <IonSegment
              onIonChange={e => setSection(e.detail.value)}
            >
            <IonSegmentButton value="my-articles" checked={section === "my-articles"}>
              <IonLabel>My Articles</IonLabel>
            </IonSegmentButton>
            <IonSegmentButton value="favorite-articles" checked={section === "favorite-articles"}>
              <IonLabel>Favorite Articles</IonLabel>
            </IonSegmentButton>
          </IonSegment>
        </IonToolbar>

        {section === 'my-articles' && (
          <ListSkeleton items={5}/>
        )}

        {section === 'favorite-articles' && (
          <ListSkeleton items={5}/>
        )}

      </IonContent>
    </IonPage>
  );
};

export default Profile;
