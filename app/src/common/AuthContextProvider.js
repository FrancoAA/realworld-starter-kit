
import React, { useState, useEffect, useContext } from 'react';

import ApiService from './api.service';
import JwtService from "./jwt.token.service";
import { Store } from './AppStore';
import { AUTH_FETCH_USER, AUTH_LOGIN, AUTH_LOGOUT, AUTH_SIGNUP, AUTH_ERROR } from './constants';

const AuthContext = React.createContext();

const AuthProvider = ({ children }) => {
  const { state, dispatch } = React.useContext(Store);
  
  useEffect(() => {
    checkAuth();
  }, []);

  const handleSignUp = async({ username, email, password }) => {    
    try {
      const { data } = await ApiService.post('users', { user: { username, email, password }});

      console.log('SignUp data: ', data);
      
      JwtService.saveToken(data.user.token);
      ApiService.setHeader();
      
      dispatch({
        type: AUTH_SIGNUP,
        payload: data.user
      });
    } catch (error) {
      console.log(error);
      handleAuthError(error);
    }
  };

  const handleLogin = async({ email, password }) => {    
    try {
      const { data } = await ApiService.post('users/login', { user: { email, password }});
      
      console.log('Login data: ', data);
      
      JwtService.saveToken(data.user.token);
      ApiService.setHeader();

      dispatch({
        type: AUTH_LOGIN,
        payload: data.user
      });
    } catch (error) {
      console.log(error);
      handleAuthError(error);
    }
  };

  const handleLogout = async() => {
    JwtService.destroyToken();

    dispatch({
      type: AUTH_LOGOUT,
      payload: null
    });
  };

  const checkAuth = async() => {
    if (JwtService.getToken()) {

      ApiService.setHeader();

      try {
        const { data } = await ApiService.get('user');

        dispatch({
          type: AUTH_FETCH_USER,
          payload: data.user
        });
      } catch (error) {
        handleAuthError(error);
      }
    } else {
      handleAuthError();
    }
  };

  const updateUser = async(payload) => {
    const { email, username, password, image, bio } = payload;
    const user = {
      email,
      username,
      bio,
      image
    };

    if (password) {
      user.password = password;
    }

    const { data } = await ApiService.put('user', user);

    dispatch({
      type: AUTH_FETCH_USER,
      payload: data.user
    });
  };

  const handleAuthError = (error) => {
    JwtService.destroyToken();

    dispatch({
      type: AUTH_ERROR,
      payload: error
    });
  };

  return (
    <AuthContext.Provider value={{
      handleSignUp, 
      handleLogin, 
      handleLogout, 
      handleAuthError,
      checkAuth,
      updateUser,
      ...state
      }}>
      {children}
    </AuthContext.Provider>
  )
};

const AuthConsumer = AuthContext.Consumer;

export { AuthProvider, AuthConsumer };

