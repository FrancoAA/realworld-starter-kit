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
import { usePaginator, getProp } from "../../common/utils";

import { Store } from "../../common/AppStore";
import {
  SET_LOADING,
  SET_TAG_FILTER,
  FETCH_ARTICLES,
  FETCH_NEXT_ARTICLES,
  FETCH_USER_ARTICLES_FEED,
  FETCH_NEXT_USER_ARTICLES_FEED,
  FETCH_TAGS
} from "../../common/constants";

import { ArticlesService, TagsService } from "../../common/api.service";

import ListSkeleton from "../../common/ListSkeleton";
import TagsPopover from "./components/TagsPopover";

import "./Home.scss";

const Home = () => {
  const { state, dispatch } = useContext(Store);
  const {
    articles,
    articlesOffset,
    articlesCount,
    userFeed,
    userFeedOffset,
    userFeedCount,
    tagFilter,
    loading,
    tags
  } = state;

  const [paginator, nextPage] = usePaginator({ offset: articlesOffset });
  const [feedPaginator, feedNextPage] = usePaginator({
    offset: userFeedOffset
  });

  const [section, setSection] = useState("global");
  const [showPopover, setShowPopover] = useState(false);

  // used in the initial fetch of the data
  async function fetchArticles(type, tag) {
    dispatch({
      type: SET_LOADING,
      payload: true
    });

    const { data } = await ArticlesService.query(type, { tag });

    dispatch({
      type: type === "feed" ? FETCH_USER_ARTICLES_FEED : FETCH_ARTICLES,
      payload: {
        articles: data.articles,
        articlesOffset: 0,
        articlesCount: data.articlesCount
      }
    });

    dispatch({
      type: SET_LOADING,
      payload: false
    });
  }

  // used when the user clicks to see the next page of results
  async function paginateArticles(type, tag) {
    dispatch({
      type: SET_LOADING,
      payload: true
    });

    const { data } = await ArticlesService.query(type, { tag, ...paginator });

    dispatch({
      type:
        type === "feed" ? FETCH_NEXT_USER_ARTICLES_FEED : FETCH_NEXT_ARTICLES,
      payload: {
        articles: data.articles,
        articlesOffset:
          type === "feed" ? feedPaginator.offset : paginator.offset,
        articlesCount: data.articlesCount
      }
    });

    dispatch({
      type: SET_LOADING,
      payload: false
    });
  }

  // Fetch tags
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

  // initial load
  useEffect(() => {
    console.log("Fetch articles called!");
    fetchArticles(
      section === "personal" ? "feed" : "",
      section === "personal" ? null : tagFilter
    );
  }, [tagFilter, section]);

  // paginate
  useEffect(() => {
    if (
      (section === "personal" && feedPaginator.offset === 0) ||
      (section === "global" && paginator.offset === 0)
    ) {
      return;
    }
    console.log('paginateArticles called!');
    paginateArticles(
      section === "personal" ? "feed" : "",
      section === "personal" ? null : tagFilter
    );
  }, [paginator, feedPaginator]);

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

  const hasMore = type => {
    return type === "global"
      ? articlesCount > articlesOffset + 10
      : userFeedCount > userFeedOffset + 10;
  };

  const doRefresh = async evt => {
    await fetchArticles(
      section === "personal" ? "feed" : "",
      section === "personal" ? null : tagFilter
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

        {tagFilter && (
          <IonToolbar color="light">
            <IonLabel className="FilteringBy">Filtering by: </IonLabel>
            <IonChip>
              <IonLabel>{tagFilter}</IonLabel>
              <IonIcon icon={closeCircle} onClick={clearFilters} />
            </IonChip>
          </IonToolbar>
        )}
      </IonHeader>

      <IonContent>
        <IonRefresher slot="fixed" onIonRefresh={doRefresh}>
          <IonRefresherContent></IonRefresherContent>
        </IonRefresher>

        {section === "global" && (
          <IonList lines="full">
            {articles.map(article => (
              <IonItem key={article.slug} routerLink={`/home/${article.slug}`}>
                <IonAvatar slot="start">
                  <img src={getProp(article, "author.image")} />
                </IonAvatar>
                <IonLabel>
                  <h2>{article.author.username}</h2>
                  <h3>{article.title}</h3>
                  <p>{article.description}</p>
                </IonLabel>
              </IonItem>
            ))}
            {hasMore(section) && (
              <IonButton
                expand="full"
                color="primary"
                fill="clear"
                onClick={nextPage}
              >
                Load more...
              </IonButton>
            )}
          </IonList>
        )}

        {section === "personal" && (
          <IonList lines="full">
            {userFeed.map(article => (
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
            {hasMore(section) && (
              <IonButton
                expand="full"
                color="primary"
                fill="clear"
                onClick={feedNextPage}
              >
                Load more...
              </IonButton>
            )}
          </IonList>
        )}

        {loading && <ListSkeleton items={3} />}
      </IonContent>

      <TagsPopover
        tags={tags}
        isOpen={showPopover}
        onDidDismiss={() => setShowPopover(false)}
        onSelectTag={handleSelectTag}
      />
    </IonPage>
  );
};

export default Home;
