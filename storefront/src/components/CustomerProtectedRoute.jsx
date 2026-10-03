import {
  Navigate,
  useLocation
} from "react-router-dom";

import {
  useAuth
} from "../context/AuthContext";


function CustomerProtectedRoute({
  children
}) {

  const {
    user,
    loading
  } = useAuth();


  const location =
    useLocation();


  /*
  |--------------------------------------------------------------------------
  | Wait for authentication check
  |--------------------------------------------------------------------------
  */

  if (loading) {

    return (

      <div
        className="store-section"
      >
        Loading...
      </div>

    );

  }


  /*
  |--------------------------------------------------------------------------
  | Require Login
  |--------------------------------------------------------------------------
  */

  if (!user) {

    return (

      <Navigate
        to="/login"
        replace
        state={{
          from:
            `${location.pathname}${location.search}`
        }}
      />

    );

  }


  /*
  |--------------------------------------------------------------------------
  | Customer role only
  |--------------------------------------------------------------------------
  */

  if (
    user.role !==
    "customer"
  ) {

    return (

      <Navigate
        to="/"
        replace
      />

    );

  }


  return children;

}


export default CustomerProtectedRoute;