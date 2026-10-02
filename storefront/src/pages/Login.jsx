import {
  useState
} from "react";

import {
  Link,
  useNavigate
} from "react-router-dom";

import {
  useAuth
} from "../context/AuthContext";


function Login() {

  const {
    login
  } = useAuth();


  const navigate =
    useNavigate();


  const [
    email,
    setEmail
  ] = useState("");


  const [
    password,
    setPassword
  ] = useState("");


  const [
    error,
    setError
  ] = useState("");


  const [
    loading,
    setLoading
  ] = useState(false);


  async function handleSubmit(
    event
  ) {

    event.preventDefault();


    try {

      setLoading(true);

      setError("");


      await login(
        email,
        password
      );


      navigate("/");


    } catch (error) {

      setError(
        error.response
          ?.data
          ?.message ||
        error.message ||
        "Unable to login"
      );


    } finally {

      setLoading(false);

    }

  }


  return (

    <section
      className="auth-page"
    >

      <form
        className="store-auth-card"
        onSubmit={
          handleSubmit
        }
      >

        <span
          className="store-eyebrow"
        >
          PRIVILEGE
        </span>


        <h1>
          Welcome Back
        </h1>


        <p>
          Sign in to your account.
        </p>


        {
          error && (

            <div
              className="store-error"
            >
              {error}
            </div>

          )
        }


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
          required
        />


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
          required
        />


        <button
          disabled={
            loading
          }
        >

          {
            loading
              ? "Signing in..."
              : "Login"
          }

        </button>


        <div
          className="auth-footer-text"
        >

          Don't have an account?{" "}

          <Link
            to="/register"
          >
            Create Account
          </Link>

        </div>

      </form>

    </section>

  );

}


export default Login;