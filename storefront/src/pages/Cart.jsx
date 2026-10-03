// import {
//   Link,
//   useNavigate
// } from "react-router-dom";

// import {
//   useCart
// } from "../context/CartContext";


// function Cart() {

//   const {

//     cart,

//     subtotal,

//     loading,

//     error,

//     updateQuantity,

//     removeFromCart,

//     clearCart

//   } = useCart();


//   const navigate =
//     useNavigate();


//   function formatPrice(
//     price
//   ) {

//     return new Intl.NumberFormat(
//       "en-LK",
//       {
//         style: "currency",
//         currency: "LKR"
//       }
//     ).format(
//       Number(price)
//     );

//   }


//   async function handleQuantity(
//     item,
//     quantity
//   ) {

//     try {

//       await updateQuantity(
//         item.variantId,
//         quantity
//       );


//     } catch (error) {

//       console.error(error);

//     }

//   }


//   async function handleRemove(
//     item
//   ) {

//     const confirmed =
//       window.confirm(
//         `Remove ${item.productName} (${item.colorName} / ${item.size}) from your cart?`
//       );


//     if (!confirmed) {

//       return;

//     }


//     try {

//       await removeFromCart(
//         item.variantId
//       );

//     } catch (error) {

//       console.error(error);

//     }

//   }


//   async function handleClear() {

//     if (
//       !window.confirm(
//         "Remove all items from your cart?"
//       )
//     ) {

//       return;

//     }


//     await clearCart();

//   }


//   if (loading) {

//     return (

//       <section
//         className="store-section"
//       >
//         Loading your cart...
//       </section>

//     );

//   }


//   if (
//     cart.length === 0
//   ) {

//     return (

//       <section
//         className="store-section cart-empty"
//       >

//         <h1>
//           Your Cart
//         </h1>


//         {
//           error && (

//             <div
//               className="store-error"
//             >
//               {error}
//             </div>

//           )
//         }


//         <p>
//           Your shopping cart is empty.
//         </p>


//         <Link
//           to="/shop"
//           className="hero-button dark-button"
//         >
//           Continue Shopping
//         </Link>

//       </section>

//     );

//   }


//   return (

//     <section
//       className="store-section"
//     >

//       <div
//         className="cart-heading"
//       >

//         <div>

//           <span
//             className="store-eyebrow"
//           >
//             YOUR SELECTION
//           </span>

//           <h1>
//             Shopping Cart
//           </h1>

//         </div>


//         <button
//           className="clear-cart-button"
//           onClick={
//             handleClear
//           }
//         >
//           Clear Cart
//         </button>

//       </div>


//       {
//         error && (

//           <div
//             className="store-error"
//           >
//             {error}
//           </div>

//         )
//       }


//       <div
//         className="cart-layout"
//       >

//         <div
//           className="cart-items"
//         >

//           {
//             cart.map(
//               item => {

//                 const unavailable =
//                   !item.productActive ||
//                   !item.variantActive ||
//                   item.availableStock <=
//                     0;


//                 return (

//                   <div
//                     className="cart-item"
//                     key={
//                       item.variantId
//                     }
//                   >

//                     <div
//                       className="cart-item-image"
//                     >

//                       {
//                         item.image
//                           ? (

//                             <img
//                               src={
//                                 item.image
//                               }
//                               alt={
//                                 item.productName
//                               }
//                             />

//                           )
//                           : (

//                             <div
//                               className="product-placeholder"
//                             >
//                               No image
//                             </div>

//                           )
//                       }

//                     </div>


//                     <div
//                       className="cart-item-info"
//                     >

//                       <Link
//                         to={
//                           `/product/${item.productId}`
//                         }
//                       >

//                         <h3>
//                           {
//                             item.productName
//                           }
//                         </h3>

//                       </Link>


//                       <p>
//                         {
//                           item.colorName
//                         }
//                         {" / "}
//                         {
//                           item.size
//                         }
//                       </p>


//                       <small>
//                         SKU: {
//                           item.sku
//                         }
//                       </small>


//                       <strong>
//                         {
//                           formatPrice(
//                             item.price
//                           )
//                         }
//                       </strong>


//                       {
//                         unavailable && (

//                           <span
//                             className="cart-unavailable"
//                           >
//                             Currently unavailable
//                           </span>

//                         )
//                       }


//                       {
//                         !unavailable &&
//                         item.availableStock <=
//                           5 && (

//                           <span
//                             className="cart-low-stock"
//                           >
//                             Only {
//                               item.availableStock
//                             } left
//                           </span>

//                         )
//                       }

//                     </div>


//                     <div
//                       className="cart-item-controls"
//                     >

//                       <label>
//                         Quantity
//                       </label>


//                       <select
//                         disabled={
//                           unavailable
//                         }
//                         value={
//                           item.quantity
//                         }
//                         onChange={
//                           event =>
//                             handleQuantity(
//                               item,
//                               event.target.value
//                             )
//                         }
//                       >

