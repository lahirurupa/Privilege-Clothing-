// import {
//   Link,
//   NavLink,
//   useNavigate
// } from "react-router-dom";

// import {
//   useAuth
// } from "../context/AuthContext";

// import {
//   useCart
// } from "../context/CartContext";


// function Navbar() {

//   const {
//     user,
//     logout
//   } = useAuth();

//   const {
//     cartItems
//   } = useCart();

//   const {
//   cartCount
// } = useCart();


//   const navigate =
//     useNavigate();


//   function handleLogout() {

//     logout();

//     navigate("/");

//   }


//   return (

//     <header
//       className="store-header"
//     >

//       <div
//         className="store-nav"
//       >

//         <Link
//           to="/"
//           className="store-logo"
//         >
//           PRIVILEGE
//         </Link>


//         <nav
//           className="store-menu"
//         >

//           <NavLink
//             to="/"
//             end
//           >
//             Home
//           </NavLink>


//           <NavLink
//             to="/shop"
//           >
//             Shop
//           </NavLink>

//         </nav>


//         <div
//           className="store-actions"
//         >

//           {
//             user
//               ? (

//                 <>

//                   <span
//                     className="customer-name"
//                   >
//                     {user.name}
//                   </span>


//                   <button
//                     onClick={
//                       handleLogout
//                     }
//                     className="nav-text-button"
//                   >
//                     Logout
//                   </button>

//                 </>

//               )
//               : (

//                 <>

//                   <Link
//                     to="/login"
//                   >
//                     Login
//                   </Link>


//                   <Link
//                     to="/register"
//                     className="nav-register"
//                   >
//                     Register
//                   </Link>

//                 </>

//               )
//           }


//           <Link
//             to="/cart"
//             className="cart-link"
//           >
//             Cart
//             {
//                 cartCount > 0 && (
//                     <span className="cart-count">
//                         {cartCount}
//                     </span>
//                 )
//             }
//           </Link>

//         </div>

//       </div>

//     </header>

//   );

// }


// export default Navbar;








import {
  Link,
  NavLink,
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


  function handleLogout() {

    logout();


    navigate(
      "/",
      {
        replace: true
      }
    );

  }


  return (

    <header
      className="store-header"
    >

      <div
        className="store-nav"
      >

        {/* LOGO */}

        <Link
          to="/"
          className="store-logo"
        >
          PRIVILEGE
        </Link>


        {/* MAIN NAVIGATION */}

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


        {/* ACCOUNT */}

        <div
          className="store-actions"
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
                          {cartCount}
                        </span>

                      )
                    }

                  </Link>


                  <span
                    className="customer-name"
                  >
                    {user.name}
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

      </div>

    </header>

  );

}


export default Navbar;