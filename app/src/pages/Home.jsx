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
  IonSegment,
  IonSegmentButton,
  IonHeader
} from '@ionic/react';

import React, { useEffect, useState } from 'react';
import { book, build, colorFill, grid } from 'ionicons/icons';
import { ArticlesService } from '../common/api.service';

import './Home.scss';

function usePaginator(pageSize) {
  const [paginator, setPaginator] = useState({ offset: 0, limit: pageSize });

  const nextPage = () => {
    setPaginator(prev => ({
      offset: prev.offset + prev.limit,
      limit : prev.limit
    }));
  }

  return [
    paginator,
    nextPage
  ];
}

const Home = () => {
  const [ articles, setArticles ] = useState([]);
  const [ paginator, nextPage] = usePaginator(10);

  useEffect(() => {
    async function fetchArticles() {
      const { data } = await ArticlesService.query('', paginator);
      setArticles([...articles, ...data.articles]);
    }
    fetchArticles();
  }, [paginator])

  return (
    <IonPage className="Home">
      <IonHeader>
        <IonToolbar color="light">
          <IonTitle>
            Conduit
          </IonTitle>
        </IonToolbar>
        <IonToolbar color="light">
          <IonSegment onIonChange={e => console.log('Segment selected', e.detail.value)}>
            <IonSegmentButton value="friends">
              <IonLabel>Your Feed</IonLabel>
            </IonSegmentButton>
            <IonSegmentButton value="enemies">
              <IonLabel>Global Feed</IonLabel>
            </IonSegmentButton>
          </IonSegment>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <IonList lines="full">
         {articles.map(article => (
           <IonItem key={article.slug} routerLink={`/home/${article.slug}`}>
             <IonAvatar slot="start">
               <img src={article.author.image}/>
             </IonAvatar>
             <IonLabel>
              <h2>{article.author.username}</h2>
              <h3>{article.title}</h3>
              <p>{article.description}</p>
             </IonLabel>
           </IonItem>
         ))}
        </IonList>

        <IonButton expand="full" color="primary" fill="clear" onClick={nextPage}>Load more...</IonButton>

      </IonContent>
    </IonPage>
  );
};

export default Home;
