// import {
//   createContext,
//   useCallback,
//   useContext,
//   useEffect,
//   useMemo,
//   useState
// } from "react";

// import api
//   from "../services/api";

// import {
//   useAuth
// } from "./AuthContext";


// const CartContext =
//   createContext(null);


// export function CartProvider({
//   children
// }) {

//   const {
//     user,
//     loading:
//       authLoading
//   } = useAuth();


//   const [
//     cart,
//     setCart
//   ] = useState([]);


//   const [
//     loading,
//     setLoading
//   ] = useState(false);


//   const [
//     error,
//     setError
//   ] = useState("");


//   /*
//   |--------------------------------------------------------------------------
//   | Load customer's cart
//   |--------------------------------------------------------------------------
//   */

//   const loadCart =
//     useCallback(
//       async () => {

//         /*
//         |--------------------------------------------------------------------------
//         | No logged-in customer = no cart
//         |--------------------------------------------------------------------------
//         */

//         if (
//           !user ||
//           user.role !==
//             "customer"
//         ) {

//           setCart([]);

//           return [];

//         }


//         try {

//           setLoading(true);

//           setError("");


//           const response =
//             await api.get(
//               "/cart"
//             );


//           const items =
//             response.data.cart ||
//             [];


//           setCart(items);


//           return items;


//         } catch (error) {

//           console.error(
//             "LOAD CART ERROR:",
//             error
//           );


//           setError(
//             error.response
//               ?.data
//               ?.message ||
//             "Unable to load cart."
//           );


//           setCart([]);


//           return [];


//         } finally {

//           setLoading(false);

//         }

//       },
//       [user]
//     );


//   /*
//   |--------------------------------------------------------------------------
//   | Initialize / reset when login state changes
//   |--------------------------------------------------------------------------
//   */

//   useEffect(() => {

//     if (authLoading) {

//       return;

//     }


//     if (
//       user?.role ===
//       "customer"
//     ) {

//       loadCart();

//     } else {

//       setCart([]);

//       setError("");

//     }

//   }, [
//     user,
//     authLoading,
//     loadCart
//   ]);


//   /*
//   |--------------------------------------------------------------------------
//   | CREATE - Add item
//   |--------------------------------------------------------------------------
//   */

//   async function addToCart(
//     variantId,
//     quantity = 1
//   ) {

//     if (!user) {

//       throw new Error(
//         "Please login before adding items to your cart."
//       );

//     }


//     try {

//       setError("");


//       await api.post(
//         "/cart/items",
//         {

//           variant_id:
//             variantId,

//           quantity

//         }
//       );


//       await loadCart();


//       return true;


//     } catch (error) {

//       const message =
//         error.response
//           ?.data
//           ?.message ||
//         error.message ||
//         "Unable to add item to cart.";


//       setError(message);


//       throw new Error(
//         message
//       );

//     }

//   }


//   /*
//   |--------------------------------------------------------------------------
//   | UPDATE
//   |--------------------------------------------------------------------------
//   */

//   async function updateQuantity(
//     variantId,
//     quantity
//   ) {

//     try {

//       setError("");


//       await api.patch(
//         `/cart/items/${variantId}`,
//         {
//           quantity:
//             Number(quantity)
//         }
//       );


//       await loadCart();


//     } catch (error) {

//       const message =
//         error.response
//           ?.data
//           ?.message ||
//         "Unable to update cart.";


//       setError(message);


//       /*
//       |--------------------------------------------------------------------------
//       | Restore authoritative server cart
//       |--------------------------------------------------------------------------
//       */

//       await loadCart();


//       throw error;

//     }

//   }


//   /*
//   |--------------------------------------------------------------------------
//   | DELETE
//   |--------------------------------------------------------------------------
//   */

//   async function removeFromCart(
//     variantId
//   ) {

//     try {

//       setError("");


//       await api.delete(
//         `/cart/items/${variantId}`
//       );


//       await loadCart();


//     } catch (error) {

