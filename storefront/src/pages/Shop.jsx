// import {
//   useEffect,
//   useMemo,
//   useState
// } from "react";

// import api from "../services/api";

// import ProductCard
//   from "../components/ProductCard";


// function Shop() {

//   const [
//     products,
//     setProducts
//   ] = useState([]);


//   const [
//     categories,
//     setCategories
//   ] = useState([]);


//   const [
//     search,
//     setSearch
//   ] = useState("");


//   const [
//     categoryId,
//     setCategoryId
//   ] = useState("");


//   const [
//     loading,
//     setLoading
//   ] = useState(true);


//   useEffect(() => {

//     async function loadData() {

//       try {

//         setLoading(true);


//         const [
//           productResponse,
//           categoryResponse
//         ] =
//           await Promise.all([

//             api.get(
//               "/products?limit=50"
//             ),

//             api.get(
//               "/categories"
//             )

//           ]);


//         setProducts(
//           productResponse
//             .data
//             .products ||
//           []
//         );


//         setCategories(
//           categoryResponse
//             .data
//             .categories ||
//           []
//         );


//       } catch (error) {

//         console.error(error);

//       } finally {

//         setLoading(false);

//       }

//     }


//     loadData();

//   }, []);


//   const filteredProducts =
//     useMemo(() => {

//       const query =
//         search
//           .trim()
//           .toLowerCase();


//       return products.filter(
//         product => {

//           const matchesSearch =
//             !query ||
//             product.name
//               ?.toLowerCase()
//               .includes(query);


//           const matchesCategory =
//             !categoryId ||
//             product.category?.id ===
//               categoryId;


//           return (
//             matchesSearch &&
//             matchesCategory
//           );

//         }
//       );

//     }, [
//       products,
//       search,
//       categoryId
//     ]);


//   return (

//     <section
//       className="store-section shop-page"
//     >

//       <div
//         className="shop-header"
//       >

//         <span
//           className="store-eyebrow"
//         >
//           PRIVILEGE COLLECTION
//         </span>

//         <h1>
//           Shop
//         </h1>

//         <p>
//           Explore our latest clothing collection.
//         </p>

//       </div>


//       <div
//         className="shop-toolbar"
//       >

//         <input
//           placeholder="Search products..."
//           value={search}
//           onChange={
//             event =>
//               setSearch(
//                 event.target.value
//               )
//           }
//         />


//         <select
//           value={
//             categoryId
//           }
//           onChange={
//             event =>
//               setCategoryId(
//                 event.target.value
//               )
//           }
//         >

//           <option value="">
//             All Categories
//           </option>


//           {
//             categories.map(
//               category => (

//                 <option
//                   key={
//                     category.id
//                   }
//                   value={
//                     category.id
//                   }
//                 >
//                   {category.name}
//                 </option>

//               )
//             )
//           }

//         </select>

//       </div>


//       {
//         loading
//           ? (

//             <div>
//               Loading products...
//             </div>

//           )
//           : filteredProducts.length ===
//             0
//             ? (

//               <div
//                 className="store-empty"
//               >
//                 No products found.
//               </div>

//             )
//             : (

//               <div
//                 className="store-product-grid"
//               >

//                 {
//                   filteredProducts.map(
//                     product => (

//                       <ProductCard
//                         key={
//                           product.id
//                         }
//                         product={
//                           product
//                         }
//                       />

//                     )
//                   )
//                 }

//               </div>

//             )
//       }

//     </section>

//   );

// }


// export default Shop;




import {
  useCallback,
  useEffect,
  useMemo,
  useState
} from "react";

import api from "../services/api";

import ProductCard
  from "../components/ProductCard";


function Shop() {

  const [
    products,
    setProducts
  ] = useState([]);


  const [
    categories,
    setCategories
  ] = useState([]);


  const [
    search,
    setSearch
  ] = useState("");


  const [
    categoryId,
    setCategoryId
  ] = useState("");


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
  | Load Store Data
  |--------------------------------------------------------------------------
  */

  const loadData =
    useCallback(
      async (
        showLoading = true
      ) => {

        try {

          if (showLoading) {

            setLoading(true);

          }


          setError("");


          const timestamp =
            Date.now();


          const [
            productResponse,
            categoryResponse
          ] =
            await Promise.all([

              api.get(
                "/products",
                {
                  params: {

                    limit: 50,

                    _t:
                      timestamp

                  }
                }
              ),

              api.get(
                "/categories",
                {
                  params: {

                    _t:
                      timestamp

                  }
                }
              )

            ]);


          setProducts(
            productResponse
              .data
              .products ||
            []
          );


          setCategories(
            categoryResponse
              .data
              .categories ||
            []
          );


        } catch (error) {

          console.error(
            "LOAD SHOP ERROR:",
            error
          );


          setError(
            error.response
              ?.data
              ?.message ||
            "Unable to load shop."
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

    loadData();

  }, [
    loadData
  ]);


  /*
  |--------------------------------------------------------------------------
  | Refresh when returning to Storefront
  |--------------------------------------------------------------------------
  */

  useEffect(() => {

    function handleFocus() {

      loadData(
        false
      );

    }


    function handleVisibilityChange() {

      if (
        document.visibilityState ===
        "visible"
      ) {

        loadData(
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
    loadData
  ]);


  /*
  |--------------------------------------------------------------------------
  | Client Filtering
  |--------------------------------------------------------------------------
  */

  const filteredProducts =
    useMemo(() => {

      const query =
        search
          .trim()
          .toLowerCase();


      return products.filter(
        product => {

          const matchesSearch =
            !query ||

            product.name
              ?.toLowerCase()
              .includes(query);


          const matchesCategory =
            !categoryId ||

            product.category
              ?.id ===
            categoryId;


          return (
            matchesSearch &&
            matchesCategory
          );

        }
      );

    }, [
      products,
      search,
      categoryId
    ]);


  return (

    <section
      className="store-section shop-page"
    >

      {/* HEADER */}

      <div
        className="shop-header"
      >

        <span
          className="store-eyebrow"
        >
          PRIVILEGE COLLECTION
        </span>


        <h1>
          Shop
        </h1>


        <p>
          Explore our latest clothing collection.
        </p>

      </div>


      {/* FILTERS */}

      <div
        className="shop-toolbar"
      >

        <input
          type="text"
          placeholder="Search products..."
          value={
            search
          }
          onChange={
            event =>
              setSearch(
                event.target.value
              )
          }
        />


        <select
          value={
            categoryId
          }
          onChange={
            event =>
              setCategoryId(
                event.target.value
              )
          }
        >

          <option value="">
            All Categories
          </option>


          {
            categories.map(
              category => (

                <option
                  key={
                    category.id
                  }
                  value={
                    category.id
                  }
                >
                  {
                    category.name
                  }
                </option>

              )
            )
          }

        </select>

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


      {/* PRODUCTS */}

      {
        loading
          ? (

            <div
              className="store-product-loading"
            >
              Loading products...
            </div>

          )
          : filteredProducts.length ===
            0
            ? (

              <div
                className="store-empty"
              >
                No products found.
              </div>

            )
            : (

              <div
                className="store-product-grid"
              >

                {
                  filteredProducts.map(
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

  );

}


export default Shop;