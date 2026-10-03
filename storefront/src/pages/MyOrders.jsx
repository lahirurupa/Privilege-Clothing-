import {
  useEffect,
  useState
} from "react";

import {
  useLocation
} from "react-router-dom";

import api
  from "../services/api";


function MyOrders() {

  const location =
    useLocation();


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


  useEffect(() => {

    async function loadOrders() {

      try {

        const response =
          await api.get(
            "/orders/my"
          );


        setOrders(
          response.data.orders ||
          []
        );


      } catch (error) {

        console.error(error);


        setError(
          "Unable to load orders."
        );


      } finally {

        setLoading(false);

      }

    }


    loadOrders();

  }, []);


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
      Number(value)
    );

  }


  function date(
    value
  ) {

    return new Intl.DateTimeFormat(
      "en-LK",
      {
        dateStyle: "medium",
        timeStyle: "short"
      }
    ).format(
      new Date(value)
    );

  }


  if (loading) {

    return (
      <div
        className="store-section"
      >
        Loading orders...
      </div>
    );

  }


  return (

    <section
      className="store-section"
    >

      <span
        className="store-eyebrow"
      >
        YOUR ACCOUNT
      </span>

      <h1
        className="orders-heading"
      >
        My Orders
      </h1>


      {
        location.state
          ?.newOrderNumber && (

          <div
            className="order-success"
          >

            Order{" "}
            <strong>
              {
                location.state
                  .newOrderNumber
              }
            </strong>{" "}
            was placed successfully.

          </div>

        )
      }


      {
        error && (

          <div
            className="store-error"
          >
            {error}
          </div>

        )
      }


      {
        orders.length === 0
          ? (

            <div
              className="store-empty"
            >
              You have not placed any orders yet.
            </div>

          )
          : (

            <div
              className="orders-list"
            >

              {
                orders.map(
                  order => (

                    <article
                      className="order-card"
                      key={
                        order.id
                      }
                    >

                      <div
                        className="order-card-header"
                      >

                        <div>

                          <small>
                            ORDER
                          </small>

                          <strong>
                            {
                              order.order_number
                            }
                          </strong>

                        </div>


                        <div>

                          <small>
                            DATE
                          </small>

                          <span>
                            {
                              date(
                                order.created_at
                              )
                            }
                          </span>

                        </div>


                        <div>

                          <small>
                            TOTAL
                          </small>

                          <strong>
                            {
                              money(
                                order.total
                              )
                            }
                          </strong>

                        </div>


                        <span
                          className={
                            `order-status status-${order.status}`
                          }
                        >
                          {
                            order.status
                          }
                        </span>

                      </div>


                      <div
                        className="order-items"
                      >

                        {
                          order.items?.map(
                            item => (

                              <div
                                className="order-item-line"
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

                                  <small>
                                    {
                                      item.color_name
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
                                    money(
                                      item.line_total
                                    )
                                  }
                                </span>

                              </div>

                            )
                          )
                        }

                      </div>

                    </article>

                  )
                )
              }

            </div>

          )
      }

    </section>

  );

}


export default MyOrders;