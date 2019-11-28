import React, { useEffect, useState, useContext } from "react";

import {
  IonContent,
  IonIcon,
  IonItem,
  IonLabel,
  IonList,
  IonPage,
  IonTitle,
  IonToolbar,
  IonAvatar,
  IonButton,
  IonButtons,
  IonSegment,
  IonSegmentButton,
  IonHeader,
  IonChip,
  IonRefresher,
  IonRefresherContent
} from "@ionic/react";

import { closeCircle, funnel } from "ionicons/icons";
import { usePaginator } from "../../common/utils";

import { Store } from "../../common/AppStore";
import {
  SET_LOADING,
  SET_TAG_FILTER,
  FETCH_ARTICLES,
  FETCH_TAGS
} from "../../common/constants";

import { ArticlesService, TagsService } from "../../common/api.service";

import ListSkeleton from "../../common/ListSkeleton";
import TagsPopover from "./components/TagsPopover";

import "./Home.scss";

const Home = () => {
  const { state, dispatch } = useContext(Store);

  const [paginator, nextPage] = usePaginator(10);
  const [section, setSection] = useState("global");
  const [showPopover, setShowPopover] = useState(false);

  async function fetchArticles(type, tag) {
    dispatch({
      type: SET_LOADING,
      payload: true
    });

    const { data } = await ArticlesService.query(type, { ...paginator, tag });

    dispatch({
      type: FETCH_ARTICLES,
      payload: data.articles
    });

    dispatch({
      type: SET_LOADING,
      payload: false
    });
  }

  useEffect(() => {
    async function fetchTags() {
      const { data } = await TagsService.get();

      dispatch({
        type: FETCH_TAGS,
        payload: data.tags
      });
    }

    fetchTags();
  }, []);

  useEffect(() => {
    fetchArticles(
      section === "personal" ? "feed" : "",
      section === "personal" ? null : state.tagFilter
    );
  }, [paginator, state.tagFilter, section]);

  const handleSelectTag = tag => {
    dispatch({
      type: SET_TAG_FILTER,
      payload: tag
    });

    setShowPopover(false);
  };

  const clearFilters = () => {
    dispatch({
      type: SET_TAG_FILTER,
      payload: null
    });
  };

  const doRefresh = async evt => {
    await fetchArticles(
      section === "personal" ? "feed" : "",
      section === "personal" ? null : state.tagFilter
    );
    evt.detail.complete();
  };

  return (
    <IonPage className="Home">
      <IonHeader>
        <IonToolbar color="light">
          <IonTitle>Home</IonTitle>
          <IonButtons slot="end">
            <IonButton onClick={() => setShowPopover(true)}>
              <IonIcon icon={funnel}></IonIcon>
            </IonButton>
          </IonButtons>
        </IonToolbar>

        <IonToolbar color="light">
          <IonSegment onIonChange={e => setSection(e.detail.value)}>
            <IonSegmentButton value="global" checked={section === "global"}>
              <IonLabel>Global Feed</IonLabel>
            </IonSegmentButton>
            <IonSegmentButton value="personal" checked={section === "personal"}>
              <IonLabel>Your Feed</IonLabel>
            </IonSegmentButton>
          </IonSegment>
        </IonToolbar>

        {state.tagFilter && (
          <IonToolbar color="light">
            <IonLabel className="FilteringBy">Filtering by: </IonLabel>
            <IonChip>
              <IonLabel>{state.tagFilter}</IonLabel>
              <IonIcon icon={closeCircle} onClick={clearFilters} />
            </IonChip>
          </IonToolbar>
        )}
      </IonHeader>

      <IonContent>
        <IonRefresher slot="fixed" onIonRefresh={doRefresh}>
          <IonRefresherContent></IonRefresherContent>
        </IonRefresher>

        <IonList lines="full">
          {state.articles.map(article => (
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

          {state.loading && <ListSkeleton items={3} />}
        </IonList>

        <IonButton
          expand="full"
          color="primary"
          fill="clear"
          onClick={nextPage}
        >
          Load more...
        </IonButton>
      </IonContent>

      <TagsPopover
        tags={state.tags}
        isOpen={showPopover}
        onDidDismiss={() => setShowPopover(false)}
        onSelectTag={handleSelectTag}
      />
    </IonPage>
  );
};

export default Home;
