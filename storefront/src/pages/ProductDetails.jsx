// import {
//   useEffect,
//   useMemo,
//   useState
// } from "react";

// import {
//   useParams
// } from "react-router-dom";

// import {
//   useCart
// } from "../context/CartContext";

// import api from "../services/api";

// import {
//   useLocation,
//   useNavigate
// } from "react-router-dom";

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


//   const [
//     product,
//     setProduct
//   ] = useState(null);


//   const [
//     loading,
//     setLoading
//   ] = useState(true);


//   const [
//     selectedColor,
//     setSelectedColor
//   ] = useState("");


//   const [
//     selectedSize,
//     setSelectedSize
//   ] = useState("");

//   const {
//     user
//   } = useAuth();

//   const {
//     addToCart
//   } = useCart();


//   const navigate =
//   useNavigate();


// const location =
//   useLocation();


// const [
//   addingToCart,
//   setAddingToCart
// ] = useState(false);


// const [
//   cartMessage,
//   setCartMessage
// ] = useState("");

//   const [
//     addedMessage,
//     setAddedMessage
//   ] = useState("");


//   const [
//     selectedImage,
//     setSelectedImage
//   ] = useState("");


//   useEffect(() => {

//     async function loadProduct() {

//       try {

//         const response =
//           await api.get(
//             `/products/${id}`
//           );


//         const data =
//           response.data.product;


//         setProduct(data);


//         const images =
//           [
//             ...(data.images || [])
//           ].sort(
//             (a, b) =>
//               a.display_order -
//               b.display_order
//           );


//         if (
//           images.length
//         ) {

//           setSelectedImage(
//             images[0].public_url
//           );

//         }


//         if (
//           data.variants?.length
//         ) {

//           setSelectedColor(
//             data.variants[0]
//               .color_name
//           );

//         }


//       } catch (error) {

//         console.error(error);

//       } finally {

//         setLoading(false);

//       }

//     }


//     loadProduct();

//   }, [id]);


//   const colors =
//     useMemo(() => {

//       if (!product) {
//         return [];
//       }


//       const map =
//         new Map();


//       for (
//         const variant of
//         product.variants || []
//       ) {

//         if (
//           !map.has(
//             variant.color_name
//           )
//         ) {

//           map.set(
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
//         map.values()
//       );

//     }, [product]);


//   const sizes =
//     useMemo(() => {

//       if (
//         !product ||
//         !selectedColor
//       ) {

//         return [];

//       }


//       return product.variants.filter(
//         variant =>
//           variant.color_name ===
//           selectedColor
//       );

//     }, [
//       product,
//       selectedColor
//     ]);


//   const selectedVariant =
//     useMemo(() => {

//       if (
//         !product ||
//         !selectedColor ||
//         !selectedSize
//       ) {

//         return null;

//       }


//       return product.variants.find(
//         variant =>
//           variant.color_name ===
//             selectedColor &&
//           variant.size ===
//             selectedSize
//       );

//     }, [
//       product,
//       selectedColor,
//       selectedSize
//     ]);


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


//   if (loading) {

//     return (
//       <div
//         className="store-section"
//       >
//         Loading product...
//       </div>
//     );

//   }


//   if (!product) {

//     return (
//       <div
//         className="store-section"
//       >
//         Product not found.
//       </div>
//     );

//   }


//   const images =
//     [
//       ...(product.images || [])
//     ].sort(
//       (a, b) =>
//         a.display_order -
//         b.display_order
//     );


//   return (

//     <section
//       className="store-section"
//     >

//       <div
//         className="product-details-layout"
//       >

//         {/* IMAGES */}

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


//           <div
//             className="product-thumbnails"
//           >

//             {
//               images.map(
//                 image => (

//                   <button
//                     key={
//                       image.id
//                     }
//                     onClick={() =>
//                       setSelectedImage(
//                         image.public_url
//                       )
//                     }
//                     className={
//                       selectedImage ===
//                       image.public_url
//                         ? "thumbnail active"
//                         : "thumbnail"
//                     }
//                   >

