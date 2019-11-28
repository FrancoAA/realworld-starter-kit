import React, { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";

import {
  IonBackButton,
  IonButtons,
  IonButton,
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
  IonAvatar,
  IonIcon,
  IonFab,
  IonFabButton
} from "@ionic/react";

import marked from 'marked';

import { heartEmpty, heart, add, remove, chatboxes } from 'ionicons/icons';

import { getProp } from '../../common/utils';

import { Store } from '../../common/AppStore';

import {
  SET_LOADING,
  FETCH_ARTICLE,
  FETCH_ARTICLE_COMMENTS,
  FETCH_ARTICLES
} from '../../common/constants';

import { ArticlesService, CommentsService, FavoriteService } from "../../common/api.service";
import PageHeader from '../../common/PageHeader/PageHeader';
import CommentModal from './components/CommentModal'; 

import './Details.scss';

const Details = () => {
  const { slug } = useParams();
  const { state, dispatch } = useContext(Store);
  const { article, comments, userFavorited } = state;
  const [section, setSection] = useState('article');
  const [ isOpen, setIsOpen ] = useState(false);

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

  const isFollowing = (article) => {
    return !!userFavorited.find(a => a.slug === article.slug);
  };

  const handleFav = async () => {
    const { data } = !article.favorited ? 
      await FavoriteService.add(article.slug) : 
      await FavoriteService.remove(slug);

    dispatch({
      type: FETCH_ARTICLE,
      payload: data.article
    });
  };

  // const handleFollow = async () => {
  //   const { data } = !isFollowing(article) ? 
  //   await FavoriteService.add(article.slug) : 
  //   await FavoriteService.remove(slug);

  //   dispatch({
  //     type: FETCH_ARTICLE,
  //     payload: data.article
  //   });
  // };

  return (
    <IonPage className="Details">
      <IonContent>
        <IonToolbar className="controls">
          <IonButtons slot="start">
            <IonBackButton className="back" text="" color="primary" defaultHref="/home" />
          </IonButtons>
          <IonButtons slot="end">
            <IonButton onClick={handleFav}>
              <IonIcon icon={article.favorited ? heart : heartEmpty}/>
            </IonButton>
            <IonButton>
              <IonIcon icon={isFollowing(article) ? remove : add}/>
            </IonButton>
          </IonButtons>
        </IonToolbar>

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

        <CommentModal isOpen={isOpen} closeModal={() => setIsOpen(false)}/>

        <IonFab vertical="bottom" horizontal="end">
          <IonFabButton onClick={() => setIsOpen(true)}>
            <IonIcon icon={chatboxes}/>
          </IonFabButton>
        </IonFab>
      </IonContent>
    </IonPage>
  );
};

export default Details;
