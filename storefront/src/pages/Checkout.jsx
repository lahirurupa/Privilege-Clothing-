// import {
//   useState
// } from "react";

// import {
//   Navigate,
//   useNavigate
// } from "react-router-dom";

// import api
//   from "../services/api";

// import {
//   useAuth
// } from "../context/AuthContext";

// import {
//   useCart
// } from "../context/CartContext";


// function Checkout() {

//   const {
//     user
//   } = useAuth();


//   const {
//     cart,
//     subtotal,
//     clearCart
//   } = useCart();


//   const navigate =
//     useNavigate();


//   const [
//     customerName,
//     setCustomerName
//   ] = useState(
//     user?.name || ""
//   );


//   const [
//     phone,
//     setPhone
//   ] = useState("");


//   const [
//     address1,
//     setAddress1
//   ] = useState("");


//   const [
//     address2,
//     setAddress2
//   ] = useState("");


//   const [
//     city,
//     setCity
//   ] = useState("");


//   const [
//     postalCode,
//     setPostalCode
//   ] = useState("");


//   const [
//     error,
//     setError
//   ] = useState("");


//   const [
//     submitting,
//     setSubmitting
//   ] = useState(false);


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


//   if (
//     cart.length === 0
//   ) {

//     return (
//       <Navigate
//         to="/cart"
//         replace
//       />
//     );

//   }


//   async function handleSubmit(
//     event
//   ) {

//     event.preventDefault();


//     try {

//       setSubmitting(true);

//       setError("");


//       const response =
//         await api.post(
//           "/orders",
//           {

//             customer_name:
//               customerName,

//             phone,

//             address_line1:
//               address1,

//             address_line2:
//               address2,

//             city,

//             postal_code:
//               postalCode,

//             items:
//               cart.map(
//                 item => ({

//                   variant_id:
//                     item.variantId,

//                   quantity:
//                     item.quantity

//                 })
//               )

//           }
//         );


//       const order =
//         response.data.order;


//       clearCart();


//       navigate(
//         "/orders",
//         {
//           replace: true,

//           state: {
//             newOrderNumber:
//               order.order_number
//           }
//         }
//       );


//     } catch (error) {

//       console.error(error);


//       setError(
//         error.response
//           ?.data
//           ?.message ||
//         "Unable to place your order."
//       );


//     } finally {

//       setSubmitting(false);

//     }

//   }


//   return (

//     <section
//       className="store-section"
//     >

//       <div
//         className="checkout-header"
//       >

//         <span
//           className="store-eyebrow"
//         >
//           SECURE CHECKOUT
//         </span>

//         <h1>
//           Checkout
//         </h1>

//       </div>


//       {
//         error && (

//           <div
//             className="store-error checkout-error"
//           >
//             {error}
//           </div>

//         )
//       }


//       <div
//         className="checkout-layout"
//       >

//         <form
//           className="checkout-form"
//           onSubmit={
//             handleSubmit
//           }
//         >

//           <h2>
//             Delivery Information
//           </h2>


//           <label>
//             Full Name *
//           </label>

//           <input
//             value={
//               customerName
//             }
//             onChange={
//               event =>
//                 setCustomerName(
//                   event.target.value
//                 )
//             }
//             required
//           />


//           <label>
//             Email
//           </label>

//           <input
//             value={
//               user?.email ||
//               ""
//             }
//             disabled
//           />


//           <label>
//             Phone Number *
//           </label>

//           <input
//             value={phone}
//             onChange={
//               event =>
//                 setPhone(
//                   event.target.value
//                 )
//             }
//             required
//           />


//           <label>
//             Address *
//           </label>

//           <input
//             value={
//               address1
//             }
//             onChange={
//               event =>
//                 setAddress1(
//                   event.target.value
//                 )
//             }
//             required
//           />


//           <label>
//             Address Line 2
//           </label>

//           <input
//             value={
//               address2
//             }
//             onChange={
//               event =>
//                 setAddress2(
//                   event.target.value
//                 )
//             }
//           />


//           <div
//             className="checkout-two-columns"
//           >

