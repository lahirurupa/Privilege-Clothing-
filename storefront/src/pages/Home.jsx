// import {
//   useEffect,
//   useState
// } from "react";

// import {
//   Link
// } from "react-router-dom";

// import api from "../services/api";

// import ProductCard
//   from "../components/ProductCard";


// function Home() {

//   const [
//     products,
//     setProducts
//   ] = useState([]);


//   useEffect(() => {

//     async function loadProducts() {

//       try {

//         const response =
//           await api.get(
//             "/products?limit=4"
//           );


//         setProducts(
//           response.data.products ||
//           []
//         );

//       } catch (error) {

//         console.error(error);

//       }

//     }


//     loadProducts();

//   }, []);


//   return (

//     <>

//       {/* HERO */}

//       <section
//         className="hero-section"
//       >

//         <div
//           className="hero-content"
//         >

//           <span>
//             PRIVILEGE CLOTHING
//           </span>


//           <h1>
//             Wear Your
//             <br />
//             Privilege.
//           </h1>


//           <p>
//             Modern essentials built around comfort, confidence and clean design.
//           </p>


//           <Link
//             to="/shop"
//             className="hero-button"
//           >
//             Shop Collection
//           </Link>

//         </div>

//       </section>


//       {/* FEATURED */}

//       <section
//         className="store-section"
//       >

//         <div
//           className="section-title-row"
//         >

//           <div>

//             <span
//               className="store-eyebrow"
//             >
//               COLLECTION
//             </span>

//             <h2>
//               Latest Products
//             </h2>

//           </div>


//           <Link
//             to="/shop"
//           >
//             View All
//           </Link>

//         </div>


//         <div
//           className="store-product-grid"
//         >

//           {
//             products.map(
//               product => (

//                 <ProductCard
//                   key={
//                     product.id
//                   }
//                   product={
//                     product
//                   }
//                 />

//               )
//             )
//           }

//         </div>

//       </section>

//     </>

//   );

// }


// export default Home;








import {
  useCallback,
  useEffect,
  useState
} from "react";

import {
  Link
} from "react-router-dom";

import api from "../services/api";

import ProductCard
  from "../components/ProductCard";


function Home() {

  const [
    products,
    setProducts
  ] = useState([]);


  const [
    loading,
    setLoading
  ] = useState(true);


  const [
    error,
    setError
  ] = useState("");


  /*
  |--------------------------------------------------------------------------
  | Load Latest Products
  |--------------------------------------------------------------------------
  */

  const loadProducts =
    useCallback(
      async (
        showLoading = true
      ) => {

        try {

          if (showLoading) {

            setLoading(true);

          }


          setError("");


          /*
          |--------------------------------------------------------------------------
          | Cache-busting timestamp
          |--------------------------------------------------------------------------
          |
          | This helps make sure we request current product data.
          |
          */

          const response =
            await api.get(
              "/products",
              {
                params: {

                  limit: 4,

                  _t:
                    Date.now()

                }
              }
            );


          setProducts(
            response.data.products ||
            []
          );


        } catch (error) {

          console.error(
            "LOAD HOME PRODUCTS ERROR:",
            error
          );


          setError(
            error.response
              ?.data
              ?.message ||
            "Unable to load latest products."
          );


        } finally {

          if (showLoading) {

            setLoading(false);

          }

        }

      },
      []
    );


  /*
  |--------------------------------------------------------------------------
  | Initial Load
  |--------------------------------------------------------------------------
  */

  useEffect(() => {

    loadProducts();

  }, [
    loadProducts
  ]);


  /*
  |--------------------------------------------------------------------------
  | Refresh when customer returns to storefront
  |--------------------------------------------------------------------------
  |
  | Example:
  |
  | Admin tab
  | → Create product
  | → Return to storefront tab
  | → Products refresh automatically
  |
  */

  useEffect(() => {

    function handleFocus() {

      loadProducts(
        false
      );

    }


    function handleVisibilityChange() {

      if (
        document.visibilityState ===
        "visible"
      ) {

        loadProducts(
          false
        );

      }

    }


    window.addEventListener(
      "focus",
      handleFocus
    );


    document.addEventListener(
      "visibilitychange",
      handleVisibilityChange
    );


    return () => {

      window.removeEventListener(
        "focus",
        handleFocus
      );


      document.removeEventListener(
        "visibilitychange",
        handleVisibilityChange
      );

    };

  }, [
    loadProducts
  ]);


  return (

    <>

      {/* =====================================================
          HERO
      ====================================================== */}

      <section
        className="hero-section"
      >

        <div
          className="hero-content"
        >

          <span>
            PRIVILEGE CLOTHING
          </span>


          <h1>
            Wear Your
            <br />
            Privilege.
          </h1>


          <p>
            Modern essentials built around comfort, confidence and clean design.
          </p>


          <Link
            to="/shop"
            className="hero-button"
          >
            Shop Collection
          </Link>

        </div>

      </section>


      {/* =====================================================
          LATEST PRODUCTS
      ====================================================== */}

      <section
        className="store-section"
      >

        <div
          className="section-title-row"
        >

          <div>

            <span
              className="store-eyebrow"
            >
              COLLECTION
            </span>


            <h2>
              Latest Products
            </h2>

          </div>


          <Link
            to="/shop"
          >
            View All
          </Link>

        </div>


        {/* ERROR */}

        {
          error && (

            <div
              className="store-error"
            >
              {error}
            </div>

          )
        }


        {/* LOADING */}

        {
          loading
            ? (

              <div
                className="store-product-loading"
              >
                Loading latest products...
              </div>

            )
            : products.length ===
              0
              ? (

                <div
                  className="store-empty"
                >

                  No products are currently available.

                </div>

              )
              : (

                <div
                  className="store-product-grid"
                >

                  {
                    products.map(
                      product => (

                        <ProductCard
                          key={
                            product.id
                          }
                          product={
                            product
                          }
                        />

                      )
                    )
                  }

                </div>

              )
        }

      </section>

    </>

  );

}


export default Home;