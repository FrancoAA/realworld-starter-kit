import React, { useEffect, useState, useContext } from "react";
import { formatDistanceToNow } from "date-fns";
import { useQuery, usePaginatedQuery, useInfiniteQuery } from "react-query";

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
  IonRefresherContent,
} from "@ionic/react";

import { closeCircle, funnel } from "ionicons/icons";
import { usePaginator, getProp } from "../../common/utils";

import { Store } from "../../common/AppStore";
import {
  SET_TAG_FILTER,
} from "../../common/constants";

import { ArticlesService, TagsService } from "../../common/api.service";

import ListSkeleton from "../../common/ListSkeleton";
import TagsPopover from "./components/TagsPopover";

import "./Home.scss";

const Home = () => {
  const [section, setSection] = useState("global");
  const [articlePaginator, articlesNextPage] = usePaginator();
  const [feedPaginator, feedNextPage] = usePaginator();
  const [showPopover, setShowPopover] = useState(false);
  const { state, dispatch } = useContext(Store);
  const { tagFilter } = state;

  const { isLoading, resolvedData: articlesData, fetchMore: fetchMoreArticles } = usePaginatedQuery(
    ["articles", {...articlePaginator, tagFilter }],
    (_, params) => ArticlesService.query("", params),
    {
      getFetchMore: lastGroup => {
        return true;
      }
    }
  );

  const {
    isLoading: feedIsLoading,
    resolvedData: feedArticlesData,
    fetchMore: fetchMoreFeedArticles
  } = usePaginatedQuery(["feed", {...feedPaginator }], (_, params) =>
    ArticlesService.query("feed", params),
    {
      getFetchMore: lastGroup => {
        return true;
      }
    }
  );

  const { data: tagsData } = useQuery('tags', TagsService.get);

  const handleSelectTag = (tag) => {
    dispatch({
      type: SET_TAG_FILTER,
      payload: tag,
    });

    setShowPopover(false);
  };

  const clearFilters = () => {
    dispatch({
      type: SET_TAG_FILTER,
      payload: null,
    });
  };

  const doRefresh = async (evt) => {
    // TODO
    evt.detail.complete();
  };

  const articles = getProp(articlesData, 'data.articles', []);
  const userFeed = getProp(feedArticlesData, 'data.articles', []);
  const tags = getProp(tagsData, 'data.tags', []);

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
          <IonSegment onIonChange={(e) => setSection(e.detail.value)}>
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
                  <h2>
                    {article.author.username}{" "}
                    <small>
                      {formatDistanceToNow(new Date(article.createdAt))}
                    </small>
                  </h2>
                  <h3>{article.title}</h3>
                  <p>{article.description}</p>
                </IonLabel>
              </IonItem>
            ))}

            <IonButton
              expand="full"
              color="primary"
              fill="clear"
              onClick={articlesNextPage}
            >
              Load more...
            </IonButton>

          </IonList>
        )}

        {section === "personal" && (
          <IonList lines="full">
            {userFeed.map((article) => (
              <IonItem key={article.slug} routerLink={`/home/${article.slug}`}>
                <IonAvatar slot="start">
                  <img src={article.author.image} />
                </IonAvatar>
                <IonLabel>
                  <h2>
                    {article.author.username}{" "}
                    <small>
                      {formatDistanceToNow(new Date(article.createdAt))}
                    </small>
                  </h2>
                  <h3>{article.title}</h3>
                  <p>{article.description}</p>
                </IonLabel>
              </IonItem>
            ))}

            <IonButton
              expand="full"
              color="primary"
              fill="clear"
              onClick={feedNextPage}
            >
              Load more...
            </IonButton>

          </IonList>
        )}

        {isLoading && <ListSkeleton items={3} />}
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
