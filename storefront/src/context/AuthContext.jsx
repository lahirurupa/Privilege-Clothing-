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

  const [
    user,
    setUser
  ] = useState(null);


  const [
    loading,
    setLoading
  ] = useState(true);


  /*
  |--------------------------------------------------------------------------
  | Restore Session
  |--------------------------------------------------------------------------
  */

  useEffect(() => {

    async function checkLogin() {

      const token =
        sessionStorage.getItem(
          "customerToken"
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


        setUser(
          response.data.user
        );


      } catch (error) {

        sessionStorage.removeItem(
          "customerToken"
        );

        sessionStorage.removeItem(
          "customerUser"
        );

        setUser(null);

      } finally {

        setLoading(false);

      }

    }


    checkLogin();

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


    if (
      user.role !==
      "customer"
    ) {

      throw new Error(
        "Please use the administrator website for admin accounts."
      );

    }


    sessionStorage.setItem(
      "customerToken",
      token
    );


    sessionStorage.setItem(
      "customerUser",
      JSON.stringify(user)
    );


    setUser(user);


    return user;

  }


  /*
  |--------------------------------------------------------------------------
  | Register
  |--------------------------------------------------------------------------
  */

  async function register(
    name,
    email,
    password
  ) {

    const response =
      await api.post(
        "/auth/register",
        {
          name,
          email,
          password
        }
      );


    const {
      token,
      user
    } = response.data;


    sessionStorage.setItem(
      "customerToken",
      token
    );


    sessionStorage.setItem(
      "customerUser",
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
      "customerToken"
    );

    sessionStorage.removeItem(
      "customerUser"
    );

    setUser(null);

  }


  return (

    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
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