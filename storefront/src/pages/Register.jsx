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


function Register() {

  const {
    register
  } = useAuth();


  const navigate =
    useNavigate();


  const [
    name,
    setName
  ] = useState("");


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


      await register(
        name,
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
        "Unable to register"
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
          Create Account
        </h1>


        <p>
          Create an account to shop Privilege Clothing.
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
          Name
        </label>

        <input
          value={name}
          onChange={
            event =>
              setName(
                event.target.value
              )
          }
          required
        />


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


        <small>
          Minimum 8 characters with uppercase, lowercase and number.
        </small>


        <button
          disabled={
            loading
          }
        >

          {
            loading
              ? "Creating..."
              : "Create Account"
          }

        </button>


        <div
          className="auth-footer-text"
        >

          Already have an account?{" "}

          <Link to="/login">
            Login
          </Link>

        </div>

      </form>

    </section>

  );

}


export default Register;