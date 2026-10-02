import {
  Link,
  NavLink,
  useNavigate
} from "react-router-dom";

import {
  useAuth
} from "../context/AuthContext";


function Navbar() {

  const {
    user,
    logout
  } = useAuth();


  const navigate =
    useNavigate();


  function handleLogout() {

    logout();

    navigate("/");

  }


  return (

    <header
      className="store-header"
    >

      <div
        className="store-nav"
      >

        <Link
          to="/"
          className="store-logo"
        >
          PRIVILEGE
        </Link>


        <nav
          className="store-menu"
        >

          <NavLink
            to="/"
            end
          >
            Home
          </NavLink>


          <NavLink
            to="/shop"
          >
            Shop
          </NavLink>

        </nav>


        <div
          className="store-actions"
        >

          {
            user
              ? (

                <>

                  <span
                    className="customer-name"
                  >
                    {user.name}
                  </span>


                  <button
                    onClick={
                      handleLogout
                    }
                    className="nav-text-button"
                  >
                    Logout
                  </button>

                </>

              )
              : (

                <>

                  <Link
                    to="/login"
                  >
                    Login
                  </Link>


                  <Link
                    to="/register"
                    className="nav-register"
                  >
                    Register
                  </Link>

                </>

              )
          }


          <Link
            to="/cart"
            className="cart-link"
          >
            Cart
          </Link>

        </div>

      </div>

    </header>

  );

}


export default Navbar;