//                         {
//                           Array.from(
//                             {
//                               length:
//                                 Math.min(
//                                   item.availableStock,
//                                   20
//                                 )
//                             },
//                             (
//                               _,
//                               index
//                             ) =>
//                               index + 1
//                           ).map(
//                             number => (

//                               <option
//                                 key={
//                                   number
//                                 }
//                                 value={
//                                   number
//                                 }
//                               >
//                                 {number}
//                               </option>

//                             )
//                           )
//                         }

//                       </select>


//                       <button
//                         type="button"
//                         onClick={() =>
//                           handleRemove(
//                             item
//                           )
//                         }
//                       >
//                         Remove
//                       </button>

//                     </div>

//                   </div>

//                 );

//               }
//             )
//           }

//         </div>


//         <aside
//           className="cart-summary"
//         >

//           <h2>
//             Order Summary
//           </h2>


//           <div
//             className="summary-row"
//           >

//             <span>
//               Subtotal
//             </span>

//             <strong>
//               {
//                 formatPrice(
//                   subtotal
//                 )
//               }
//             </strong>

//           </div>


//           <div
//             className="summary-row"
//           >

//             <span>
//               Delivery
//             </span>

//             <strong>
//               Calculated later
//             </strong>

//           </div>


//           <div
//             className="summary-total"
//           >

//             <span>
//               Current Total
//             </span>

//             <strong>
//               {
//                 formatPrice(
//                   subtotal
//                 )
//               }
//             </strong>

//           </div>


//           <button
//             className="checkout-button"
//             disabled={
//               cart.some(
//                 item =>
//                   !item.productActive ||
//                   !item.variantActive ||
//                   item.availableStock <
//                     item.quantity
//               )
//             }
//             onClick={() =>
//               navigate(
//                 "/checkout"
//               )
//             }
//           >
//             Checkout
//           </button>


//           <Link
//             to="/shop"
//             className="continue-shopping"
//           >
//             Continue Shopping
//           </Link>

//         </aside>

//       </div>

//     </section>

//   );

// }


// export default Cart;





import {
  Link,
  useNavigate
} from "react-router-dom";

import {
  useCart
} from "../context/CartContext";


