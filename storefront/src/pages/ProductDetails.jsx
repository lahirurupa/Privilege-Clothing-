// import {
//   useEffect,
//   useMemo,
//   useState
// } from "react";

// import {
//   useLocation,
//   useNavigate,
//   useParams
// } from "react-router-dom";

// import api from "../services/api";

// import {
//   useAuth
// } from "../context/AuthContext";

// import {
//   useCart
// } from "../context/CartContext";


// function ProductDetails() {

//   const {
//     id
//   } = useParams();


//   const {
//     user
//   } = useAuth();


//   const {
//     addToCart
//   } = useCart();


//   const navigate =
//     useNavigate();


//   const location =
//     useLocation();


//   const [
//     product,
//     setProduct
//   ] = useState(null);


//   const [
//     loading,
//     setLoading
//   ] = useState(true);


//   const [
//     error,
//     setError
//   ] = useState("");


//   const [
//     selectedColor,
//     setSelectedColor
//   ] = useState("");


//   const [
//     selectedSize,
//     setSelectedSize
//   ] = useState("");


//   const [
//     selectedImage,
//     setSelectedImage
//   ] = useState("");


//   const [
//     addingToCart,
//     setAddingToCart
//   ] = useState(false);


//   const [
//     cartMessage,
//     setCartMessage
//   ] = useState("");


//   const [
//     cartError,
//     setCartError
//   ] = useState("");


//   /*
//   |--------------------------------------------------------------------------
//   | Load Product
//   |--------------------------------------------------------------------------
//   */

//   useEffect(() => {

//     async function loadProduct() {

//       try {

//         setLoading(true);

//         setError("");


//         const response =
//           await api.get(
//             `/products/${id}`
//           );


//         const data =
//           response.data.product;


//         setProduct(data);


//         /*
//         |--------------------------------------------------------------------------
//         | Default Image
//         |--------------------------------------------------------------------------
//         */

//         const images =
//           [
//             ...(data.images || [])
//           ].sort(
//             (a, b) =>
//               a.display_order -
//               b.display_order
//           );


//         if (
//           images.length > 0
//         ) {

//           setSelectedImage(
//             images[0].public_url
//           );

//         }


//         /*
//         |--------------------------------------------------------------------------
//         | Default Color
//         |--------------------------------------------------------------------------
//         */

//         const activeVariants =
//           (
//             data.variants ||
//             []
//           ).filter(
//             variant =>
//               variant.is_active
//           );


//         if (
//           activeVariants.length >
//           0
//         ) {

//           setSelectedColor(
//             activeVariants[0]
//               .color_name
//           );

//         }


//       } catch (error) {

//         console.error(
//           "LOAD PRODUCT ERROR:",
//           error
//         );


//         setError(
//           error.response
//             ?.data
//             ?.message ||
//           "Unable to load product."
//         );


//       } finally {

//         setLoading(false);

//       }

//     }


//     loadProduct();

//   }, [id]);


//   /*
//   |--------------------------------------------------------------------------
//   | Product Images
//   |--------------------------------------------------------------------------
//   */

//   const images =
//     useMemo(() => {

//       if (!product) {

//         return [];

//       }


//       return [
//         ...(product.images || [])
//       ].sort(
//         (a, b) =>
//           a.display_order -
//           b.display_order
//       );

//     }, [product]);


//   /*
//   |--------------------------------------------------------------------------
//   | Colors
//   |--------------------------------------------------------------------------
//   */

//   const colors =
//     useMemo(() => {

//       if (!product) {

//         return [];

//       }


//       const colorMap =
//         new Map();


//       for (
//         const variant of
//         product.variants || []
//       ) {

//         if (
//           !variant.is_active
//         ) {

//           continue;

//         }


//         if (
//           !colorMap.has(
//             variant.color_name
//           )
//         ) {

//           colorMap.set(
//             variant.color_name,
//             {

//               name:
//                 variant.color_name,

//               hex:
//                 variant.color_hex

//             }
//           );

//         }

//       }


//       return Array.from(
//         colorMap.values()
//       );

//     }, [product]);