//             <div>

//               <label>
//                 City *
//               </label>

//               <input
//                 value={city}
//                 onChange={
//                   event =>
//                     setCity(
//                       event.target.value
//                     )
//                 }
//                 required
//               />

//             </div>


//             <div>

//               <label>
//                 Postal Code
//               </label>

//               <input
//                 value={
//                   postalCode
//                 }
//                 onChange={
//                   event =>
//                     setPostalCode(
//                       event.target.value
//                     )
//                 }
//               />

//             </div>

//           </div>


//           <div
//             className="payment-box"
//           >

//             <strong>
//               Payment Method
//             </strong>

//             <p>
//               Cash on Delivery
//             </p>

//           </div>


//           <button
//             className="place-order-button"
//             disabled={
//               submitting
//             }
//           >

//             {
//               submitting
//                 ? "Placing Order..."
//                 : "Place Order"
//             }

//           </button>

//         </form>


//         <aside
//           className="checkout-summary"
//         >

//           <h2>
//             Your Order
//           </h2>


//           {
//             cart.map(
//               item => (

//                 <div
//                   className="checkout-item"
//                   key={
//                     item.variantId
//                   }
//                 >

//                   <div>

//                     <strong>
//                       {
//                         item.productName
//                       }
//                     </strong>

//                     <small>
//                       {
//                         item.colorName
//                       }
//                       {" / "}
//                       {
//                         item.size
//                       }
//                       {" × "}
//                       {
//                         item.quantity
//                       }
//                     </small>

//                   </div>


//                   <span>
//                     {
//                       formatPrice(
//                         item.price *
//                         item.quantity
//                       )
//                     }
//                   </span>

//                 </div>

//               )
//             )
//           }


//           <div
//             className="summary-total"
//           >

//             <span>
//               Estimated Total
//             </span>

//             <strong>
//               {
//                 formatPrice(
//                   subtotal
//                 )
//               }
//             </strong>

//           </div>


//           <small
//             className="checkout-note"
//           >
//             Final pricing and stock are verified by the server when your order is placed.
//           </small>

//         </aside>

//       </div>

//     </section>

//   );

// }


// export default Checkout;




import {
  useState
} from "react";

import {
  Navigate,
  useNavigate
} from "react-router-dom";

import api from "../services/api";

import {
  useAuth
} from "../context/AuthContext";

import {
  useCart
} from "../context/CartContext";


