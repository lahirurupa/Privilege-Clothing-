import {
  useState
} from "react";

import {
  Navigate,
  useNavigate
} from "react-router-dom";

import {
  useAuth
} from "../context/AuthContext";


function Login() {

  const {
    login,
    isAuthenticated,
    loading
  } = useAuth();


  const navigate =
    useNavigate();


  const [email, setEmail] =
    useState("");


  const [
    password,
    setPassword
  ] = useState("");


  const [
    error,
    setError
  ] = useState("");


  const [
    submitting,
    setSubmitting
  ] = useState(false);


  /*
  |--------------------------------------------------------------------------
  | Already logged in
  |--------------------------------------------------------------------------
  */

  if (
    !loading &&
    isAuthenticated
  ) {

    return (
      <Navigate
        to="/"
        replace
      />
    );

  }


  /*
  |--------------------------------------------------------------------------
  | Submit
  |--------------------------------------------------------------------------
  */

  async function handleSubmit(
    event
  ) {

    event.preventDefault();


    setError("");


    if (
      !email.trim() ||
      !password
    ) {

      setError(
        "Email and password are required."
      );

      return;

    }


    try {

      setSubmitting(true);


      await login(
        email.trim(),
        password
      );


      navigate(
        "/",
        {
          replace: true
        }
      );

    } catch (error) {

      console.error(error);


      const message =
        error.response?.data?.message ||
        error.message ||
        "Unable to login";


      setError(message);

    } finally {

      setSubmitting(false);

    }

  }


  return (

    <div
      className="login-page"
    >

      <div
        className="login-card"
      >

        <div
          className="login-brand"
        >

          <h1>
            PRIVILEGE
          </h1>

          <p>
            Clothing Administration
          </p>

        </div>


        <h2>
          Admin Login
        </h2>


        <p
          className="login-description"
        >
          Sign in with your administrator account.
        </p>


        {error && (

          <div
            className="error-message"
          >

            {error}

          </div>

        )}


        <form
          onSubmit={
            handleSubmit
          }
        >

          <div
            className="form-group"
          >

            <label>
              Email
            </label>

            <input
              type="email"
              value={email}
              onChange={
                event =>
                  setEmail(
                    event.target.value
                  )
              }
              placeholder="admin@example.com"
              autoComplete="email"
            />

          </div>


          <div
            className="form-group"
          >

            <label>
              Password
            </label>

            <input
              type="password"
              value={password}
              onChange={
                event =>
                  setPassword(
                    event.target.value
                  )
              }
              placeholder="Enter password"
              autoComplete="current-password"
            />

          </div>


          <button
            className="primary-button login-button"
            type="submit"
            disabled={
              submitting
            }
          >

            {
              submitting
                ? "Signing in..."
                : "Sign In"
            }

          </button>

        </form>

      </div>

    </div>

  );

}


export default Login;