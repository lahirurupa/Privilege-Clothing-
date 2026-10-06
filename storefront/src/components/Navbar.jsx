import {
  useEffect,
  useState
} from "react";

import {
  Link,
  NavLink,
  useLocation,
  useNavigate
} from "react-router-dom";

import {
  useAuth
} from "../context/AuthContext";

import {
  useCart
} from "../context/CartContext";


function Navbar() {

  const {
    user,
    logout
  } = useAuth();


  const {
    cartCount
  } = useCart();


  const navigate =
    useNavigate();


  const location =
    useLocation();


  const [
    mobileMenuOpen,
    setMobileMenuOpen
  ] = useState(false);


  /*
  |--------------------------------------------------------------------------
  | Close Mobile Menu When Route Changes
  |--------------------------------------------------------------------------
  */

  useEffect(() => {

    setMobileMenuOpen(false);

  }, [
    location.pathname
  ]);


  /*
  |--------------------------------------------------------------------------
  | Logout
  |--------------------------------------------------------------------------
  */

  function handleLogout() {

    logout();

    setMobileMenuOpen(false);


    navigate(
      "/",
      {
        replace: true
      }
    );

  }


  /*
  |--------------------------------------------------------------------------
  | Toggle Mobile Menu
  |--------------------------------------------------------------------------
  */

  function toggleMobileMenu() {

    setMobileMenuOpen(
      current =>
        !current
    );

  }


  return (

    <header
      className="store-header"
    >

      <div
        className="store-nav"
      >

        {/* =====================================================
            LOGO
        ====================================================== */}

        <Link
          to="/"
          className="store-logo"
        >
          PREVILEGE
        </Link>


        {/* =====================================================
            DESKTOP NAVIGATION
        ====================================================== */}

        <nav
          className="store-menu desktop-menu"
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


        {/* =====================================================
            DESKTOP ACCOUNT AREA
        ====================================================== */}

        <div
          className="store-actions desktop-actions"
        >

          {
            user
              ? (

                <>

                  <Link
                    to="/orders"
                  >
                    My Orders
                  </Link>


                  <Link
                    to="/cart"
                    className="cart-link"
                  >

                    Cart


                    {
                      cartCount >
                      0 && (

                        <span
                          className="cart-count"
                        >
                          {
                            cartCount >
                            99
                              ? "99+"
                              : cartCount
                          }
                        </span>

                      )
                    }

                  </Link>


                  <span
                    className="customer-name"
                    title={
                      user.name
                    }
                  >
                    {
                      user.name
                    }
                  </span>


                  <button
                    type="button"
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

        </div>


        {/* =====================================================
            MOBILE RIGHT AREA
        ====================================================== */}

        <div
          className="mobile-nav-actions"
        >

          {
            user &&
            cartCount >
              0 && (

              <Link
                to="/cart"
                className="mobile-cart-link"
                aria-label="Shopping cart"
              >

                Cart

                <span
                  className="cart-count"
                >
                  {
                    cartCount >
                    99
                      ? "99+"
                      : cartCount
                  }
                </span>

              </Link>

            )
          }


          <button
            type="button"
            className={
              mobileMenuOpen
                ? "hamburger-button open"
                : "hamburger-button"
            }
            onClick={
              toggleMobileMenu
            }
            aria-label={
              mobileMenuOpen
                ? "Close menu"
                : "Open menu"
            }
            aria-expanded={
              mobileMenuOpen
            }
          >

            <span />

            <span />

            <span />

          </button>

        </div>

      </div>


      {/* =====================================================
          MOBILE MENU
      ====================================================== */}

      <div
        className={
          mobileMenuOpen
            ? "mobile-menu open"
            : "mobile-menu"
        }
      >

        <nav
          className="mobile-menu-links"
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


          {
            user
              ? (

                <>

                  <NavLink
                    to="/orders"
                  >
                    My Orders
                  </NavLink>


                  <NavLink
                    to="/cart"
                    className="mobile-cart-menu-link"
                  >

                    <span>
                      Cart
                    </span>


                    {
                      cartCount >
                      0 && (

                        <span
                          className="mobile-cart-number"
                        >
                          {
                            cartCount
                          }
                        </span>

                      )
                    }

                  </NavLink>


                  <div
                    className="mobile-customer"
                  >

                    <span>
                      Signed in as
                    </span>


                    <strong
                      title={
                        user.name
                      }
                    >
                      {
                        user.name
                      }
                    </strong>

                  </div>


                  <button
                    type="button"
                    className="mobile-logout-button"
                    onClick={
                      handleLogout
                    }
                  >
                    Logout
                  </button>

                </>

              )
              : (

                <>

                  <NavLink
                    to="/login"
                  >
                    Login
                  </NavLink>


                  <NavLink
                    to="/register"
                    className="mobile-register"
                  >
                    Register
                  </NavLink>

                </>

              )
          }

        </nav>

      </div>

    </header>

  );

}


export default Navbar;