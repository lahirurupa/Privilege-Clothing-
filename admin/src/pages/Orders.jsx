import {
  useEffect,
  useMemo,
  useState
} from "react";

import api from "../services/api";


/*
|--------------------------------------------------------------------------
| Valid Next Statuses
|--------------------------------------------------------------------------
*/

const STATUS_TRANSITIONS = {

  pending: [
    "confirmed",
    "cancelled"
  ],

  confirmed: [
    "processing",
    "cancelled"
  ],

  processing: [
    "packed",
    "cancelled"
  ],

  packed: [
    "shipped",
    "cancelled"
  ],

  shipped: [
    "delivered"
  ],

  delivered: [],

  cancelled: []

};


function Orders() {

  const [
    orders,
    setOrders
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
    statusFilter,
    setStatusFilter
  ] = useState("all");


  const [
    selectedOrder,
    setSelectedOrder
  ] = useState(null);


  const [
    updatingId,
    setUpdatingId
  ] = useState(null);


  /*
  |--------------------------------------------------------------------------
  | Load Orders
  |--------------------------------------------------------------------------
  */

  async function loadOrders() {

    try {

      setLoading(true);

      setError("");


      const response =
        await api.get(
          "/admin/orders"
        );


      setOrders(
        response.data.orders ||
        []
      );


    } catch (error) {

      console.error(
        "LOAD ORDERS ERROR:",
        error
      );


      setError(
        error.response
          ?.data
          ?.message ||
        "Unable to load orders."
      );


    } finally {

      setLoading(false);

    }

  }


  useEffect(() => {

    loadOrders();

  }, []);


  /*
  |--------------------------------------------------------------------------
  | Filter Orders
  |--------------------------------------------------------------------------
  */

  const filteredOrders =
    useMemo(() => {

      const query =
        search
          .trim()
          .toLowerCase();


      return orders.filter(
        order => {

          const matchesSearch =
            !query ||

            order.order_number
              ?.toLowerCase()
              .includes(query) ||

            order.customer_name
              ?.toLowerCase()
              .includes(query) ||

            order.customer_email
              ?.toLowerCase()
              .includes(query) ||

            order.phone
              ?.toLowerCase()
              .includes(query);


          const matchesStatus =
            statusFilter ===
            "all" ||

            order.status ===
            statusFilter;


          return (
            matchesSearch &&
            matchesStatus
          );

        }
      );

    }, [
      orders,
      search,
      statusFilter
    ]);


  /*
  |--------------------------------------------------------------------------
  | Statistics
  |--------------------------------------------------------------------------
  */

  const pendingCount =
    orders.filter(
      order =>
        order.status ===
        "pending"
    ).length;


  const activeCount =
    orders.filter(
      order =>
        [
          "confirmed",
          "processing",
          "packed",
          "shipped"
        ].includes(
          order.status
        )
    ).length;


  const deliveredCount =
    orders.filter(
      order =>
        order.status ===
        "delivered"
    ).length;


  const cancelledCount =
    orders.filter(
      order =>
        order.status ===
        "cancelled"
    ).length;


  /*
  |--------------------------------------------------------------------------
  | Currency
  |--------------------------------------------------------------------------
  */

  function money(
    value
  ) {

    return new Intl.NumberFormat(
      "en-LK",
      {
        style: "currency",
        currency: "LKR"
      }
    ).format(
      Number(value || 0)
    );

  }


  /*
  |--------------------------------------------------------------------------
  | Date
  |--------------------------------------------------------------------------
  */

  function formatDate(
    value
  ) {

    if (!value) {

      return "-";

    }


    return new Intl.DateTimeFormat(
      "en-LK",
      {
        dateStyle:
          "medium",

        timeStyle:
          "short"
      }
    ).format(
      new Date(value)
    );

  }


  /*
  |--------------------------------------------------------------------------
  | Pretty Status
  |--------------------------------------------------------------------------
  */

  function prettyStatus(
    status
  ) {

    return status
      .replace(
        /_/g,
        " "
      )
      .replace(
        /\b\w/g,
        character =>
          character.toUpperCase()
      );

  }


  /*
  |--------------------------------------------------------------------------
  | Update Status
  |--------------------------------------------------------------------------
  */

  async function changeStatus(
    order,
    newStatus
  ) {

    if (
      !newStatus
    ) {

      return;

    }


    /*
    |--------------------------------------------------------------------------
    | Cancellation Warning
    |--------------------------------------------------------------------------
    */

    if (
      newStatus ===
      "cancelled"
    ) {

      const confirmed =
        window.confirm(
          `Cancel order ${order.order_number}?\n\nThe ordered quantities will be returned to inventory.`
        );


      if (!confirmed) {

        return;

      }

    }


    try {

      setUpdatingId(
        order.id
      );


      const response =
        await api.patch(
          `/admin/orders/${order.id}/status`,
          {
            status:
              newStatus
          }
        );


      const updatedOrder =
        response.data.order;


      setOrders(
        current =>
          current.map(
            item =>
              item.id ===
              updatedOrder.id
                ? updatedOrder
                : item
          )
      );


      /*
      |--------------------------------------------------------------------------
      | Keep modal synchronized
      |--------------------------------------------------------------------------
      */

      if (
        selectedOrder?.id ===
        updatedOrder.id
      ) {

        setSelectedOrder(
          updatedOrder
        );

      }


    } catch (error) {

      console.error(
        "ORDER STATUS ERROR:",
        error
      );


      alert(
        error.response
          ?.data
          ?.message ||
        "Unable to update order."
      );


    } finally {

      setUpdatingId(
        null
      );

    }

  }


  if (loading) {

    return (

      <div>
        Loading orders...
      </div>

    );

  }


  return (

    <div
      className="orders-admin-page"
    >

      {/* =====================================================
          HEADER
      ====================================================== */}

      <div
        className="orders-admin-header"
      >

        <div>

          <span
            className="page-eyebrow"
          >
            ORDER MANAGEMENT
          </span>


          <h2>
            Orders
          </h2>


          <p>
            Review customer orders and manage fulfilment.
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


      {/* =====================================================
          STATISTICS
      ====================================================== */}

      <div
        className="orders-stat-grid"
      >

        <OrderStat
          title="Total Orders"
          value={
            orders.length
          }
        />


        <OrderStat
          title="Pending"
          value={
            pendingCount
          }
        />


        <OrderStat
          title="In Progress"
          value={
            activeCount
          }
        />


        <OrderStat
          title="Delivered"
          value={
            deliveredCount
          }
        />


        <OrderStat
          title="Cancelled"
          value={
            cancelledCount
          }
        />

      </div>


      {/* =====================================================
          FILTERS
      ====================================================== */}

      <div
        className="orders-controls"
      >

        <input
          className="orders-search"
          type="text"
          placeholder="Search order, customer, email or phone..."
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
          className="orders-filter"
          value={
            statusFilter
          }
          onChange={
            event =>
              setStatusFilter(
                event.target.value
              )
          }
        >

          <option value="all">
            All Status
          </option>

          <option value="pending">
            Pending
          </option>

          <option value="confirmed">
            Confirmed
          </option>

          <option value="processing">
            Processing
          </option>

          <option value="packed">
            Packed
          </option>

          <option value="shipped">
            Shipped
          </option>

          <option value="delivered">
            Delivered
          </option>

          <option value="cancelled">
            Cancelled
          </option>

        </select>

      </div>


      {/* =====================================================
          TABLE
      ====================================================== */}

      <div
        className="orders-table-card"
      >

        <div
          className="table-wrapper"
        >

          <table
            className="admin-orders-table"
          >

            <thead>

              <tr>

                <th>
                  Order
                </th>

                <th>
                  Customer
                </th>

                <th>
                  Items
                </th>

                <th>
                  Total
                </th>

                <th>
                  Date
                </th>

                <th>
                  Status
                </th>

                <th>
                  Action
                </th>

              </tr>

            </thead>


            <tbody>

              {
                filteredOrders.length ===
                0
                  ? (

                    <tr>

                      <td
                        colSpan="7"
                        className="empty-table"
                      >
                        No orders found.
                      </td>

                    </tr>

                  )
                  : filteredOrders.map(
                    order => {

                      const nextStatuses =
                        STATUS_TRANSITIONS[
                          order.status
                        ] || [];


                      const itemCount =
                        (
                          order.items ||
                          []
                        ).reduce(
                          (
                            total,
                            item
                          ) =>
                            total +
                            Number(
                              item.quantity
                            ),
                          0
                        );


                      return (

                        <tr
                          key={
                            order.id
                          }
                        >

                          {/* ORDER */}

                          <td>

                            <strong
                              className="order-number"
                            >
                              {
                                order.order_number
                              }
                            </strong>

                          </td>


                          {/* CUSTOMER */}

                          <td>

                            <div
                              className="order-customer"
                            >

                              <strong>
                                {
                                  order.customer_name
                                }
                              </strong>

                              <small>
                                {
                                  order.customer_email
                                }
                              </small>

                            </div>

                          </td>


                          {/* ITEMS */}

                          <td>

                            {
                              itemCount
                            }{" "}
                            {
                              itemCount === 1
                                ? "item"
                                : "items"
                            }

                          </td>


                          {/* TOTAL */}

                          <td>

                            <strong>
                              {
                                money(
                                  order.total
                                )
                              }
                            </strong>

                          </td>


                          {/* DATE */}

                          <td>

                            {
                              formatDate(
                                order.created_at
                              )
                            }

                          </td>


                          {/* STATUS */}

                          <td>

                            <span
                              className={
                                `admin-order-status admin-status-${order.status}`
                              }
                            >

                              {
                                prettyStatus(
                                  order.status
                                )
                              }

                            </span>

                          </td>


                          {/* ACTION */}

                          <td>

                            <div
                              className="order-action-group"
                            >

                              <button
                                type="button"
                                className="small-button"
                                onClick={() =>
                                  setSelectedOrder(
                                    order
                                  )
                                }
                              >
                                View
                              </button>


                              {
                                nextStatuses.length >
                                  0 && (

                                  <select
                                    className="order-status-select"
                                    value=""
                                    disabled={
                                      updatingId ===
                                      order.id
                                    }
                                    onChange={
                                      event => {

                                        const value =
                                          event
                                            .target
                                            .value;


                                        if (value) {

                                          changeStatus(
                                            order,
                                            value
                                          );

                                        }

                                      }
                                    }
                                  >

                                    <option value="">
                                      {
                                        updatingId ===
                                        order.id
                                          ? "Updating..."
                                          : "Change Status"
                                      }
                                    </option>


                                    {
                                      nextStatuses.map(
                                        status => (

                                          <option
                                            key={
                                              status
                                            }
                                            value={
                                              status
                                            }
                                          >
                                            {
                                              prettyStatus(
                                                status
                                              )
                                            }
                                          </option>

                                        )
                                      )
                                    }

                                  </select>

                                )
                              }

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


      {/* =====================================================
          ORDER DETAILS MODAL
      ====================================================== */}

      {
        selectedOrder && (

          <OrderModal
            order={
              selectedOrder
            }
            money={
              money
            }
            formatDate={
              formatDate
            }
            prettyStatus={
              prettyStatus
            }
            updating={
              updatingId ===
              selectedOrder.id
            }
            onStatusChange={
              changeStatus
            }
            onClose={() =>
              setSelectedOrder(
                null
              )
            }
          />

        )
      }

    </div>

  );

}


/*
|--------------------------------------------------------------------------
| Statistics Card
|--------------------------------------------------------------------------
*/

function OrderStat({
  title,
  value
}) {

  return (

    <div
      className="orders-stat-card"
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


/*
|--------------------------------------------------------------------------
| Order Modal
|--------------------------------------------------------------------------
*/

function OrderModal({

  order,

  money,

  formatDate,

  prettyStatus,

  updating,

  onStatusChange,

  onClose

}) {

  const nextStatuses =
    STATUS_TRANSITIONS[
      order.status
    ] || [];


  return (

    <div
      className="order-modal-backdrop"
      onMouseDown={
        event => {

          if (
            event.target ===
            event.currentTarget
          ) {

            onClose();

          }

        }
      }
    >

      <div
        className="order-modal"
      >

        {/* HEADER */}

        <div
          className="order-modal-header"
        >

          <div>

            <span
              className="page-eyebrow"
            >
              ORDER DETAILS
            </span>


            <h2>
              {
                order.order_number
              }
            </h2>

          </div>


          <button
            type="button"
            className="order-modal-close"
            onClick={
              onClose
            }
          >
            ×
          </button>

        </div>


        {/* SUMMARY */}

        <div
          className="order-detail-summary"
        >

          <div>

            <small>
              Status
            </small>

            <span
              className={
                `admin-order-status admin-status-${order.status}`
              }
            >
              {
                prettyStatus(
                  order.status
                )
              }
            </span>

          </div>


          <div>

            <small>
              Date
            </small>

            <strong>
              {
                formatDate(
                  order.created_at
                )
              }
            </strong>

          </div>


          <div>

            <small>
              Total
            </small>

            <strong>
              {
                money(
                  order.total
                )
              }
            </strong>

          </div>

        </div>


        {/* CUSTOMER */}

        <section
          className="order-detail-section"
        >

          <h3>
            Customer
          </h3>


          <div
            className="order-detail-grid"
          >

            <Detail
              label="Name"
              value={
                order.customer_name
              }
            />


            <Detail
              label="Email"
              value={
                order.customer_email
              }
            />


            <Detail
              label="Phone"
              value={
                order.phone
              }
            />

          </div>

        </section>


        {/* DELIVERY */}

        <section
          className="order-detail-section"
        >

          <h3>
            Delivery Address
          </h3>


          <p
            className="order-address"
          >

            {
              order.address_line1
            }

            {
              order.address_line2
                ? `, ${order.address_line2}`
                : ""
            }

            <br />

            {
              order.city
            }

            {
              order.postal_code
                ? `, ${order.postal_code}`
                : ""
            }

          </p>

        </section>


        {/* PAYMENT */}

        <section
          className="order-detail-section"
        >

          <h3>
            Payment
          </h3>


          <div
            className="order-detail-grid"
          >

            <Detail
              label="Method"
              value={
                order.payment_method ===
                "cash_on_delivery"
                  ? "Cash on Delivery"
                  : order.payment_method
              }
            />


            <Detail
              label="Payment Status"
              value={
                prettyStatus(
                  order.payment_status
                )
              }
            />

          </div>

        </section>


        {/* ITEMS */}

        <section
          className="order-detail-section"
        >

          <h3>
            Items
          </h3>


          <div
            className="admin-order-items"
          >

            {
              (
                order.items ||
                []
              ).map(
                item => (

                  <div
                    className="admin-order-item"
                    key={
                      item.id
                    }
                  >

                    <div>

                      <strong>
                        {
                          item.product_name
                        }
                      </strong>


                      <span>
                        {
                          item.color_name
                        }
                        {" / "}
                        {
                          item.size
                        }
                      </span>


                      <small>
                        SKU: {
                          item.sku
                        }
                      </small>

                    </div>


                    <div
                      className="admin-order-item-price"
                    >

                      <span>
                        {
                          money(
                            item.unit_price
                          )
                        }
                        {" × "}
                        {
                          item.quantity
                        }
                      </span>


                      <strong>
                        {
                          money(
                            item.line_total
                          )
                        }
                      </strong>

                    </div>

                  </div>

                )
              )
            }

          </div>

        </section>


        {/* TOTALS */}

        <section
          className="order-total-box"
        >

          <div>

            <span>
              Subtotal
            </span>

            <strong>
              {
                money(
                  order.subtotal
                )
              }
            </strong>

          </div>


          <div>

            <span>
              Delivery
            </span>

            <strong>
              {
                money(
                  order.delivery_fee
                )
              }
            </strong>

          </div>


          <div
            className="order-grand-total"
          >

            <span>
              Total
            </span>

            <strong>
              {
                money(
                  order.total
                )
              }
            </strong>

          </div>

        </section>


        {/* STATUS ACTION */}

        {
          nextStatuses.length >
            0 && (

            <div
              className="order-modal-actions"
            >

              <span>
                Update order:
              </span>


              {
                nextStatuses.map(
                  status => (

                    <button
                      type="button"
                      key={
                        status
                      }
                      disabled={
                        updating
                      }
                      className={
                        status ===
                        "cancelled"
                          ? "order-cancel-button"
                          : "primary-button"
                      }
                      onClick={() =>
                        onStatusChange(
                          order,
                          status
                        )
                      }
                    >
                      {
                        prettyStatus(
                          status
                        )
                      }
                    </button>

                  )
                )
              }

            </div>

          )
        }

      </div>

    </div>

  );

}


/*
|--------------------------------------------------------------------------
| Detail
|--------------------------------------------------------------------------
*/

function Detail({
  label,
  value
}) {

  return (

    <div
      className="order-detail-value"
    >

      <small>
        {label}
      </small>

      <strong>
        {value || "-"}
      </strong>

    </div>

  );

}


export default Orders;