function Checkout() {

  const {
    user
  } = useAuth();


  const {
    cart,
    subtotal,
    resetCartState
  } = useCart();


  const navigate =
    useNavigate();


  const [
    customerName,
    setCustomerName
  ] = useState(
    user?.name || ""
  );


  const [
    phone,
    setPhone
  ] = useState("");


  const [
    address1,
    setAddress1
  ] = useState("");


  const [
    address2,
    setAddress2
  ] = useState("");


  const [
    city,
    setCity
  ] = useState("");


  const [
    postalCode,
    setPostalCode
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
  | No Cart
  |--------------------------------------------------------------------------
  */

  if (
    cart.length === 0
  ) {

    return (

      <Navigate
        to="/cart"
        replace
      />

    );

  }


  /*
  |--------------------------------------------------------------------------
  | Place Order
  |--------------------------------------------------------------------------
  */

  async function handleSubmit(
    event
  ) {

    event.preventDefault();


    try {

      setSubmitting(true);

      setError("");


      /*
      |--------------------------------------------------------------------------
      | IMPORTANT
      |--------------------------------------------------------------------------
      |
      | We send ONLY delivery/customer information.
      |
      | The backend loads:
      |
      | cart_items
      | product price
      | current stock
      |
      | directly from PostgreSQL.
      |
      */

      const response =
        await api.post(
          "/orders",
          {

            customer_name:
              customerName.trim(),

            phone:
              phone.trim(),

            address_line1:
              address1.trim(),

            address_line2:
              address2.trim(),

            city:
              city.trim(),

            postal_code:
              postalCode.trim()

          }
        );


      const order =
        response.data.order;


      /*
      |--------------------------------------------------------------------------
      | Backend transaction has cleared cart
      |--------------------------------------------------------------------------
      */

      resetCartState();


      /*
      |--------------------------------------------------------------------------
      | Navigate to customer's orders
      |--------------------------------------------------------------------------
      */

      navigate(
        "/orders",
        {
          replace: true,

          state: {

            newOrderNumber:
              order.order_number

          }
        }
      );


    } catch (error) {

      console.error(
        "CHECKOUT ERROR:",
        error
      );


      setError(
        error.response
          ?.data
          ?.message ||
        "Unable to place your order."
      );


    } finally {

      setSubmitting(false);

    }

  }


  return (

    <section
      className="store-section"
    >

      <div
        className="checkout-header"
      >

        <span
          className="store-eyebrow"
        >
          SECURE CHECKOUT
        </span>


        <h1>
          Checkout
        </h1>

      </div>


      {
        error && (

          <div
            className="store-error checkout-error"
          >
            {error}
          </div>

        )
      }


      <div
        className="checkout-layout"
      >

        {/* DELIVERY INFORMATION */}

        <form
          className="checkout-form"
          onSubmit={
            handleSubmit
          }
        >

          <h2>
            Delivery Information
          </h2>


          <label>
            Full Name *
          </label>


          <input
            type="text"
            value={
              customerName
            }
            onChange={
              event =>
                setCustomerName(
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
            value={
              user?.email ||
              ""
            }
            disabled
          />


          <label>
            Phone Number *
          </label>


          <input
            type="tel"
            value={
              phone
            }
            onChange={
              event =>
                setPhone(
                  event.target.value
                )
            }
            placeholder="0771234567"
            required
          />


          <label>
            Address *
          </label>


          <input
            type="text"
            value={
              address1
            }
            onChange={
              event =>
                setAddress1(
                  event.target.value
                )
            }
            required
          />


          <label>
            Address Line 2
          </label>


          <input
            type="text"
            value={
              address2
            }
            onChange={
              event =>
                setAddress2(
                  event.target.value
                )
            }
          />


          <div
            className="checkout-two-columns"
          >

            <div>

              <label>
                City *
              </label>


              <input
                type="text"
                value={
                  city
                }
                onChange={
                  event =>
                    setCity(
                      event.target.value
                    )
                }
                required
              />

            </div>


            <div>

              <label>
                Postal Code
              </label>


              <input
                type="text"
                value={
                  postalCode
                }
                onChange={
                  event =>
                    setPostalCode(
                      event.target.value
                    )
                }
              />

            </div>

          </div>


          <div
            className="payment-box"
          >

            <strong>
              Payment Method
            </strong>


            <p>
              Cash on Delivery
            </p>

          </div>


          <button
            type="submit"
            className="place-order-button"
            disabled={
              submitting
            }
          >

            {
              submitting
                ? "Placing Order..."
                : "Place Order"
            }

          </button>

        </form>


        {/* ORDER SUMMARY */}

        <aside
          className="checkout-summary"
        >

          <h2>
            Your Order
          </h2>


          {
            cart.map(
              item => (

                <div
                  className="checkout-item"
                  key={
                    item.variantId
                  }
                >

                  <div>

                    <strong>
                      {
                        item.productName
                      }
                    </strong>


                    <small>

                      {
                        item.colorName
                      }

                      {" / "}

                      {
                        item.size
                      }

                      {" × "}

                      {
                        item.quantity
                      }

                    </small>

                  </div>


                  <span>

                    {
                      formatPrice(
                        Number(
                          item.price
                        ) *
                        Number(
                          item.quantity
                        )
                      )
                    }

                  </span>

                </div>

              )
            )
          }


          <div
            className="summary-total"
          >

            <span>
              Estimated Total
            </span>


            <strong>
              {
                formatPrice(
                  subtotal
                )
              }
            </strong>

          </div>


          <small
            className="checkout-note"
          >
            Final price and stock availability are verified by our server when the order is placed.
          </small>

        </aside>

      </div>

    </section>

  );

}


export default Checkout;