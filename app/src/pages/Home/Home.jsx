import {
  IonContent,
  IonIcon,
  IonItem,
  IonLabel,
  IonList,
  IonListHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonAvatar,
  IonButton,
  IonButtons,
  IonSegment,
  IonSegmentButton,
  IonHeader,
  IonSkeletonText,
  IonPopover,
  IonChip
} from "@ionic/react";

import React, { useEffect, useState } from "react";
import { book, build, colorFill, grid, funnel } from "ionicons/icons";
import { ArticlesService, TagsService } from "../../common/api.service";

import ListSkeleton from './components/ListSkeleton';
import TagsPopover from './components/TagsPopover';

import "./Home.scss";

function usePaginator(pageSize) {
  const [paginator, setPaginator] = useState({ offset: 0, limit: pageSize });

  const nextPage = () => {
    setPaginator(prev => ({
      offset: prev.offset + prev.limit,
      limit: prev.limit
    }));
  };

  return [paginator, nextPage];
}

const Home = () => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [paginator, nextPage] = usePaginator(10);
  const [section, setSection] = useState("global");
  const [tags, setTags] = useState([]);
  const [showPopover, setShowPopover] = useState(false);

  useEffect(() => {
    async function fetchArticles() {
      setLoading(true);
      const { data } = await ArticlesService.query("", paginator);
      setArticles([...articles, ...data.articles]);
      setLoading(false);
    }

    async function fetchTags() {
      const { data } = await TagsService.get();
      setTags(data.tags);
    }

    fetchArticles();
    fetchTags();
  }, [paginator]);

  return (
    <IonPage className="Home">
      <IonHeader>
        <IonToolbar color="light">
          <IonTitle>Conduit</IonTitle>
          <IonButtons slot="end">
            <IonButton onClick={() => setShowPopover(true)}>
              <IonIcon icon={funnel}></IonIcon>
            </IonButton>
          </IonButtons>
        </IonToolbar>
        <IonToolbar color="light">
          <IonSegment
            onIonChange={e => setSection(e.detail.value)}
          >
            <IonSegmentButton value="global" checked={section === "global"}>
              <IonLabel>Global Feed</IonLabel>
            </IonSegmentButton>
            <IonSegmentButton value="personal" checked={section === "personal"}>
              <IonLabel>Your Feed</IonLabel>
            </IonSegmentButton>
          </IonSegment>
        </IonToolbar>
      </IonHeader>
      
      <IonContent>

        <IonList lines="full">
          {loading && <ListSkeleton items={5} />}

          {!loading &&
            articles.map(article => (
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

      <TagsPopover tags={tags} isOpen={showPopover} onDidDismiss={() => setShowPopover(false)}/>
    </IonPage>
  );
};

export default Home;