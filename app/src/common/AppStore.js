import React, { createContext, useReducer } from "react";

import {
  SET_LOADING,
  SET_TAG_FILTER,
  SET_REFRESH,
  AUTH_LOGIN,
  AUTH_SIGNUP,
  AUTH_LOGOUT,
  AUTH_ERROR,
  AUTH_FETCH_USER,
  FETCH_ARTICLE,
  FETCH_ARTICLES,
  FETCH_NEXT_ARTICLES,
  FETCH_ARTICLE_COMMENTS,
  FETCH_USER_ARTICLES,
  FETCH_USER_ARTICLES_FEED,
  FETCH_NEXT_USER_ARTICLES_FEED,
  FETCH_USER_FAVORITED_ARTICLES,
  FETCH_TAGS,
  CREATE_ARTICLE,
  EDIT_ARTICLE,
  UPDATE_ARTICLE,
  DELETE_ARTICLE,
  OPEN_COMPOSE_MODAL,
  CLOSE_COMPOSE_MODAL,
  DELETE_COMMENT
} from "./constants";

export const Store = createContext();

export const initialState = {
  user: null,
  userArticles: [],
  userFeed: [],
  userFeedOffset: 0,
  userFeedCount: 0,
  userFavorited: [],
  loading: false,
  errors: null,
  tagFilter: null,
  tags: [],
  article: {},
  articles: [],
  articlesCount: 0,
  articlesOffset: 0,
  comments: [],
  isLoggedIn: false,
  showComposeModal: false
};

function reducer(state, { type, payload }) {
  switch (type) {
    case SET_REFRESH:
      return { ...state, refresh: payload };

    case SET_LOADING:
      return { ...state, loading: payload };

    case SET_TAG_FILTER:
      return { ...state, tagFilter: payload };

    case AUTH_LOGIN:
      return { ...state, user: payload, isLoggedIn: true };
    case AUTH_SIGNUP:
      return { ...state, user: payload, isLoggedIn: true };
    case AUTH_LOGOUT:
      // TODO: clear the token
      return { ...state, user: null, isLoggedIn: false };
    case AUTH_FETCH_USER:
      return { ...state, user: payload, isLoggedIn: true };
    case AUTH_ERROR:
      return { ...state, user: null, error: payload, isLoggedIn: false };

    case FETCH_ARTICLES:
      return {
        ...state,
        articles: payload.articles,
        articlesCount: payload.articlesCount
      };
    case FETCH_NEXT_ARTICLES:
      return {
        ...state,
        articles: [...state.articles, ...payload.articles],
        articlesOffset: payload.articlesOffset,
        articlesCount: payload.articlesCount
      };
    case FETCH_ARTICLE:
      return { ...state, article: payload };
    case FETCH_ARTICLE_COMMENTS:
      return { ...state, comments: payload };

    case FETCH_USER_ARTICLES:
      return { ...state, userArticles: payload };

    case FETCH_USER_ARTICLES_FEED:
      return {
        ...state,
        userFeed: payload.articles,
        userFeedOffset: payload.articlesOffset,
        userFeedCount: payload.articlesCount
      };
    case FETCH_NEXT_USER_ARTICLES_FEED:
      return {
        ...state,
        userFeed: [...state.articles, ...payload.articles],
        userFeedOffset: payload.articlesOffset,
        userFeedCount: payload.articlesCount
      };

    case FETCH_USER_FAVORITED_ARTICLES:
      return { ...state, userFavorited: payload };

    case FETCH_TAGS:
      return { ...state, tags: payload };

    case EDIT_ARTICLE:
      return { ...state, edit: true, showComposeModal: true };
    case CREATE_ARTICLE:
      return {
        ...state,
        articles: [payload, ...state.articles],
        article: payload
      };
    case UPDATE_ARTICLE:
      // update the article if it is in the state.articles
      const articlesCopy = [...state.articles];
      const index = articlesCopy.findIndex(a => a.slug === payload.slug);
      if (index >= 0) {
        articlesCopy[index] = payload;
        return {
          ...state,
          edit: false,
          article: payload,
          articles: [...articlesCopy]
        };
      }
      // do nothing if it is not in the state.articles
      return { ...state, edit: false, article: payload };
    case DELETE_ARTICLE:
      const removeArticleFn = a => a.slug !== payload.slug;
      const filteredUserArticles = state.userArticles.filter(removeArticleFn);
      const filteredArticles = state.articles.filter(removeArticleFn);
      return {
        ...state,
        article: {},
        articles: [...filteredArticles],
        userArticles: filteredUserArticles
      };
    case OPEN_COMPOSE_MODAL:
      return { ...state, showComposeModal: true };
    case CLOSE_COMPOSE_MODAL:
      return { ...state, edit: false, showComposeModal: false };
    
    case DELETE_COMMENT:
      return { ...state, comments: state.comments.filter(c => c.id !== payload.id) };

    default:
      return state;
  }
}

export function StoreProvider(props) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const value = { state, dispatch };
  return <Store.Provider value={value}>{props.children}</Store.Provider>;
}