//   /*
//   |--------------------------------------------------------------------------
//   | Sizes for Selected Color
//   |--------------------------------------------------------------------------
//   */

//   const sizes =
//     useMemo(() => {

//       if (
//         !product ||
//         !selectedColor
//       ) {

//         return [];

//       }


//       return (
//         product.variants ||
//         []
//       ).filter(
//         variant =>
//           variant.is_active &&
//           variant.color_name ===
//             selectedColor
//       );

//     }, [
//       product,
//       selectedColor
//     ]);


//   /*
//   |--------------------------------------------------------------------------
//   | Selected Variant
//   |--------------------------------------------------------------------------
//   */

//   const selectedVariant =
//     useMemo(() => {

//       if (
//         !product ||
//         !selectedColor ||
//         !selectedSize
//       ) {

//         return null;

//       }


//       return (
//         product.variants ||
//         []
//       ).find(
//         variant =>
//           variant.is_active &&
//           variant.color_name ===
//             selectedColor &&
//           variant.size ===
//             selectedSize
//       ) || null;

//     }, [
//       product,
//       selectedColor,
//       selectedSize
//     ]);


//   /*
//   |--------------------------------------------------------------------------
//   | Currency
//   |--------------------------------------------------------------------------
//   */

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


//   /*
//   |--------------------------------------------------------------------------
//   | Add to Cart
//   |--------------------------------------------------------------------------
//   */

//   async function handleAddToCart() {

//     if (!selectedVariant) {

//       return;

//     }


//     /*
//     |--------------------------------------------------------------------------
//     | Customer must login first
//     |--------------------------------------------------------------------------
//     */

//     if (!user) {

//       navigate(
//         "/login",
//         {
//           state: {
//             from:
//               `${location.pathname}${location.search}`
//           }
//         }
//       );

//       return;

//     }


//     try {

//       setAddingToCart(true);

//       setCartMessage("");

//       setCartError("");


//       await addToCart(
//         selectedVariant.id,
//         1
//       );


//       setCartMessage(
//         "Item added to your cart."
//       );


//       setTimeout(
//         () => {

//           setCartMessage("");

//         },
//         2500
//       );


//     } catch (error) {

//       console.error(
//         "ADD TO CART ERROR:",
//         error
//       );


//       setCartError(
//         error.message ||
//         "Unable to add item to cart."
//       );


//     } finally {

//       setAddingToCart(false);

//     }

//   }


//   /*
//   |--------------------------------------------------------------------------
//   | Loading
//   |--------------------------------------------------------------------------
//   */

//   if (loading) {

//     return (

//       <section
//         className="store-section"
//       >
//         Loading product...
//       </section>

//     );

//   }


//   /*
//   |--------------------------------------------------------------------------
//   | Error
//   |--------------------------------------------------------------------------
//   */

//   if (
//     error ||
//     !product
//   ) {

//     return (

//       <section
//         className="store-section"
//       >

//         <div
//           className="store-error"
//         >

//           {
//             error ||
//             "Product not found."
//           }

//         </div>

//       </section>

//     );

//   }


//   return (

//     <section
//       className="store-section"
//     >

//       <div
//         className="product-details-layout"
//       >

//         {/* =====================================================
//             PRODUCT GALLERY
//         ====================================================== */}

//         <div
//           className="product-gallery"
//         >

//           <div
//             className="main-product-image"
//           >

//             {
//               selectedImage
//                 ? (

//                   <img
//                     src={
//                       selectedImage
//                     }
//                     alt={
//                       product.name
//                     }
//                   />

//                 )
//                 : (

//                   <div
//                     className="product-placeholder"
//                   >
//                     No image
//                   </div>

//                 )
//             }

//           </div>


//           {
//             images.length > 1 && (

//               <div
//                 className="product-thumbnails"
//               >

//                 {
//                   images.map(
//                     image => (

//                       <button
//                         type="button"
//                         key={
//                           image.id
//                         }
//                         className={
//                           selectedImage ===
//                           image.public_url
//                             ? "thumbnail active"
//                             : "thumbnail"
//                         }
//                         onClick={() =>
//                           setSelectedImage(
//                             image.public_url
//                           )
//                         }
//                       >

