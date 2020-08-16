import React, { createContext, useState, useEffect } from "react";
import client from "./client";

export const authContext = createContext();

const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState({ isLoadingToken: true, userToken: null });

  useEffect(() => {
    setAuth({
      isLoadingToken: false,
      userToken: localStorage.getItem("user-token"),
    });
  }, []);

  useEffect(() => {
    if (auth.userToken) {
      localStorage.setItem("user-token", auth.userToken);
    } else {
      client.clearStore();
      localStorage.removeItem("user-token");
    }
  }, [auth.userToken]);

  return (
    <authContext.Provider value={{ auth, setAuth }}>
      {children}
    </authContext.Provider>
  );
};

export default AuthProvider;
