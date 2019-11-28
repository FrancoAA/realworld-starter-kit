
import React, { useState, useEffect } from 'react';

import ApiService from './api.service';
import JwtService from "./jwt.token.service";

const initialState = {
  user: null,
  errorMessage: null,
  isLoggedIn: JwtService.getToken()
};

const AuthContext = React.createContext();


const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState(initialState);
  
  useEffect(() => {
    checkAuth();
  }, []);

  const handleSignUp = async({ username, email, password }) => {    
    try {
      const { data } = await ApiService.post('users', { user: { username, email, password }});
      console.log('SignUp data: ', data);
      JwtService.saveToken(data.user.token);
      setAuth({ user: data.user, isLoggedIn: true });
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
      setAuth({ user: data.user, isLoggedIn: true });
    } catch (error) {
      console.log(error);
      handleAuthError(error);
    }
  };

  const handleLogout = async() => {
    setAuth({ user: null, isLoggedIn: false });
  };

  const checkAuth = async() => {
    if (JwtService.getToken()) {
      ApiService.setHeader();
      try {
        const { data } = await ApiService.get('user');
        console.log('checkAuth: ', data);
        setAuth({ user: data.user, isLoggedIn: true });
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
    setAuth(prev => ({ user: data.user, ...prev }));
  };

  const handleAuthError = (error) => {
    JwtService.destroyToken();
    setAuth({ user: null, isLoggedIn: false, errorMessage: error });
  };

  return (
    <AuthContext.Provider value={{
      handleSignUp, 
      handleLogin, 
      handleLogout, 
      handleAuthError,
      checkAuth,
      updateUser,
      ...auth
      }}>
      {children}
    </AuthContext.Provider>
  )
};

const AuthConsumer = AuthContext.Consumer;

export { AuthProvider, AuthConsumer };

