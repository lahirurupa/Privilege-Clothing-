import {
  useEffect,
  useMemo,
  useState
} from "react";

import api from "../services/api";


function Products() {

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


  const [
    search,
    setSearch
  ] = useState("");


  /*
  |--------------------------------------------------------------------------
  | Load products
  |--------------------------------------------------------------------------
  */

  async function loadProducts() {

    try {

      setLoading(true);

      setError("");


      const response =
        await api.get(
          "/admin/products"
        );


      setProducts(
        response.data.products ||
        []
      );

    } catch (error) {

      console.error(error);

      setError(
        "Unable to load products."
      );

    } finally {

      setLoading(false);

    }

  }


  useEffect(() => {

    loadProducts();

  }, []);


  /*
  |--------------------------------------------------------------------------
  | Search
  |--------------------------------------------------------------------------
  */

  const filteredProducts =
    useMemo(() => {

      const query =
        search
          .trim()
          .toLowerCase();


      if (!query) {

        return products;

      }


      return products.filter(
        product => {

          return (
            product.name
              ?.toLowerCase()
              .includes(query) ||

            product.category
              ?.name
              ?.toLowerCase()
              .includes(query)
          );

        }
      );

    }, [
      products,
      search
    ]);


  /*
  |--------------------------------------------------------------------------
  | Activate / deactivate
  |--------------------------------------------------------------------------
  */

  async function toggleStatus(
    product
  ) {

    try {

      const response =
        await api.patch(
          `/admin/products/${product.id}`,
          {
            is_active:
              !product.is_active
          }
        );


      const updated =
        response.data.product;


      setProducts(
        current =>
          current.map(
            item =>
              item.id ===
              product.id
                ? updated
                : item
          )
      );

    } catch (error) {

      console.error(error);

      alert(
        error.response?.data?.message ||
        "Unable to update product."
      );

    }

  }


  /*
  |--------------------------------------------------------------------------
  | Delete
  |--------------------------------------------------------------------------
  */

  async function handleDelete(
    product
  ) {

    const confirmed =
      window.confirm(
        `Delete "${product.name}" permanently?\n\nIts variants and images will also be deleted.`
      );


    if (!confirmed) {

      return;

    }


    try {

      await api.delete(
        `/admin/products/${product.id}`
      );


      setProducts(
        current =>
          current.filter(
            item =>
              item.id !==
              product.id
          )
      );

    } catch (error) {

      console.error(error);

      alert(
        error.response?.data?.message ||
        "Unable to delete product."
      );

    }

  }


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


  if (loading) {

    return (
      <div>
        Loading products...
      </div>
    );

  }


  return (

    <div>

      <div
        className="page-heading"
      >

        <div>

          <h2>
            Products
          </h2>

          <p>
            Manage clothing products and inventory.
          </p>

        </div>


        <button
          className="primary-button"
          onClick={() => {

            alert(
              "We will build Add Product in the next step."
            );

          }}
        >
          + Add Product
        </button>

      </div>


      <div
        className="product-toolbar"
      >

        <input
          className="search-input"
          type="text"
          placeholder="Search products..."
          value={search}
          onChange={
            event =>
              setSearch(
                event.target.value
              )
          }
        />

      </div>


      {error && (

        <div
          className="error-message"
        >
          {error}
        </div>

      )}


      <div
        className="table-card"
      >

        <div
          className="table-wrapper"
        >

          <table
            className="product-table"
          >

            <thead>

              <tr>

                <th>
                  Image
                </th>

                <th>
                  Product
                </th>

                <th>
                  Category
                </th>

                <th>
                  Price
                </th>

                <th>
                  Variants
                </th>

                <th>
                  Stock
                </th>

                <th>
                  Status
                </th>

                <th>
                  Actions
                </th>

              </tr>

            </thead>


            <tbody>

              {
                filteredProducts.length ===
                0
                  ? (

                    <tr>

                      <td
                        colSpan="8"
                        className="empty-table"
                      >
                        No products found.
                      </td>

                    </tr>

                  )
                  : filteredProducts.map(
                    product => {

                      const sortedImages =
                        [
                          ...(product.images ||
                            [])
                        ].sort(
                          (a, b) =>
                            a.display_order -
                            b.display_order
                        );


                      const image =
                        sortedImages[0];


                      const variants =
                        product.variants ||
                        [];


                      const stock =
                        variants.reduce(
                          (
                            total,
                            variant
                          ) =>
                            total +
                            Number(
                              variant.quantity ||
                              0
                            ),
                          0
                        );


                      return (

                        <tr
                          key={
                            product.id
                          }
                        >

                          <td>

                            {
                              image
                                ? (

                                  <img
                                    className="product-thumbnail"
                                    src={
                                      image.public_url
                                    }
                                    alt={
                                      image.alt_text ||
                                      product.name
                                    }
                                  />

                                )
                                : (

                                  <div
                                    className="no-image"
                                  >
                                    No image
                                  </div>

                                )
                            }

                          </td>


                          <td>

                            <strong>
                              {
                                product.name
                              }
                            </strong>

                          </td>


                          <td>

                            {
                              product.category
                                ?.name ||
                              "-"
                            }

                          </td>


                          <td>

                            {
                              formatPrice(
                                product.price
                              )
                            }

                          </td>


                          <td>

                            {
                              variants.length
                            }

                          </td>


                          <td>

                            <strong>
                              {stock}
                            </strong>

                          </td>


                          <td>

                            <span
                              className={
                                product.is_active
                                  ? "status active-status"
                                  : "status inactive-status"
                              }
                            >

                              {
                                product.is_active
                                  ? "Active"
                                  : "Inactive"
                              }

                            </span>

                          </td>


                          <td>

                            <div
                              className="action-buttons"
                            >

                              <button
                                className="small-button"
                                onClick={() =>
                                  toggleStatus(
                                    product
                                  )
                                }
                              >

                                {
                                  product.is_active
                                    ? "Disable"
                                    : "Enable"
                                }

                              </button>


                              <button
                                className="small-button danger-button"
                                onClick={() =>
                                  handleDelete(
                                    product
                                  )
                                }
                              >
                                Delete
                              </button>

                            </div>

                          </td>

                        </tr>

                      );

                    }
                  )
              }

            </tbody>

          </table>

        </div>

      </div>

    </div>

  );

}


export default Products;