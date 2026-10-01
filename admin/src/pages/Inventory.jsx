import {
  useEffect,
  useMemo,
  useState
} from "react";

import api from "../services/api";


function Inventory() {

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


  const [
    stockFilter,
    setStockFilter
  ] = useState("all");


  const [
    savingId,
    setSavingId
  ] = useState(null);


  /*
  |--------------------------------------------------------------------------
  | Load
  |--------------------------------------------------------------------------
  */

  async function loadInventory() {

    try {

      setLoading(true);


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
        "Unable to load inventory."
      );

    } finally {

      setLoading(false);

    }

  }


  useEffect(() => {

    loadInventory();

  }, []);


  /*
  |--------------------------------------------------------------------------
  | Flatten
  |--------------------------------------------------------------------------
  */

  const inventoryRows =
    useMemo(() => {

      return products.flatMap(
        product => {

          return (
            product.variants ||
            []
          ).map(
            variant => ({

              ...variant,

              productId:
                product.id,

              productName:
                product.name,

              category:
                product.category
                  ?.name ||
                "-",

              productActive:
                product.is_active

            })
          );

        }
      );

    }, [products]);


  /*
  |--------------------------------------------------------------------------
  | Filter
  |--------------------------------------------------------------------------
  */

  const filteredRows =
    useMemo(() => {

      const query =
        search
          .trim()
          .toLowerCase();


      return inventoryRows.filter(
        row => {

          const matchesSearch =
            !query ||
            row.productName
              .toLowerCase()
              .includes(query) ||
            row.sku
              .toLowerCase()
              .includes(query) ||
            row.color_name
              .toLowerCase()
              .includes(query) ||
            row.size
              .toLowerCase()
              .includes(query);


          let matchesStock =
            true;


          const quantity =
            Number(
              row.quantity
            );


          if (
            stockFilter ===
            "in-stock"
          ) {

            matchesStock =
              quantity > 5;

          }


          if (
            stockFilter ===
            "low-stock"
          ) {

            matchesStock =
              quantity > 0 &&
              quantity <= 5;

          }


          if (
            stockFilter ===
            "out-of-stock"
          ) {

            matchesStock =
              quantity === 0;

          }


          return (
            matchesSearch &&
            matchesStock
          );

        }
      );

    }, [
      inventoryRows,
      search,
      stockFilter
    ]);


  /*
  |--------------------------------------------------------------------------
  | Stats
  |--------------------------------------------------------------------------
  */

  const totalQuantity =
    inventoryRows.reduce(
      (
        total,
        row
      ) =>
        total +
        Number(
          row.quantity
        ),
      0
    );


  const lowStockCount =
    inventoryRows.filter(
      row =>
        Number(
          row.quantity
        ) > 0 &&
        Number(
          row.quantity
        ) <= 5
    ).length;


  const outOfStockCount =
    inventoryRows.filter(
      row =>
        Number(
          row.quantity
        ) === 0
    ).length;


  /*
  |--------------------------------------------------------------------------
  | Update local quantity
  |--------------------------------------------------------------------------
  */

  function updateLocalQuantity(
    variantId,
    value
  ) {

    const quantity =
      Math.max(
        0,
        Number(value)
      );


    setProducts(
      current =>
        current.map(
          product => ({

            ...product,

            variants:
              (
                product.variants ||
                []
              ).map(
                variant =>
                  variant.id ===
                  variantId
                    ? {
                        ...variant,
                        quantity
                      }
                    : variant
              )

          })
        )
    );

  }


  /*
  |--------------------------------------------------------------------------
  | Save quantity
  |--------------------------------------------------------------------------
  */

  async function saveQuantity(
    row
  ) {

    try {

      setSavingId(
        row.id
      );


      await api.patch(
        `/admin/products/${row.productId}/variants/${row.id}`,
        {
          quantity:
            Number(
              row.quantity
            )
        }
      );


    } catch (error) {

      console.error(error);


      alert(
        error.response
          ?.data
          ?.message ||
        "Unable to update stock."
      );


      await loadInventory();


    } finally {

      setSavingId(null);

    }

  }


  if (loading) {

    return (
      <div>
        Loading inventory...
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
            Inventory
          </h2>

          <p>
            Manage stock by SKU, color and size.
          </p>

        </div>

      </div>


      {
        error && (

          <div
            className="error-message"
          >
            {error}
          </div>

        )
      }


      {/* STATS */}

      <div
        className="stat-grid"
      >

        <InventoryStat
          title="Variants"
          value={
            inventoryRows.length
          }
        />


        <InventoryStat
          title="Total Units"
          value={
            totalQuantity
          }
        />


        <InventoryStat
          title="Low Stock"
          value={
            lowStockCount
          }
        />


        <InventoryStat
          title="Out of Stock"
          value={
            outOfStockCount
          }
        />

      </div>


      {/* FILTER */}

      <div
        className="inventory-toolbar"
      >

        <input
          className="search-input"
          placeholder="Search product, SKU, color or size..."
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
            stockFilter
          }
          onChange={
            event =>
              setStockFilter(
                event.target.value
              )
          }
        >

          <option value="all">
            All Stock
          </option>

          <option value="in-stock">
            In Stock
          </option>

          <option value="low-stock">
            Low Stock
          </option>

          <option value="out-of-stock">
            Out of Stock
          </option>

        </select>

      </div>


      {/* TABLE */}

      <div
        className="table-card"
      >

        <div
          className="table-wrapper"
        >

          <table
            className="product-table inventory-table"
          >

            <thead>

              <tr>

                <th>
                  Product
                </th>

                <th>
                  Category
                </th>

                <th>
                  SKU
                </th>

                <th>
                  Color
                </th>

                <th>
                  Size
                </th>

                <th>
                  Quantity
                </th>

                <th>
                  Stock Status
                </th>

                <th>
                  Action
                </th>

              </tr>

            </thead>


            <tbody>

              {
                filteredRows.length ===
                0
                  ? (

                    <tr>

                      <td
                        colSpan="8"
                        className="empty-table"
                      >
                        No inventory records found.
                      </td>

                    </tr>

                  )
                  : filteredRows.map(
                    row => {

                      const quantity =
                        Number(
                          row.quantity
                        );


                      let status =
                        "In Stock";


                      let statusClass =
                        "inventory-good";


                      if (
                        quantity === 0
                      ) {

                        status =
                          "Out of Stock";

                        statusClass =
                          "inventory-out";

                      } else if (
                        quantity <= 5
                      ) {

                        status =
                          "Low Stock";

                        statusClass =
                          "inventory-low";

                      }


                      return (

                        <tr
                          key={
                            row.id
                          }
                        >

                          <td>

                            <strong>
                              {
                                row.productName
                              }
                            </strong>

                          </td>


                          <td>
                            {
                              row.category
                            }
                          </td>


                          <td>

                            <code>
                              {
                                row.sku
                              }
                            </code>

                          </td>


                          <td>

                            <div
                              className="inventory-color"
                            >

                              <span
                                className="color-dot"
                                style={{
                                  background:
                                    row.color_hex ||
                                    "#dddddd"
                                }}
                              />

                              {
                                row.color_name
                              }

                            </div>

                          </td>


                          <td>

                            <strong>
                              {
                                row.size
                              }
                            </strong>

                          </td>


                          <td>

                            <input
                              className="stock-input"
                              type="number"
                              min="0"
                              value={
                                row.quantity
                              }
                              onChange={
                                event =>
                                  updateLocalQuantity(
                                    row.id,
                                    event.target.value
                                  )
                              }
                            />

                          </td>


                          <td>

                            <span
                              className={
                                `inventory-status ${statusClass}`
                              }
                            >

                              {status}

                            </span>

                          </td>


                          <td>

                            <button
                              className="small-button"
                              disabled={
                                savingId ===
                                row.id
                              }
                              onClick={() =>
                                saveQuantity(
                                  row
                                )
                              }
                            >

                              {
                                savingId ===
                                  row.id
                                  ? "Saving..."
                                  : "Save"
                              }

                            </button>

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


function InventoryStat({
  title,
  value
}) {

  return (

    <div
      className="stat-card"
    >

      <span>
        {title}
      </span>

      <strong>
        {value}
      </strong>

    </div>

  );

}


export default Inventory;