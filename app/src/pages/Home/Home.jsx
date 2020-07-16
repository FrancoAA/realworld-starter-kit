import React, { useEffect, useState, useContext } from "react";
import {useIsFetching} from 'react-query';
import { formatDistanceToNow } from "date-fns";

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
import { getProp } from "../../common/utils";

import { Store } from "../../common/AppStore";
import { useArticles, useFeed, useTags, useIsLoading } from '../../common/hooks';

import { SET_TAG_FILTER } from "../../common/constants";

import ListSkeleton from "../../common/ListSkeleton";
import TagsPopover from "./components/TagsPopover";

import "./Home.scss";

const Home = () => {
  const isLoading = useIsLoading();
  const [section, setSection] = useState("global");
  const [showPopover, setShowPopover] = useState(false);
  const { state, dispatch } = useContext(Store);
  const { tagFilter } = state;

  const { resolvedData: articles, nextPage: articlesNextPage, refetch } = useArticles(tagFilter);
  const { data: userFeed } = useFeed();
  const { data: tags } = useTags();

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
    await refetch();
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
        {!isLoading && (
          <>
            {section === "global" && (
              <IonList lines="full">
                {articles && articles.map((article) => (
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
                {userFeed && userFeed.map((article) => (
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
    
                {/* <IonButton
                  expand="full"
                  color="primary"
                  fill="clear"
                  onClick={feedNextPage}
                >
                  Load more...
                </IonButton> */}
              </IonList>
            )}
            {(tags || '') && <TagsPopover
              tags={tags}
              isOpen={showPopover}
              onDidDismiss={() => setShowPopover(false)}
              onSelectTag={handleSelectTag}
            />}
          </>
        )}

        {isLoading && <ListSkeleton items={3} />}
      </IonContent>

    </IonPage>
  );
};

export default Home;
