import {
  createContext,
  useContext,
  useEffect,
  useState
} from "react";

import api from "../services/api";


const AuthContext =
  createContext(null);


export function AuthProvider({
  children
}) {

  const [user, setUser] =
    useState(null);

  const [loading, setLoading] =
    useState(true);


  /*
  |--------------------------------------------------------------------------
  | Check existing login
  |--------------------------------------------------------------------------
  */

  useEffect(() => {

    async function checkAuth() {

      const token =
        sessionStorage.getItem(
          "adminToken"
        );


      if (!token) {

        setLoading(false);

        return;

      }


      try {

        const response =
          await api.get(
            "/auth/me"
          );


        const currentUser =
          response.data.user;


        /*
        |--------------------------------------------------------------------------
        | Admin application only
        |--------------------------------------------------------------------------
        */

        if (
          currentUser.role !==
          "admin"
        ) {

          throw new Error(
            "Administrator access required"
          );

        }


        setUser(
          currentUser
        );


        sessionStorage.setItem(
          "adminUser",
          JSON.stringify(
            currentUser
          )
        );

      } catch (error) {

        sessionStorage.removeItem(
          "adminToken"
        );

        sessionStorage.removeItem(
          "adminUser"
        );

        setUser(null);

      } finally {

        setLoading(false);

      }

    }


    checkAuth();

  }, []);


  /*
  |--------------------------------------------------------------------------
  | Login
  |--------------------------------------------------------------------------
  */

  async function login(
    email,
    password
  ) {

    const response =
      await api.post(
        "/auth/login",
        {
          email,
          password
        }
      );


    const {
      token,
      user
    } = response.data;


    /*
    |--------------------------------------------------------------------------
    | Prevent customers entering admin app
    |--------------------------------------------------------------------------
    */

    if (
      user.role !==
      "admin"
    ) {

      throw new Error(
        "This account does not have administrator access."
      );

    }


    sessionStorage.setItem(
      "adminToken",
      token
    );


    sessionStorage.setItem(
      "adminUser",
      JSON.stringify(user)
    );


    setUser(user);


    return user;

  }


  /*
  |--------------------------------------------------------------------------
  | Logout
  |--------------------------------------------------------------------------
  */

  function logout() {

    sessionStorage.removeItem(
      "adminToken"
    );

    sessionStorage.removeItem(
      "adminUser"
    );

    setUser(null);

  }


  return (

    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        logout,
        isAuthenticated:
          Boolean(user)
      }}
    >

      {children}

    </AuthContext.Provider>

  );

}


export function useAuth() {

  const context =
    useContext(
      AuthContext
    );


  if (!context) {

    throw new Error(
      "useAuth must be used inside AuthProvider"
    );

  }


  return context;

}