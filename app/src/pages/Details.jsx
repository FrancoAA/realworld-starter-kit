import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import {
  IonBackButton,
  IonButtons,
  IonHeader,
  IonPage,
  IonToolbar,
  IonTitle,
  IonContent,
  IonSegment,
  IonSegmentButton,
  IonLabel,
  IonList,
  IonItem,
  IonAvatar
} from "@ionic/react";

import marked from 'marked';
import PageHeader from '../common/PageHeader/PageHeader';
import { ArticlesService, CommentsService } from "../common/api.service";
import { getProp } from '../common/utils';

import './Details.scss';

const Details = () => {
  const { slug } = useParams();
  const [article, setArticle] = useState({});
  const [comments, setComments] = useState([]);
  const [section, setSection] = useState('article');

  useEffect(() => {
    async function fetchArticle() {
      const { data } = await ArticlesService.get(slug);
      setArticle({...data.article});
    }

    async function fetchArticleComments() {
      const { data } = await CommentsService.get(slug);
      setComments([...data.comments]);
    }

    fetchArticle();
    fetchArticleComments();
  }, []);

  const getMarkdownText = (markdown) => {
    var rawMarkup = marked(markdown, {sanitize: true});
    return { __html: rawMarkup };
  };

  return (
    <IonPage className="Details">
      {/* <IonHeader>

        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/home" />
          </IonButtons>
          <IonTitle>{article.title}</IonTitle>
        </IonToolbar>

        <IonToolbar>
          <IonSegment
              onIonChange={e => setSection(e.detail.value)}
            >
            <IonSegmentButton value="article" checked={section === "article"}>
              <IonLabel>Article</IonLabel>
            </IonSegmentButton>
            <IonSegmentButton value="comments" checked={section === "comments"}>
              <IonLabel>Comments ({comments.length})</IonLabel>
            </IonSegmentButton>
          </IonSegment>
        </IonToolbar>

      </IonHeader> */}

      <IonBackButton className="back" text="" color="primary" defaultHref="/home" />

      <IonContent>
        <PageHeader title={article.title} subtitle={article.description} image={getProp(article, 'author.image')}/>

        <IonToolbar>
          <IonSegment
              onIonChange={e => setSection(e.detail.value)}
            >
            <IonSegmentButton value="article" checked={section === "article"}>
              <IonLabel>Article</IonLabel>
            </IonSegmentButton>
            <IonSegmentButton value="comments" checked={section === "comments"}>
              <IonLabel>Comments ({comments.length})</IonLabel>
            </IonSegmentButton>
          </IonSegment>
        </IonToolbar>

        {section === 'article' && (
          <div className="ion-padding">
            {article.body && <div className="markdown-container" dangerouslySetInnerHTML={getMarkdownText(article.body)}/>}
          </div>
        )}

        {section === 'comments' && (
          <IonList>
            {comments.length > 0 && comments.map(comment => (
              <IonItem key={comment.id} lines="full">
                <IonAvatar slot="start">
                  <img src={comment.author.image} alt="avatar"/>
                </IonAvatar>
                <IonLabel>
                  <p>{comment.body}</p>
                </IonLabel>
              </IonItem>
            ))}

            {!comments.length && (
              <IonItem lines="full">
                <IonLabel>
                  <p style={{textAlign: 'center'}}>No comments yet.</p>
                </IonLabel>
              </IonItem>
            )}
          </IonList>
        )}
      </IonContent>
    </IonPage>
  );
};

export default Details;