//                         <img
//                           src={
//                             image.public_url
//                           }
//                           alt={
//                             image.alt_text ||
//                             product.name
//                           }
//                         />

//                       </button>

//                     )
//                   )
//                 }

//               </div>

//             )
//           }

//         </div>


//         {/* =====================================================
//             PRODUCT INFORMATION
//         ====================================================== */}

//         <div
//           className="product-detail-info"
//         >

//           <span
//             className="product-category"
//           >

//             {
//               product.category
//                 ?.name ||
//               "Clothing"
//             }

//           </span>


//           <h1>
//             {product.name}
//           </h1>


//           <div
//             className="product-detail-price"
//           >

//             {
//               formatPrice(
//                 product.price
//               )
//             }

//           </div>


//           {
//             product.description && (

//               <p
//                 className="product-description"
//               >

//                 {
//                   product.description
//                 }

//               </p>

//             )
//           }


//           {/* =====================================================
//               COLOR
//           ====================================================== */}

//           <div
//             className="product-option"
//           >

//             <label>
//               Color
//             </label>


//             <div
//               className="color-options"
//             >

//               {
//                 colors.map(
//                   color => (

//                     <button
//                       type="button"
//                       key={
//                         color.name
//                       }
//                       className={
//                         selectedColor ===
//                         color.name
//                           ? "color-option selected"
//                           : "color-option"
//                       }
//                       onClick={() => {

//                         setSelectedColor(
//                           color.name
//                         );

//                         setSelectedSize("");

//                         setCartMessage("");

//                         setCartError("");

//                       }}
//                     >

//                       <span
//                         style={{
//                           background:
//                             color.hex ||
//                             "#dddddd"
//                         }}
//                       />

//                       {
//                         color.name
//                       }

//                     </button>

//                   )
//                 )
//               }

//             </div>

//           </div>


//           {/* =====================================================
//               SIZE
//           ====================================================== */}

//           <div
//             className="product-option"
//           >

//             <label>
//               Size
//             </label>


//             <div
//               className="size-options"
//             >

//               {
//                 sizes.map(
//                   variant => {

//                     const outOfStock =
//                       Number(
//                         variant.quantity
//                       ) <= 0;


//                     return (

//                       <button
//                         type="button"
//                         key={
//                           variant.id
//                         }
//                         disabled={
//                           outOfStock
//                         }
//                         className={
//                           selectedSize ===
//                           variant.size
//                             ? "size-option selected"
//                             : "size-option"
//                         }
//                         onClick={() => {

//                           setSelectedSize(
//                             variant.size
//                           );

//                           setCartMessage("");

//                           setCartError("");

//                         }}
//                       >

//                         {
//                           variant.size
//                         }

//                       </button>

//                     );

//                   }
//                 )
//               }

//             </div>

//           </div>


//           {/* =====================================================
//               STOCK INFORMATION
//           ====================================================== */}

//           {
//             selectedVariant && (

//               <div
//                 className="stock-message"
//               >

//                 {
//                   Number(
//                     selectedVariant.quantity
//                   ) > 5
//                     ? `${selectedVariant.quantity} available`
//                     : Number(
//                         selectedVariant.quantity
//                       ) > 0
//                       ? `Only ${selectedVariant.quantity} left in stock`
//                       : "Out of stock"
//                 }

//               </div>

//             )
//           }


//           {/* =====================================================
//               CART MESSAGES
//           ====================================================== */}

//           {
//             cartMessage && (

//               <div
//                 className="cart-success-message"
//               >
//                 {cartMessage}
//               </div>

//             )
//           }


//           {
//             cartError && (

//               <div
//                 className="store-error"
//               >
//                 {cartError}
//               </div>

//             )
//           }


//           {/* =====================================================
//               ADD TO CART
//           ====================================================== */}

//           <button
//             type="button"
//             className="add-cart-button"
//             disabled={
//               !selectedVariant ||
//               Number(
//                 selectedVariant.quantity
//               ) <= 0 ||
//               addingToCart
//             }
//             onClick={
//               handleAddToCart
//             }
//           >

