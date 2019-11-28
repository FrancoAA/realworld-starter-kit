import React, { useEffect, useState, useContext } from "react";
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

import { getProp } from '../common/utils';

import { Store } from '../common/AppStore';

import {
  SET_LOADING,
  FETCH_ARTICLE,
  FETCH_ARTICLE_COMMENTS
} from '../common/constants';

import { ArticlesService, CommentsService } from "../common/api.service";
import PageHeader from '../common/PageHeader/PageHeader';

import './Details.scss';

const Details = () => {
  const { slug } = useParams();
  const { state, dispatch } = useContext(Store);
  const [section, setSection] = useState('article');

  useEffect(() => {
    async function fetchArticle() {
      dispatch({
        type: SET_LOADING,
        payload: true
      });

      const { data } = await ArticlesService.get(slug);

      dispatch({
        type: FETCH_ARTICLE,
        payload: data.article
      });

      dispatch({
        type: SET_LOADING,
        payload: false
      });
    }

    async function fetchArticleComments() {
      const { data } = await CommentsService.get(slug);
      dispatch({
        type: FETCH_ARTICLE_COMMENTS,
        payload: data.comments
      });
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

      <IonBackButton className="back" text="" color="primary" defaultHref="/home" />

      <IonContent>
        <PageHeader title={state.article.title} subtitle={state.article.description} image={getProp(state.article, 'author.image')}/>

        <IonToolbar>
          <IonSegment
              onIonChange={e => setSection(e.detail.value)}
            >
            <IonSegmentButton value="article" checked={section === "article"}>
              <IonLabel>Article</IonLabel>
            </IonSegmentButton>
            <IonSegmentButton value="comments" checked={section === "comments"}>
              <IonLabel>Comments ({state.comments.length})</IonLabel>
            </IonSegmentButton>
          </IonSegment>
        </IonToolbar>

        {section === 'article' && (
          <div className="ion-padding">
            {state.article.body && <div className="markdown-container" dangerouslySetInnerHTML={getMarkdownText(state.article.body)}/>}
          </div>
        )}

        {section === 'comments' && (
          <IonList>
            {state.comments.length > 0 && state.comments.map(comment => (
              <IonItem key={comment.id} lines="full">
                <IonAvatar slot="start">
                  <img src={comment.author.image} alt="avatar"/>
                </IonAvatar>
                <IonLabel>
                  <p>{comment.body}</p>
                </IonLabel>
              </IonItem>
            ))}

            {!state.comments.length && (
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
