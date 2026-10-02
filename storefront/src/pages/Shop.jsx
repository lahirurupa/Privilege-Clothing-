import {
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


  useEffect(() => {

    async function loadData() {

      try {

        setLoading(true);


        const [
          productResponse,
          categoryResponse
        ] =
          await Promise.all([

            api.get(
              "/products?limit=50"
            ),

            api.get(
              "/categories"
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

        console.error(error);

      } finally {

        setLoading(false);

      }

    }


    loadData();

  }, []);


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
            product.category?.id ===
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


      <div
        className="shop-toolbar"
      >

        <input
          placeholder="Search products..."
          value={search}
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
                  {category.name}
                </option>

              )
            )
          }

        </select>

      </div>


      {
        loading
          ? (

            <div>
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