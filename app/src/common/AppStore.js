import React, { createContext, useReducer } from "react";

import {
  SET_TAG_FILTER,
  AUTH_LOGIN,
  AUTH_SIGNUP,
  AUTH_LOGOUT,
  AUTH_ERROR,
  AUTH_FETCH_USER,
  CREATE_ARTICLE,
  EDIT_ARTICLE,
  UPDATE_ARTICLE,
  OPEN_COMPOSE_MODAL,
  CLOSE_COMPOSE_MODAL,
} from "./constants";

export const Store = createContext();

export const initialState = {
  user: null,
  tagFilter: null,
  isLoggedIn: false,
  showComposeModal: false,
};

function reducer(state, { type, payload }) {
  switch (type) {
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

    case EDIT_ARTICLE:
      return { ...state, edit: true, showComposeModal: true };
    case CREATE_ARTICLE:
      return { ...state, article: payload };
    case UPDATE_ARTICLE:
      return { ...state, edit: false, article: payload };

    case OPEN_COMPOSE_MODAL:
      return { ...state, showComposeModal: true };
    case CLOSE_COMPOSE_MODAL:
      return { ...state, edit: false, showComposeModal: false };

    default:
      return state;
  }
}

export function StoreProvider(props) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const value = { state, dispatch };
  return <Store.Provider value={value}>{props.children}</Store.Provider>;
}