//       const message =
//         error.response
//           ?.data
//           ?.message ||
//         "Unable to remove item.";


//       setError(message);


//       throw error;

//     }

//   }


//   /*
//   |--------------------------------------------------------------------------
//   | DELETE ALL
//   |--------------------------------------------------------------------------
//   */

//   async function clearCart() {

//     if (!user) {

//       setCart([]);

//       return;

//     }


//     try {

//       await api.delete(
//         "/cart"
//       );


//       setCart([]);


//     } catch (error) {

//       console.error(error);

//       throw error;

//     }

//   }


//   /*
//   |--------------------------------------------------------------------------
//   | Local reset after checkout / logout
//   |--------------------------------------------------------------------------
//   */

//   function resetCartState() {

//     setCart([]);

//     setError("");

//   }


//   /*
//   |--------------------------------------------------------------------------
//   | Computed totals
//   |--------------------------------------------------------------------------
//   */

//   const cartCount =
//     useMemo(
//       () =>
//         cart.reduce(
//           (
//             total,
//             item
//           ) =>
//             total +
//             Number(
//               item.quantity
//             ),
//           0
//         ),
//       [cart]
//     );


//   const subtotal =
//     useMemo(
//       () =>
//         cart.reduce(
//           (
//             total,
//             item
//           ) =>
//             total +
//             Number(
//               item.price
//             ) *
//             Number(
//               item.quantity
//             ),
//           0
//         ),
//       [cart]
//     );


//   return (

//     <CartContext.Provider
//       value={{

//         cart,

//         cartCount,

//         subtotal,

//         loading,

//         error,

//         loadCart,

//         addToCart,

//         updateQuantity,

//         removeFromCart,

//         clearCart,

//         resetCartState

//       }}
//     >

//       {children}

//     </CartContext.Provider>

//   );

// }


// export function useCart() {

//   const context =
//     useContext(
//       CartContext
//     );


//   if (!context) {

//     throw new Error(
//       "useCart must be used inside CartProvider"
//     );

//   }


//   return context;

// }




import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState
} from "react";

import api from "../services/api";

import {
  useAuth
} from "./AuthContext";


const CartContext =
  createContext(null);


