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
  IonItem
} from "@ionic/react";

import { create } from "ionicons/icons";

import "./Profile.scss";

import { Store } from "../../common/AppStore";
import {
  FETCH_USER_ARTICLES,
  FETCH_USER_FAVORITED_ARTICLES
} from "../../common/constants";
import { ArticlesService } from "../../common/api.service";

import ListSkeleton from "../../common/ListSkeleton";
import EditProfileModal from "./components/EditProfileModal";

const Profile = () => {
  const { state, dispatch } = useContext(Store);
  const { user, userArticles, userFavorited } = state;
  const [section, setSection] = useState("my-articles");
  const [editProfile, setEditProfile] = useState(false);

  useEffect(() => {
    async function fetchUserArticles() {
      const { data } = await ArticlesService.query("", {
        author: user.username
      });

      dispatch({
        type: FETCH_USER_ARTICLES,
        payload: data.articles
      });
    }

    async function fetchUserFavoritedArticles() {
      const { data } = await ArticlesService.query("", {
        favorited: user.username
      });

      dispatch({
        type: FETCH_USER_FAVORITED_ARTICLES,
        payload: data.articles
      });
    }

    fetchUserArticles();
    fetchUserFavoritedArticles();
  }, []);

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
          <IonSegment onIonChange={e => setSection(e.detail.value)}>
            <IonSegmentButton
              value="my-articles"
              checked={section === "my-articles"}
            >
              <IonLabel>My Articles ({userArticles.length})</IonLabel>
            </IonSegmentButton>
            <IonSegmentButton
              value="favorite-articles"
              checked={section === "favorite-articles"}
            >
              <IonLabel>Favorited ({userFavorited.length})</IonLabel>
            </IonSegmentButton>
          </IonSegment>
        </IonToolbar>

        <IonList lines="full">
          {section === "my-articles" &&
            userArticles.map(article => (
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
            userFavorited.map(article => (
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

          {((section === "my-articles" && userArticles.length === 0) ||
            (section === "favorite-articles" && userFavorited.length === 0)) && (
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
