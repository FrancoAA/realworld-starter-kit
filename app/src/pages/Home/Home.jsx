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
import { closeCircle, funnel } from "ionicons/icons";
import {usePaginator} from '../../common/utils';
import { ArticlesService, TagsService } from "../../common/api.service";

import ListSkeleton from '../../common/ListSkeleton';
import TagsPopover from './components/TagsPopover';

import "./Home.scss";

const Home = () => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [paginator, nextPage] = usePaginator(10);
  const [section, setSection] = useState("global");
  const [tags, setTags] = useState([]);
  const [filterByTag, setFilterByTag] = useState(null);
  const [showPopover, setShowPopover] = useState(false);

  useEffect(() => {
    async function fetchTags() {
      const { data } = await TagsService.get();
      setTags(data.tags);
    }
    fetchTags();
  }, []);

  useEffect(() => {
    async function fetchArticles(type, tag) {
      setLoading(true);
      const { data } = await ArticlesService.query(type, {...paginator, tag});
      setArticles([...articles, ...data.articles]);
      setLoading(false);
    }

    fetchArticles(
      section === 'personal' ? 'feed' : '',
      section === 'personal' ?  null : filterByTag
    );

  }, [paginator, filterByTag, section]);

  const handleSelectTag = (tag) => {
    setFilterByTag(tag);
    setShowPopover(false);
  };

  const clearFilters = () => {
    setFilterByTag(null);
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

        {filterByTag && (
          <IonToolbar color="light">
            <IonLabel className="FilteringBy">Filtering by: </IonLabel>
            <IonChip>
              <IonLabel>{filterByTag}</IonLabel>
              <IonIcon icon={closeCircle} onClick={clearFilters}/>
            </IonChip>
          </IonToolbar>
        )}
      </IonHeader>
      
      <IonContent>

        <IonList lines="full">
          {articles.map(article => (
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

            {loading && <ListSkeleton items={3} />}
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

      <TagsPopover tags={tags} isOpen={showPopover} onDidDismiss={() => setShowPopover(false)} onSelectTag={handleSelectTag}/>
    </IonPage>
  );
};

export default Home;
