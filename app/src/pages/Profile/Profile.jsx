import React, { useState, useEffect, useContext } from "react";

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
  IonIcon,
  IonList,
  IonItem,
} from "@ionic/react";

import { create } from "ionicons/icons";

import "./Profile.scss";

import { Store } from "../../common/AppStore";
import { useUserFavs, useUserArticles } from "../../common/hooks";

import EditProfileModal from "./components/EditProfileModal";

const Profile = () => {
  const { state } = useContext(Store);
  const { user } = state;
  const [section, setSection] = useState("my-articles");
  const [editProfile, setEditProfile] = useState(false);
  const { data: userArticles } = useUserArticles(user.username, {
    enabled: user,
  });
  const { data: userFavorited } = useUserFavs(user.username, { enabled: user });

  return (
    <IonPage className="Profile">
      <IonHeader>
        <IonToolbar>
          <IonTitle>{user.username}</IonTitle>
          <IonButtons slot="end">
            <IonButton onClick={() => setEditProfile(true)}>
              <IonIcon icon={create} />
            </IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>

      <EditProfileModal
        isOpen={editProfile}
        closeModal={() => setEditProfile(false)}
      />

      <IonContent>
        <div className="Profile-PageHeader">
          <div className="Profile-PageHeader_Avatar">
            <IonAvatar>
              <img src={user.image} alt="avatar" />
            </IonAvatar>
            <p>{user.bio}</p>
          </div>
        </div>

        <IonToolbar color="light">
          <IonSegment onIonChange={(e) => setSection(e.detail.value)}>
            <IonSegmentButton
              value="my-articles"
              checked={section === "my-articles"}
            >
              <IonLabel>
                My Articles ({(userArticles && userArticles.length) || 0})
              </IonLabel>
            </IonSegmentButton>
            <IonSegmentButton
              value="favorite-articles"
              checked={section === "favorite-articles"}
            >
              <IonLabel>
                Favorited ({(userFavorited && userFavorited.length) || 0})
              </IonLabel>
            </IonSegmentButton>
          </IonSegment>
        </IonToolbar>

        <IonList lines="full">
          {section === "my-articles" &&
            userArticles &&
            userArticles.map((article) => (
              <IonItem key={article.slug} routerLink={`/home/${article.slug}`}>
                <IonAvatar slot="start">
                  <img src={article.author.image} />
                </IonAvatar>
                <IonLabel>
                  <h2>{article.author.username}</h2>
                  <h3>{article.title}</h3>
                  <p>{article.description}</p>
                </IonLabel>
              </IonItem>
            ))}

          {section === "favorite-articles" &&
            userFavorited &&
            userFavorited.map((article) => (
              <IonItem key={article.slug} routerLink={`/home/${article.slug}`}>
                <IonAvatar slot="start">
                  <img src={article.author.image} />
                </IonAvatar>
                <IonLabel>
                  <h2>{article.author.username}</h2>
                  <h3>{article.title}</h3>
                  <p>{article.description}</p>
                </IonLabel>
              </IonItem>
            ))}

          {((section === "my-articles" &&
            userArticles &&
            userArticles.length === 0) ||
            (section === "favorite-articles" &&
              userFavorited &&
              userFavorited.length === 0)) && (
            <IonItem>
              <IonLabel>No articles are here... yet.</IonLabel>
            </IonItem>
          )}
        </IonList>
      </IonContent>
    </IonPage>
  );
};

export default Profile;