//             {
//               addingToCart
//                 ? "Adding..."
//                 : !selectedVariant
//                   ? "Select a Size"
//                   : Number(
//                       selectedVariant.quantity
//                     ) <= 0
//                     ? "Out of Stock"
//                     : user
//                       ? "Add to Cart"
//                       : "Login to Add to Cart"
//             }

//           </button>

//         </div>

//       </div>

//     </section>

//   );

// }


// export default ProductDetails;






import {
  useEffect,
  useMemo,
  useState
} from "react";

import {
  useLocation,
  useNavigate,
  useParams
} from "react-router-dom";

import api from "../services/api";

import {
  useAuth
} from "../context/AuthContext";

import {
  useCart
} from "../context/CartContext";


function ProductDetails() {

  const {
    id
  } = useParams();


  const {
    user
  } = useAuth();


  const {
    addToCart
  } = useCart();


  const navigate =
    useNavigate();


  const location =
    useLocation();


  const [
    product,
    setProduct
  ] = useState(null);


  const [
    loading,
    setLoading
  ] = useState(true);


  const [
    error,
    setError
  ] = useState("");


  const [
    selectedColor,
    setSelectedColor
  ] = useState("");


  const [
    selectedSize,
    setSelectedSize
  ] = useState("");


  const [
    selectedImage,
    setSelectedImage
  ] = useState("");


  /*
  |--------------------------------------------------------------------------
  | Quantity
  |--------------------------------------------------------------------------
  */

  const [
    quantity,
    setQuantity
  ] = useState(1);


  const [
    addingToCart,
    setAddingToCart
  ] = useState(false);


  const [
    cartMessage,
    setCartMessage
  ] = useState("");


  const [
    cartError,
    setCartError
  ] = useState("");


  /*
  |--------------------------------------------------------------------------
  | Load Product
  |--------------------------------------------------------------------------
  */

  useEffect(() => {

    async function loadProduct() {

      try {

        setLoading(true);

        setError("");


        const response =
          await api.get(
            `/products/${id}`
          );


        const data =
          response.data.product;


        setProduct(data);


        /*
        |--------------------------------------------------------------------------
        | Default Image
        |--------------------------------------------------------------------------
        */

        const productImages =
          [
            ...(data.images || [])
          ].sort(
            (a, b) =>
              Number(
                a.display_order
              ) -
              Number(
                b.display_order
              )
          );


        if (
          productImages.length >
          0
        ) {

          setSelectedImage(
            productImages[0]
              .public_url
          );

        }


        /*
        |--------------------------------------------------------------------------
        | Active Variants
        |--------------------------------------------------------------------------
        */

        const activeVariants =
          (
            data.variants ||
            []
          ).filter(
            variant =>
              variant.is_active
          );


        /*
        |--------------------------------------------------------------------------
        | Default Color
        |--------------------------------------------------------------------------
        */

        if (
          activeVariants.length >
          0
        ) {

          setSelectedColor(
            activeVariants[0]
              .color_name
          );

        }


      } catch (error) {

        console.error(
          "LOAD PRODUCT ERROR:",
          error
        );


        setError(
          error.response
            ?.data
            ?.message ||
          "Unable to load product."
        );


      } finally {

        setLoading(false);

      }

    }


    loadProduct();

  }, [id]);


  /*
  |--------------------------------------------------------------------------
  | Product Images
  |--------------------------------------------------------------------------
  */

  const images =
    useMemo(() => {

      if (!product) {

        return [];

      }


      return [
        ...(product.images || [])
      ].sort(
        (a, b) =>
          Number(
            a.display_order
          ) -
          Number(
            b.display_order
          )
      );

    }, [product]);


  /*
  |--------------------------------------------------------------------------
  | Available Colors
  |--------------------------------------------------------------------------
  */

  const colors =
    useMemo(() => {

      if (!product) {

        return [];

      }


      const colorMap =
        new Map();


      for (
        const variant of
        product.variants || []
      ) {

        if (
          !variant.is_active
        ) {

          continue;

        }


        if (
          !colorMap.has(
            variant.color_name
          )
        ) {

          colorMap.set(
            variant.color_name,
            {

              name:
                variant.color_name,

              hex:
                variant.color_hex

            }
          );

        }

      }


      return Array.from(
        colorMap.values()
      );

    }, [product]);


  /*
  |--------------------------------------------------------------------------
  | Available Sizes for Selected Color
  |--------------------------------------------------------------------------
  */

  const sizes =
    useMemo(() => {

      if (
        !product ||
        !selectedColor
      ) {

        return [];

      }


      return (
        product.variants ||
        []
      ).filter(
        variant =>
          variant.is_active &&
          variant.color_name ===
            selectedColor
      );

    }, [
      product,
      selectedColor
    ]);


  /*
  |--------------------------------------------------------------------------
  | Selected Variant
  |--------------------------------------------------------------------------
  */

  const selectedVariant =
    useMemo(() => {

      if (
        !product ||
        !selectedColor ||
        !selectedSize
      ) {

        return null;

      }


      return (
        product.variants ||
        []
      ).find(
        variant =>
          variant.is_active &&
          variant.color_name ===
            selectedColor &&
          variant.size ===
            selectedSize
      ) || null;

    }, [
      product,
      selectedColor,
      selectedSize
    ]);


  /*
  |--------------------------------------------------------------------------
  | Maximum Quantity
  |--------------------------------------------------------------------------
  |
  | Backend allows maximum 20 items per variant.
  |
  */

  const maxQuantity =
    selectedVariant
      ? Math.min(
          Number(
            selectedVariant.quantity
          ),
          20
        )
      : 1;


  /*
  |--------------------------------------------------------------------------
  | Reset / Clamp Quantity when variant changes
  |--------------------------------------------------------------------------
  */

  useEffect(() => {

    if (!selectedVariant) {

      setQuantity(1);

      return;

    }


    const stock =
      Number(
        selectedVariant.quantity
      );


    if (
      stock <= 0
    ) {

      setQuantity(1);

      return;

    }


    setQuantity(
      current =>
        Math.max(
          1,
          Math.min(
            current,
            stock,
            20
          )
        )
    );

  }, [selectedVariant]);


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
  | Increase Quantity
  |--------------------------------------------------------------------------
  */

  function increaseQuantity() {

    if (!selectedVariant) {

      return;

    }


    setQuantity(
      current =>
        Math.min(
          current + 1,
          maxQuantity
        )
    );


    setCartMessage("");

    setCartError("");

  }


  /*
  |--------------------------------------------------------------------------
  | Decrease Quantity
  |--------------------------------------------------------------------------
  */

  function decreaseQuantity() {

    setQuantity(
      current =>
        Math.max(
          1,
          current - 1
        )
    );


    setCartMessage("");

    setCartError("");

  }


  /*
  |--------------------------------------------------------------------------
  | Quantity Input
  |--------------------------------------------------------------------------
  */

  function handleQuantityInput(
    event
  ) {

    if (!selectedVariant) {

      return;

    }


    const value =
      Number(
        event.target.value
      );


    if (
      !Number.isFinite(value)
    ) {

      return;

    }


    const safeQuantity =
      Math.max(
        1,
        Math.min(
          Math.floor(value),
          maxQuantity
        )
      );


    setQuantity(
      safeQuantity
    );


    setCartMessage("");

    setCartError("");

  }


  /*
  |--------------------------------------------------------------------------
  | Add to Cart
  |--------------------------------------------------------------------------
  */

  async function handleAddToCart() {

    if (!selectedVariant) {

      return;

    }


    /*
    |--------------------------------------------------------------------------
    | Customer must login
    |--------------------------------------------------------------------------
    */

    if (!user) {

      navigate(
        "/login",
        {
          state: {
            from:
              `${location.pathname}${location.search}`
          }
        }
      );

      return;

    }


    /*
    |--------------------------------------------------------------------------
    | Final Quantity Validation
    |--------------------------------------------------------------------------
    */

    const availableStock =
      Number(
        selectedVariant.quantity
      );


    if (
      quantity < 1 ||
      quantity >
        availableStock
    ) {

      setCartError(
        "Please select a valid quantity."
      );

      return;

    }


    try {

      setAddingToCart(true);

      setCartMessage("");

      setCartError("");


      /*
      |--------------------------------------------------------------------------
      | Send selected quantity
      |--------------------------------------------------------------------------
      */

      await addToCart(
        selectedVariant.id,
        quantity
      );


      setCartMessage(
        `${quantity} ${
          quantity === 1
            ? "item"
            : "items"
        } added to your cart.`
      );


      /*
      |--------------------------------------------------------------------------
      | Reset Quantity
      |--------------------------------------------------------------------------
      */

      setQuantity(1);


      setTimeout(
        () => {

          setCartMessage("");

        },
        2500
      );


    } catch (error) {

      console.error(
        "ADD TO CART ERROR:",
        error
      );


      setCartError(
        error.message ||
        "Unable to add item to cart."
      );


    } finally {

      setAddingToCart(false);

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
        Loading product...
      </section>

    );

  }


  /*
  |--------------------------------------------------------------------------
  | Error
  |--------------------------------------------------------------------------
  */

  if (
    error ||
    !product
  ) {

    return (

      <section
        className="store-section"
      >

        <div
          className="store-error"
        >

          {
            error ||
            "Product not found."
          }

        </div>

      </section>

    );

  }


  return (

    <section
      className="store-section"
    >

      <div
        className="product-details-layout"
      >

        {/* =====================================================
            PRODUCT GALLERY
        ====================================================== */}

        <div
          className="product-gallery"
        >

          <div
            className="main-product-image"
          >

            {
              selectedImage
                ? (

                  <img
                    src={
                      selectedImage
                    }
                    alt={
                      product.name
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


          {
            images.length > 1 && (

              <div
                className="product-thumbnails"
              >

                {
                  images.map(
                    image => (

                      <button
                        type="button"
                        key={
                          image.id
                        }
                        className={
                          selectedImage ===
                          image.public_url
                            ? "thumbnail active"
                            : "thumbnail"
                        }
                        onClick={() =>
                          setSelectedImage(
                            image.public_url
                          )
                        }
                      >

                        <img
                          src={
                            image.public_url
                          }
                          alt={
                            image.alt_text ||
                            product.name
                          }
                        />

                      </button>

                    )
                  )
                }

              </div>

            )
          }

        </div>


        {/* =====================================================
            PRODUCT INFORMATION
        ====================================================== */}

        <div
          className="product-detail-info"
        >

          <span
            className="product-category"
          >

            {
              product.category
                ?.name ||
              "Clothing"
            }

          </span>


          <h1>
            {product.name}
          </h1>


          <div
            className="product-detail-price"
          >

            {
              formatPrice(
                product.price
              )
            }

          </div>


          {
            product.description && (

              <p
                className="product-description"
              >
                {
                  product.description
                }
              </p>

            )
          }


          {/* =====================================================
              COLOR
          ====================================================== */}

          <div
            className="product-option"
          >

            <label>
              Color
            </label>


            <div
              className="color-options"
            >

              {
                colors.map(
                  color => (

                    <button
                      type="button"
                      key={
                        color.name
                      }
                      className={
                        selectedColor ===
                        color.name
                          ? "color-option selected"
                          : "color-option"
                      }
                      onClick={() => {

                        setSelectedColor(
                          color.name
                        );

                        setSelectedSize("");

                        setQuantity(1);

                        setCartMessage("");

                        setCartError("");

                      }}
                    >

                      <span
                        style={{
                          background:
                            color.hex ||
                            "#dddddd"
                        }}
                      />

                      {
                        color.name
                      }

                    </button>

                  )
                )
              }

            </div>

          </div>


          {/* =====================================================
              SIZE
          ====================================================== */}

          <div
            className="product-option"
          >

            <label>
              Size
            </label>


            <div
              className="size-options"
            >

              {
                sizes.map(
                  variant => {

                    const outOfStock =
                      Number(
                        variant.quantity
                      ) <= 0;


                    return (

                      <button
                        type="button"
                        key={
                          variant.id
                        }
                        disabled={
                          outOfStock
                        }
                        className={
                          selectedSize ===
                          variant.size
                            ? "size-option selected"
                            : "size-option"
                        }
                        onClick={() => {

                          setSelectedSize(
                            variant.size
                          );

                          setQuantity(1);

                          setCartMessage("");

                          setCartError("");

                        }}
                      >

                        {
                          variant.size
                        }

                      </button>

                    );

                  }
                )
              }

            </div>

          </div>


          {/* =====================================================
              STOCK INFORMATION
          ====================================================== */}

          {
            selectedVariant && (

              <div
                className="stock-message"
              >

                {
                  Number(
                    selectedVariant.quantity
                  ) > 5
                    ? `${selectedVariant.quantity} available`
                    : Number(
                        selectedVariant.quantity
                      ) > 0
                      ? `Only ${selectedVariant.quantity} left in stock`
                      : "Out of stock"
                }

              </div>

            )
          }


          {/* =====================================================
              QUANTITY
          ====================================================== */}

          {
            selectedVariant &&
            Number(
              selectedVariant.quantity
            ) > 0 && (

              <div
                className="product-quantity-section"
              >

                <label
                  className="product-quantity-label"
                >
                  Quantity
                </label>


                <div
                  className="product-quantity-row"
                >

                  <div
                    className="quantity-selector"
                  >

                    {/* DECREASE */}

                    <button
                      type="button"
                      className="quantity-button"
                      onClick={
                        decreaseQuantity
                      }
                      disabled={
                        quantity <= 1
                      }
                      aria-label="Decrease quantity"
                    >
                      −
                    </button>


                    {/* INPUT */}

                    <input
                      type="number"
                      className="quantity-input"
                      min="1"
                      max={
                        maxQuantity
                      }
                      value={
                        quantity
                      }
                      onChange={
                        handleQuantityInput
                      }
                      aria-label="Product quantity"
                    />


                    {/* INCREASE */}

                    <button
                      type="button"
                      className="quantity-button"
                      onClick={
                        increaseQuantity
                      }
                      disabled={
                        quantity >=
                        maxQuantity
                      }
                      aria-label="Increase quantity"
                    >
                      +
                    </button>

                  </div>


                  <span
                    className="quantity-limit"
                  >
                    Max {maxQuantity}
                  </span>

                </div>

              </div>

            )
          }


          {/* =====================================================
              SELECTED TOTAL
          ====================================================== */}

          {
            selectedVariant &&
            Number(
              selectedVariant.quantity
            ) > 0 && (

              <div
                className="selected-product-total"
              >

                <span>
                  Total
                </span>


                <strong>
                  {
                    formatPrice(
                      Number(
                        product.price
                      ) *
                      quantity
                    )
                  }
                </strong>

              </div>

            )
          }


          {/* =====================================================
              CART MESSAGES
          ====================================================== */}

          {
            cartMessage && (

              <div
                className="cart-success-message"
              >
                {cartMessage}
              </div>

            )
          }


          {
            cartError && (

              <div
                className="store-error"
              >
                {cartError}
              </div>

            )
          }


          {/* =====================================================
              ADD TO CART
          ====================================================== */}

          <button
            type="button"
            className="add-cart-button"
            disabled={
              !selectedVariant ||
              Number(
                selectedVariant.quantity
              ) <= 0 ||
              addingToCart
            }
            onClick={
              handleAddToCart
            }
          >

            {
              addingToCart
                ? "Adding..."
                : !selectedVariant
                  ? "Select a Size"
                  : Number(
                      selectedVariant.quantity
                    ) <= 0
                    ? "Out of Stock"
                    : user
                      ? (
                        quantity === 1
                          ? "Add to Cart"
                          : `Add ${quantity} to Cart`
                      )
                      : "Login to Add to Cart"
            }

          </button>

        </div>

      </div>

    </section>

  );

}


export default ProductDetails;