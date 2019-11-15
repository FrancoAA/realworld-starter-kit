import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import {
  IonBackButton,
  IonButtons,
  IonHeader,
  IonPage,
  IonToolbar,
  IonTitle,
  IonContent
} from "@ionic/react";

import marked from 'marked';

import { ArticlesService } from "../common/api.service";

const Details = () => {
  const [article, setArticle] = useState({});
  const { slug } = useParams();

  useEffect(() => {
    async function fetchArticle() {
      const { data } = await ArticlesService.get(slug);
      setArticle({...data.article});
    }
    fetchArticle();
  }, []);

  const getMarkdownText = (markdown) => {
    var rawMarkup = marked(markdown, {sanitize: true});
    return { __html: rawMarkup };
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/tab2" />
          </IonButtons>
          <IonTitle>{article.title}</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        {article.body && <div className="ion-padding" dangerouslySetInnerHTML={getMarkdownText(article.body)}/>}
      </IonContent>
    </IonPage>
  );
};

export default Details;