export function CartProvider({
  children
}) {

  const {
    user,
    loading:
      authLoading
  } = useAuth();


  const [
    cart,
    setCart
  ] = useState([]);


  const [
    loading,
    setLoading
  ] = useState(false);


  const [
    error,
    setError
  ] = useState("");


  /*
  |--------------------------------------------------------------------------
  | READ - Load authenticated customer's cart
  |--------------------------------------------------------------------------
  */

  const loadCart =
    useCallback(
      async () => {

        /*
        |--------------------------------------------------------------------------
        | Cart only exists for logged-in customers
        |--------------------------------------------------------------------------
        */

        if (
          !user ||
          user.role !==
            "customer"
        ) {

          setCart([]);

          return [];

        }


        try {

          setLoading(true);

          setError("");


          const response =
            await api.get(
              "/cart"
            );


          const items =
            response.data.cart ||
            [];


          setCart(items);


          return items;


        } catch (error) {

          console.error(
            "LOAD CART ERROR:",
            error
          );


          setError(
            error.response
              ?.data
              ?.message ||
            "Unable to load your cart."
          );


          setCart([]);


          return [];


        } finally {

          setLoading(false);

        }

      },
      [
        user
      ]
    );


  /*
  |--------------------------------------------------------------------------
  | Initialize Cart After Login
  |--------------------------------------------------------------------------
  */

  useEffect(() => {

    if (authLoading) {

      return;

    }


    if (
      user?.role ===
      "customer"
    ) {

      loadCart();

    } else {

      /*
      |--------------------------------------------------------------------------
      | Logout / Guest
      |--------------------------------------------------------------------------
      */

      setCart([]);

      setError("");

    }

  }, [
    user,
    authLoading,
    loadCart
  ]);


  /*
  |--------------------------------------------------------------------------
  | CREATE - Add Item
  |--------------------------------------------------------------------------
  */

  async function addToCart(
    variantId,
    quantity = 1
  ) {

    if (
      !user ||
      user.role !==
        "customer"
    ) {

      throw new Error(
        "Please login before adding items to your cart."
      );

    }


    try {

      setError("");


      await api.post(
        "/cart/items",
        {

          variant_id:
            variantId,

          quantity:
            Number(quantity)

        }
      );


      await loadCart();


      return true;


    } catch (error) {

      console.error(
        "ADD CART ERROR:",
        error
      );


      const message =
        error.response
          ?.data
          ?.message ||
        error.message ||
        "Unable to add item to cart.";


      setError(message);


      throw new Error(
        message
      );

    }

  }


  /*
  |--------------------------------------------------------------------------
  | UPDATE - Quantity
  |--------------------------------------------------------------------------
  */

  async function updateQuantity(
    variantId,
    quantity
  ) {

    try {

      setError("");


      await api.patch(
        `/cart/items/${variantId}`,
        {

          quantity:
            Number(quantity)

        }
      );


      await loadCart();


    } catch (error) {

      console.error(
        "UPDATE CART ERROR:",
        error
      );


      const message =
        error.response
          ?.data
          ?.message ||
        "Unable to update cart.";


      setError(message);


      /*
      |--------------------------------------------------------------------------
      | Reload authoritative server state
      |--------------------------------------------------------------------------
      */

      await loadCart();


      throw error;

    }

  }


  /*
  |--------------------------------------------------------------------------
  | DELETE - Single Item
  |--------------------------------------------------------------------------
  */

  async function removeFromCart(
    variantId
  ) {

    try {

      setError("");


      await api.delete(
        `/cart/items/${variantId}`
      );


      await loadCart();


    } catch (error) {

      console.error(
        "REMOVE CART ERROR:",
        error
      );


      const message =
        error.response
          ?.data
          ?.message ||
        "Unable to remove item from cart.";


      setError(message);


      throw error;

    }

  }


  /*
  |--------------------------------------------------------------------------
  | DELETE - Entire Cart
  |--------------------------------------------------------------------------
  */

  async function clearCart() {

    if (!user) {

      setCart([]);

      return;

    }


    try {

      setError("");


      await api.delete(
        "/cart"
      );


      setCart([]);


    } catch (error) {

      console.error(
        "CLEAR CART ERROR:",
        error
      );


      const message =
        error.response
          ?.data
          ?.message ||
        "Unable to clear cart.";


      setError(message);


      throw error;

    }

  }


  /*
  |--------------------------------------------------------------------------
  | Reset Local State
  |--------------------------------------------------------------------------
  |
  | Used after successful checkout.
  |
  */

  function resetCartState() {

    setCart([]);

    setError("");

  }


  /*
  |--------------------------------------------------------------------------
  | Cart Count
  |--------------------------------------------------------------------------
  */

  const cartCount =
    useMemo(
      () =>

        cart.reduce(
          (
            total,
            item
          ) =>

            total +
            Number(
              item.quantity
            ),

          0
        ),

      [cart]
    );


  /*
  |--------------------------------------------------------------------------
  | Subtotal
  |--------------------------------------------------------------------------
  */

  const subtotal =
    useMemo(
      () =>

        cart.reduce(
          (
            total,
            item
          ) =>

            total +
            (
              Number(
                item.price
              ) *
              Number(
                item.quantity
              )
            ),

          0
        ),

      [cart]
    );


  return (

    <CartContext.Provider
      value={{

        cart,

        cartCount,

        subtotal,

        loading,

        error,

        loadCart,

        addToCart,

        updateQuantity,

        removeFromCart,

        clearCart,

        resetCartState

      }}
    >

      {children}

    </CartContext.Provider>

  );

}


export function useCart() {

  const context =
    useContext(
      CartContext
    );


  if (!context) {

    throw new Error(
      "useCart must be used inside CartProvider"
    );

  }


  return context;

}