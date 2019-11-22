
import React, { useState } from 'react';

const AuthContext = React.createContext();

const initialState = {
  user: null,
  isLoggedIn: false,
  errorMessage: null
};

const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState(initialState);

  const handleSignUp = async({ username, email, password }) => {
    if ((username === 'admin') && (password === 'admin')) {
      setAuth({ user: { username, email }, isLoggedIn: true });
    } else {
      setAuth({ user: null, isLoggedIn: false, errorMessage: 'Wrong user or password!' });
    }
  };

  const handleLogin = async({ username, password }) => {
    if ((username === 'admin') && (password === 'admin')) {
      setAuth({ user: { username }, isLoggedIn: true });
    } else {
      setAuth({ user: null, isLoggedIn: false, errorMessage: 'Wrong user or password!' });
    }
  };

  const handleLogout = async() => {
    setAuth({ user: null, isLoggedIn: false });
  };

  const handleAuthError = (error) => {
    console.log("Error: " + error.code + " " + error.message);
  };

  return (
    <AuthContext.Provider value={{
      handleSignUp, 
      handleLogin, 
      handleLogout, 
      handleAuthError,
      ...auth
      }}>
      {children}
    </AuthContext.Provider>
  )
};

const AuthConsumer = AuthContext.Consumer;

export { AuthProvider, AuthConsumer };

