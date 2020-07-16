import React, { useEffect, useState, useContext } from "react";
import { useQuery, useMutation, queryCache } from "react-query";
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
  IonItemOption,
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
  trash,
} from "ionicons/icons";

import { getProp } from "../../common/utils";

import { Store } from "../../common/AppStore";
import {
  useArticle,
  useFeed,
  useComments,
  useIsLoading,
  useMutationAddToFav,
  useMutationRemoveFromFav,
  useMutationDeleteArticle,
  useMutationDeleteComment,
  useMutationFollow,
  useMutationUnFollow,
} from "../../common/hooks";

import {
  EDIT_ARTICLE,
  DELETE_ARTICLE,
  DELETE_COMMENT,
} from "../../common/constants";

import PageHeader from "../../common/PageHeader/PageHeader";
import CommentModal from "./components/CommentModal";

import "./Details.scss";
import ConfirmDeletion from "./components/ConfirmDeletion";

const Details = () => {
  const { slug } = useParams();
  const isLoading = useIsLoading();
  const { state, dispatch } = useContext(Store);
  const { user } = state;
  const [section, setSection] = useState("article");
  const [isOpen, setIsOpen] = useState(false);
  const [showAlert, setShowAlert] = useState(false);

  const { data: article } = useArticle(slug);
  const { data: userFeed } = useFeed();
  const { data: comments } = useComments(slug, {
    enabled: article,
  });

  const [addToFav] = useMutationAddToFav(slug);
  const [removeFromFav] = useMutationRemoveFromFav(slug);
  const [followUser] = useMutationFollow();
  const [unFollowUser] = useMutationUnFollow();
  const [_deleteArticle] = useMutationDeleteArticle(slug);
  const [deleteComment] = useMutationDeleteComment();

  let history = useHistory();

  const getMarkdownText = (markdown) => {
    var rawMarkup = marked(markdown, { sanitize: true });
    return { __html: rawMarkup };
  };

  const isFollowing = (article) => {
    return userFeed && !!userFeed.find((a) => a.slug === article.slug);
  };

  const handleFav = async () => {
    return !article.favorited
      ? await addToFav(article.slug)
      : await removeFromFav(slug);
  };

  const handleFollow = async () => {
    const username = article.author.username;
    return !isFollowing(article)
      ? await followUser(username)
      : await unFollowUser(username);
  };

  const isOwn = (object) => {
    return getProp(object, "author.username") === getProp(user, "username");
  };

  const handleEdit = (article) => {
    dispatch({
      type: EDIT_ARTICLE,
      payload: article,
    });
  };

  const handleDeleteArticle = () => {
    setShowAlert(true);
  };

  const handleDeleteComment = async (comment) => {
    await deleteComment(slug, comment.id);
  };

  const deleteArticle = async (article) => {
    setShowAlert(false);

    await _deleteArticle(article);

    history.goBack();
  };

  return (
    <IonPage className="Details">
      <IonContent>
        {article && userFeed && comments && (
          <>
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
                    <IonButton
                      color="light"
                      size="large"
                      onClick={handleFollow}
                    >
                      <IonIcon icon={isFollowing(article) ? remove : add} />
                    </IonButton>
                    {/* Fav button */}
                    <IonButton color="light" size="large" onClick={handleFav}>
                      <IonIcon
                        slot="start"
                        icon={article.favorited ? heart : heartEmpty}
                      />
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
              onDidDismiss={(e) => e.detail.role && deleteArticle()}
              header={"Delete Article"}
              message={"Are you sure that you want to delete this article?"}
              buttons={[
                {
                  text: "Yes",
                  role: true,
                },
                {
                  text: "No",
                  role: false,
                },
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
              <IonSegment onIonChange={(e) => setSection(e.detail.value)}>
                <IonSegmentButton
                  value="article"
                  checked={section === "article"}
                >
                  <IonLabel>Article</IonLabel>
                </IonSegmentButton>
                <IonSegmentButton
                  value="comments"
                  checked={section === "comments"}
                >
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
                  comments.map((comment) => (
                    <IonItemSliding key={comment.id}>
                      <IonItem lines="full">
                        <IonAvatar slot="start">
                          <img src={comment.author.image} alt="avatar" />
                        </IonAvatar>
                        <IonLabel className="ion-text-wrap">
                          <h2>
                            {comment.author.username}{" "}
                            <small>
                              {formatDistanceToNow(new Date(comment.createdAt))}
                            </small>
                          </h2>
                          <p>{comment.body}</p>
                        </IonLabel>
                      </IonItem>

                      {isOwn(comment) && (
                        <IonItemOptions side="end">
                          <IonItemOption
                            color="danger"
                            onClick={() => handleDeleteComment(comment)}
                          >
                            <IonIcon slot="top" icon={trash} />
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

            <CommentModal
              isOpen={isOpen}
              article={article}
              closeModal={() => setIsOpen(false)}
            />
          </>
        )}
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
