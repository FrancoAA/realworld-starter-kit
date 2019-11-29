import React, { useEffect, useState, useContext } from "react";
import { useParams, useHistory } from "react-router-dom";

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
  IonFabButton,
  IonAlert
} from "@ionic/react";

import marked from "marked";
import { formatDistanceToNow } from "date-fns";

import { heartEmpty, heart, add, remove, chatboxes, create, trash } from "ionicons/icons";

import { getProp } from "../../common/utils";

import { Store } from "../../common/AppStore";

import {
  SET_LOADING,
  FETCH_ARTICLE,
  FETCH_ARTICLE_COMMENTS,
  FETCH_ARTICLES,
  FETCH_USER_ARTICLES_FEED,
  EDIT_ARTICLE,
  DELETE_ARTICLE
} from "../../common/constants";

import ApiService, {
  ArticlesService,
  CommentsService,
  FavoriteService
} from "../../common/api.service";
import PageHeader from "../../common/PageHeader/PageHeader";
import CommentModal from "./components/CommentModal";

import "./Details.scss";

const Details = () => {
  const { slug } = useParams();
  const { state, dispatch } = useContext(Store);
  const { user, article, comments, userFeed } = state;
  const [section, setSection] = useState("article");
  const [isOpen, setIsOpen] = useState(false);
  const [showAlert, setShowAlert] = useState(false);

  let history = useHistory();

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

  const getMarkdownText = markdown => {
    var rawMarkup = marked(markdown, { sanitize: true });
    return { __html: rawMarkup };
  };

  const isFollowing = article => {
    return !!userFeed.find(a => a.slug === article.slug);
  };

  const handleFav = async () => {
    const { data } = !article.favorited
      ? await FavoriteService.add(article.slug)
      : await FavoriteService.remove(slug);

    dispatch({
      type: FETCH_ARTICLE,
      payload: data.article
    });
  };

  const handleFollow = async () => {
    const action = !isFollowing(article) ? "post" : "delete";
    const { data } = await ApiService[action](
      `profiles/${article.author.username}/follow`
    );

    dispatch({
      type: FETCH_USER_ARTICLES_FEED,
      payload:
        action === "post"
          ? [article, ...userFeed]
          : userFeed.filter(a => a === article)
    });
  };

  const isOwn = article => {
    return getProp(article, 'author.username') === getProp(user , 'username');
  };

  const handleEdit = article => {
    dispatch({
      type: EDIT_ARTICLE,
      payload: article
    });
  };

  const handleDelete = () => {
    setShowAlert(true);
  };

  const performDeletion = async() => {
    setShowAlert(false);

    await ArticlesService.destroy(article.slug);

    dispatch({
      type: DELETE_ARTICLE,
      payload: article
    });

    history.goBack();
  };

  return (
    <IonPage className="Details">
      <IonContent>
        <IonToolbar className="controls">
          <IonButtons slot="start">
            <IonBackButton
              className="back"
              text=""
              color="light"
              defaultHref="/home"
            />
          </IonButtons>
          <IonButtons slot="end">
            
            {!isOwn(article) && (
              <>
                <IonButton color="light" size="large" onClick={handleFav}>
                  <IonIcon icon={article.favorited ? heart : heartEmpty} />
                </IonButton>
                <IonButton color="light" size="large" onClick={handleFollow}>
                  <IonIcon icon={isFollowing(article) ? remove : add} />
                </IonButton>
              </>
            )}

            {isOwn(article) && (
              <>
                <IonButton color="light" size="large" onClick={() => handleEdit(article)}>
                  <IonIcon icon={create} />
                </IonButton>
                <IonButton color="danger" size="large" onClick={() => handleDelete(article)}>
                  <IonIcon icon={trash} />
                </IonButton>
              </>
            )}
            
          </IonButtons>
        </IonToolbar>

        <IonAlert 
          isOpen={showAlert}
          onDidDismiss={(e) => e.detail.role && performDeletion()}
          header={'Delete Article'}
          message={'are you sure that you want to delete this article?'}
          buttons={[
            {
              text: 'Yes',
              role: true
            },
            {
              text: 'No',
              role: false
            }
          ]}>
        </IonAlert>

        <PageHeader
          title={article.title}
          subtitle={article.description}
          date={formatDistanceToNow(
            new Date(getProp(article, "createdAt", new Date()))
          )}
          image={getProp(article, "author.image")}
        />

        <IonToolbar color="light">
          <IonSegment onIonChange={e => setSection(e.detail.value)}>
            <IonSegmentButton value="article" checked={section === "article"}>
              <IonLabel>Article</IonLabel>
            </IonSegmentButton>
            <IonSegmentButton value="comments" checked={section === "comments"}>
              <IonLabel>Comments ({comments.length})</IonLabel>
            </IonSegmentButton>
          </IonSegment>
        </IonToolbar>

        {section === "article" && (
          <div className="ion-padding">
            {article.body && (
              <div
                className="markdown-container"
                dangerouslySetInnerHTML={getMarkdownText(article.body)}
              />
            )}
          </div>
        )}

        {section === "comments" && (
          <IonList>
            {comments.length > 0 &&
              comments.map(comment => (
                <IonItem key={comment.id} lines="full">
                  <IonAvatar slot="start">
                    <img src={comment.author.image} alt="avatar" />
                  </IonAvatar>
                  <IonLabel className="ion-text-wrap">
                    <p>{comment.body}</p>
                  </IonLabel>
                </IonItem>
              ))}

            {!comments.length && (
              <IonItem lines="full">
                <IonLabel>
                  <p style={{ textAlign: "center" }}>No comments yet.</p>
                </IonLabel>
              </IonItem>
            )}
          </IonList>
        )}

        <CommentModal isOpen={isOpen} closeModal={() => setIsOpen(false)} />

        <IonFab vertical="bottom" horizontal="end">
          <IonFabButton onClick={() => setIsOpen(true)}>
            <IonIcon icon={chatboxes} />
          </IonFabButton>
        </IonFab>
      </IonContent>
    </IonPage>
  );
};

export default Details;