function Cart() {

  const {

    cart,

    subtotal,

    loading,

    error,

    updateQuantity,

    removeFromCart,

    clearCart

  } = useCart();


  const navigate =
    useNavigate();


  /*
  |--------------------------------------------------------------------------
  | Currency
  |--------------------------------------------------------------------------
  */

  function formatPrice(
    price
  ) {

    return new Intl.NumberFormat(
      "en-LK",
      {
        style: "currency",
        currency: "LKR"
      }
    ).format(
      Number(price)
    );

  }


  /*
  |--------------------------------------------------------------------------
  | Update Quantity
  |--------------------------------------------------------------------------
  */

  async function handleQuantityChange(
    item,
    quantity
  ) {

    try {

      await updateQuantity(
        item.variantId,
        quantity
      );


    } catch (error) {

      console.error(error);

    }

  }


  /*
  |--------------------------------------------------------------------------
  | Remove Item
  |--------------------------------------------------------------------------
  */

  async function handleRemove(
    item
  ) {

    const confirmed =
      window.confirm(
        `Remove "${item.productName}" (${item.colorName} / ${item.size}) from your cart?`
      );


    if (!confirmed) {

      return;

    }


    try {

      await removeFromCart(
        item.variantId
      );


    } catch (error) {

      console.error(error);

    }

  }


  /*
  |--------------------------------------------------------------------------
  | Clear Cart
  |--------------------------------------------------------------------------
  */

  async function handleClearCart() {

    const confirmed =
      window.confirm(
        "Remove all items from your cart?"
      );


    if (!confirmed) {

      return;

    }


    try {

      await clearCart();


    } catch (error) {

      console.error(error);

    }

  }


  /*
  |--------------------------------------------------------------------------
  | Loading
  |--------------------------------------------------------------------------
  */

  if (loading) {

    return (

      <section
        className="store-section"
      >
        Loading your cart...
      </section>

    );

  }


  /*
  |--------------------------------------------------------------------------
  | Empty Cart
  |--------------------------------------------------------------------------
  */

  if (
    cart.length === 0
  ) {

    return (

      <section
        className="store-section cart-empty"
      >

        <h1>
          Your Cart
        </h1>


        {
          error && (

            <div
              className="store-error"
            >
              {error}
            </div>

          )
        }


        <p>
          Your shopping cart is empty.
        </p>


        <Link
          to="/shop"
          className="hero-button dark-button"
        >
          Continue Shopping
        </Link>

      </section>

    );

  }


  /*
  |--------------------------------------------------------------------------
  | Does cart contain invalid stock?
  |--------------------------------------------------------------------------
  */

  const hasUnavailableItems =
    cart.some(
      item =>

        !item.productActive ||

        !item.variantActive ||

        Number(
          item.availableStock
        ) <
          Number(
            item.quantity
          )
    );


  return (

    <section
      className="store-section"
    >

      {/* HEADER */}

      <div
        className="cart-heading"
      >

        <div>

          <span
            className="store-eyebrow"
          >
            YOUR SELECTION
          </span>


          <h1>
            Shopping Cart
          </h1>

        </div>


        <button
          type="button"
          className="clear-cart-button"
          onClick={
            handleClearCart
          }
        >
          Clear Cart
        </button>

      </div>


      {
        error && (

          <div
            className="store-error"
          >
            {error}
          </div>

        )
      }


      <div
        className="cart-layout"
      >

        {/* ITEMS */}

        <div
          className="cart-items"
        >

          {
            cart.map(
              item => {

                const unavailable =
                  !item.productActive ||
                  !item.variantActive ||
                  Number(
                    item.availableStock
                  ) <= 0;


                const insufficientStock =
                  Number(
                    item.availableStock
                  ) <
                  Number(
                    item.quantity
                  );


                return (

                  <div
                    className="cart-item"
                    key={
                      item.variantId
                    }
                  >

                    {/* IMAGE */}

                    <div
                      className="cart-item-image"
                    >

                      {
                        item.image
                          ? (

                            <img
                              src={
                                item.image
                              }
                              alt={
                                item.productName
                              }
                            />

                          )
                          : (

                            <div
                              className="product-placeholder"
                            >
                              No image
                            </div>

                          )
                      }

                    </div>


                    {/* INFORMATION */}

                    <div
                      className="cart-item-info"
                    >

                      <Link
                        to={
                          `/product/${item.productId}`
                        }
                      >

                        <h3>
                          {
                            item.productName
                          }
                        </h3>

                      </Link>


                      <p>

                        {
                          item.colorName
                        }

                        {" / "}

                        {
                          item.size
                        }

                      </p>


                      <small>
                        SKU: {
                          item.sku
                        }
                      </small>


                      <strong>
                        {
                          formatPrice(
                            item.price
                          )
                        }
                      </strong>


                      {
                        unavailable && (

                          <span
                            className="cart-unavailable"
                          >
                            Currently unavailable
                          </span>

                        )
                      }


                      {
                        !unavailable &&
                        insufficientStock && (

                          <span
                            className="cart-unavailable"
                          >
                            Only {
                              item.availableStock
                            } available
                          </span>

                        )
                      }


                      {
                        !unavailable &&
                        !insufficientStock &&
                        Number(
                          item.availableStock
                        ) <= 5 && (

                          <span
                            className="cart-low-stock"
                          >

                            Only {
                              item.availableStock
                            } left

                          </span>

                        )
                      }

                    </div>


                    {/* CONTROLS */}

                    <div
                      className="cart-item-controls"
                    >

                      <label>
                        Quantity
                      </label>


                      <select
                        disabled={
                          unavailable
                        }
                        value={
                          Math.min(
                            Number(
                              item.quantity
                            ),
                            Math.max(
                              Number(
                                item.availableStock
                              ),
                              1
                            )
                          )
                        }
                        onChange={
                          event =>
                            handleQuantityChange(
                              item,
                              event.target.value
                            )
                        }
                      >

                        {
                          Array.from(
                            {
                              length:
                                Math.min(
                                  Math.max(
                                    Number(
                                      item.availableStock
                                    ),
                                    0
                                  ),
                                  20
                                )
                            },
                            (
                              _,
                              index
                            ) =>
                              index + 1
                          ).map(
                            number => (

                              <option
                                key={
                                  number
                                }
                                value={
                                  number
                                }
                              >
                                {number}
                              </option>

                            )
                          )
                        }

                      </select>


                      <button
                        type="button"
                        onClick={() =>
                          handleRemove(
                            item
                          )
                        }
                      >
                        Remove
                      </button>

                    </div>

                  </div>

                );

              }
            )
          }

        </div>


        {/* SUMMARY */}

        <aside
          className="cart-summary"
        >

          <h2>
            Order Summary
          </h2>


          <div
            className="summary-row"
          >

            <span>
              Subtotal
            </span>


            <strong>
              {
                formatPrice(
                  subtotal
                )
              }
            </strong>

          </div>


          <div
            className="summary-row"
          >

            <span>
              Delivery
            </span>


            <strong>
              Calculated later
            </strong>

          </div>


          <div
            className="summary-total"
          >

            <span>
              Current Total
            </span>


            <strong>
              {
                formatPrice(
                  subtotal
                )
              }
            </strong>

          </div>


          {
            hasUnavailableItems && (

              <div
                className="store-error"
              >
                Please fix unavailable or insufficient-stock items before checkout.
              </div>

            )
          }


          <button
            type="button"
            className="checkout-button"
            disabled={
              hasUnavailableItems
            }
            onClick={() =>
              navigate(
                "/checkout"
              )
            }
          >
            Checkout
          </button>


          <Link
            to="/shop"
            className="continue-shopping"
          >
            Continue Shopping
          </Link>

        </aside>

      </div>

    </section>

  );

}


export default Cart;