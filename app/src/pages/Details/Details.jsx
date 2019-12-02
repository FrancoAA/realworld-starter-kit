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
  IonAlert,
  IonItemSliding,
  IonItemOptions,
  IonItemOption
} from "@ionic/react";

import marked from "marked";
import { formatDistanceToNow } from "date-fns";

import {
  heartEmpty,
  heart,
  add,
  remove,
  chatboxes,
  create,
  trash
} from "ionicons/icons";

import { getProp } from "../../common/utils";

import { Store } from "../../common/AppStore";

import {
  SET_LOADING,
  FETCH_ARTICLE,
  FETCH_ARTICLE_COMMENTS,
  FETCH_USER_ARTICLES_FEED,
  EDIT_ARTICLE,
  DELETE_ARTICLE,
  DELETE_COMMENT
} from "../../common/constants";

import ApiService, {
  ArticlesService,
  CommentsService,
  FavoriteService
} from "../../common/api.service";
import PageHeader from "../../common/PageHeader/PageHeader";
import CommentModal from "./components/CommentModal";

import "./Details.scss";
import ConfirmDeletion from "./components/ConfirmDeletion";

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
      payload: {
        articles:
          action === "post"
            ? [article, ...userFeed]
            : userFeed.filter(a => a === article)
      }
    });
  };

  const isOwn = object => {
    return getProp(object, "author.username") === getProp(user, "username");
  };

  const handleEdit = article => {
    dispatch({
      type: EDIT_ARTICLE,
      payload: article
    });
  };

  const handleDeleteArticle = () => {
    setShowAlert(true);
  };

  const handleDeleteComment = async (comment) => {
    await CommentsService.destroy(article.slug, comment.id);

    dispatch({
      type: DELETE_COMMENT,
      payload: comment
    });
  }

  const deleteArticle = async (article) => {
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
                {/* Follow button */}
                <IonButton color="light" size="large" onClick={handleFollow}>
                  <IonIcon icon={isFollowing(article) ? remove : add} />
                </IonButton>
                {/* Fav button */}
                <IonButton color="light" size="large" onClick={handleFav}>
                  <IonIcon slot="start" icon={article.favorited ? heart : heartEmpty} />
                  {article.favoritesCount > 0 && article.favoritesCount}
                </IonButton>
              </>
            )}

            {isOwn(article) && (
              <>
                {/* Edit article */}
                <IonButton
                  color="light"
                  size="large"
                  onClick={() => handleEdit(article)}
                >
                  <IonIcon icon={create} />
                </IonButton>
                {/* Delete article */}
                <IonButton
                  color="danger"
                  size="large"
                  onClick={() => handleDeleteArticle(article)}
                >
                  <IonIcon icon={trash} />
                </IonButton>
              </>
            )}
          </IonButtons>
        </IonToolbar>

        <IonAlert
          isOpen={showAlert}
          onDidDismiss={e => e.detail.role && deleteArticle()}
          header={"Delete Article"}
          message={"Are you sure that you want to delete this article?"}
          buttons={[
            {
              text: "Yes",
              role: true
            },
            {
              text: "No",
              role: false
            }
          ]}
        ></IonAlert>

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
                <IonItemSliding key={comment.id}>

                  <IonItem lines="full">
                    <IonAvatar slot="start">
                      <img src={comment.author.image} alt="avatar" />
                    </IonAvatar>
                    <IonLabel className="ion-text-wrap">
                      <h2>{comment.author.username} <small>{formatDistanceToNow(new Date(comment.createdAt))}</small></h2>
                      <p>{comment.body}</p>
                    </IonLabel>
                  </IonItem>

                  {isOwn(comment) && (
                    <IonItemOptions side="end">
                      <IonItemOption color="danger" onClick={() => handleDeleteComment(comment)}>
                        <IonIcon slot="top" icon={trash}/>
                        Delete
                      </IonItemOption>
                    </IonItemOptions>
                  )}
                </IonItemSliding>
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
      </IonContent>

      <IonFab vertical="bottom" horizontal="end">
        <IonFabButton onClick={() => setIsOpen(true)}>
          <IonIcon icon={chatboxes} />
        </IonFabButton>
      </IonFab>
    </IonPage>
  );
};

export default Details;