//                     <img
//                       src={
//                         image.public_url
//                       }
//                       alt={
//                         image.alt_text ||
//                         product.name
//                       }
//                     />

//                   </button>

//                 )
//               )
//             }

//           </div>

//         </div>


//         {/* DETAILS */}

//         <div
//           className="product-detail-info"
//         >

//           <span
//             className="product-category"
//           >
//             {
//               product.category?.name
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


//           <p
//             className="product-description"
//           >
//             {
//               product.description
//             }
//           </p>


//           {/* COLOR */}

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

//                       }}
//                     >

//                       <span
//                         style={{
//                           background:
//                             color.hex ||
//                             "#ddd"
//                         }}
//                       />

//                       {color.name}

//                     </button>

//                   )
//                 )
//               }

//             </div>

//           </div>


//           {/* SIZE */}

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
//                   variant => (

//                     <button
//                       key={
//                         variant.id
//                       }
//                       disabled={
//                         Number(
//                           variant.quantity
//                         ) === 0
//                       }
//                       className={
//                         selectedSize ===
//                         variant.size
//                           ? "size-option selected"
//                           : "size-option"
//                       }
//                       onClick={() =>
//                         setSelectedSize(
//                           variant.size
//                         )
//                       }
//                     >

//                       {
//                         variant.size
//                       }

//                     </button>

//                   )
//                 )
//               }

//             </div>

//           </div>


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
//                       ? `Only ${selectedVariant.quantity} left`
//                       : "Out of stock"
//                 }

//               </div>

//             )
//           }

//           {
//             addedMessage && (
//                 <div className="cart-success-message">
//                     {addedMessage}
//                 </div>
//             )
//           }


//           <button
//             className="add-cart-button"
//             disabled={
//               !selectedVariant ||
//               Number(
//                 selectedVariant.quantity
//               ) === 0
//             }
//             onClick={() => {

//                 if (!selectedVariant) {
//                     return;
//                 }


//                 const firstImage =
//                     images[0];


//                 addToCart({

//                     productId:
//                     product.id,

//                     variantId:
//                     selectedVariant.id,

//                     productName:
//                     product.name,

//                     price:
//                     Number(
//                         product.price
//                     ),

//                     image:
//                     firstImage?.public_url ||
//                     "",

//                     colorName:
//                     selectedVariant.color_name,

//                     colorHex:
//                     selectedVariant.color_hex,

//                     size:
//                     selectedVariant.size,

//                     sku:
//                     selectedVariant.sku,

//                     quantity:
//                     1,

//                     availableStock:
//                     Number(
//                         selectedVariant.quantity
//                     )

//                 });


//                 setAddedMessage(
//                     "Added to cart"
//                 );


//                 setTimeout(
//                     () =>
//                     setAddedMessage(""),
//                     1600
//                 );

//                 }}
//           >

//             {
//               selectedVariant
//                 ? "Add to Cart"
//                 : "Select a Size"
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

        const images =
          [
            ...(data.images || [])
          ].sort(
            (a, b) =>
              a.display_order -
              b.display_order
          );


        if (
          images.length > 0
        ) {

          setSelectedImage(
            images[0].public_url
          );

        }


        /*
        |--------------------------------------------------------------------------
        | Default Color
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
          a.display_order -
          b.display_order
      );

    }, [product]);


  /*
  |--------------------------------------------------------------------------
  | Colors
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
  | Sizes for Selected Color
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
  | Add to Cart
  |--------------------------------------------------------------------------
  */

  async function handleAddToCart() {

    if (!selectedVariant) {

      return;

    }


    /*
    |--------------------------------------------------------------------------
    | Customer must login first
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


    try {

      setAddingToCart(true);

      setCartMessage("");

      setCartError("");


      await addToCart(
        selectedVariant.id,
        1
      );


      setCartMessage(
        "Item added to your cart."
      );


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
                      ? "Add to Cart"
                      : "Login to Add to Cart"
            }

          </button>

        </div>

      </div>

    </section>

  );

}


export default ProductDetails;