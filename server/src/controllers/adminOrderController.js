import {
  supabase
} from "../config/supabase.js";


/*
|--------------------------------------------------------------------------
| Common Order Selection
|--------------------------------------------------------------------------
*/

const ADMIN_ORDER_SELECT = `

  id,
  order_number,
  user_id,

  customer_name,
  customer_email,
  phone,

  address_line1,
  address_line2,
  city,
  postal_code,

  subtotal,
  delivery_fee,
  total,

  payment_method,
  payment_status,

  status,

  created_at,
  updated_at,

  customer:users (
    id,
    name,
    email,
    is_active
  ),

  items:order_items (
    id,
    product_id,
    variant_id,
    product_name,
    sku,
    color_name,
    size,
    unit_price,
    quantity,
    line_total
  )

`;


/*
|--------------------------------------------------------------------------
| GET ALL ORDERS
|--------------------------------------------------------------------------
|
| GET /api/admin/orders
|
| Optional:
|
| ?status=pending
| ?search=PRV-2026
|
*/

export async function getAdminOrders(
  req,
  res
) {

  try {

    const search =
      req.query.search
        ?.trim() ||
      "";


    const status =
      req.query.status ||
      "all";


    let query =
      supabase
        .from("orders")
        .select(
          ADMIN_ORDER_SELECT
        )
        .order(
          "created_at",
          {
            ascending: false
          }
        );


    /*
    |--------------------------------------------------------------------------
    | Status Filter
    |--------------------------------------------------------------------------
    */

    const validStatuses = [
      "pending",
      "confirmed",
      "processing",
      "packed",
      "shipped",
      "delivered",
      "cancelled"
    ];


    if (
      validStatuses.includes(
        status
      )
    ) {

      query =
        query.eq(
          "status",
          status
        );

    }


    /*
    |--------------------------------------------------------------------------
    | Search
    |--------------------------------------------------------------------------
    */

    if (search) {

      /*
      |--------------------------------------------------------------------------
      | Sanitize characters that could interfere with PostgREST filter syntax
      |--------------------------------------------------------------------------
      */

      const safeSearch =
        search
          .replace(
            /[%(),]/g,
            ""
          );


      if (safeSearch) {

        query =
          query.or(
            [
              `order_number.ilike.%${safeSearch}%`,
              `customer_name.ilike.%${safeSearch}%`,
              `customer_email.ilike.%${safeSearch}%`,
              `phone.ilike.%${safeSearch}%`
            ].join(",")
          );

      }

    }


    const {
      data,
      error
    } = await query;


    if (error) {

      console.error(
        "GET ADMIN ORDERS ERROR:",
        error
      );


      return res
        .status(500)
        .json({

          success: false,

          message:
            "Unable to retrieve orders"

        });

    }


    return res
      .status(200)
      .json({

        success: true,

        count:
          data?.length ||
          0,

        orders:
          data || []

      });


  } catch (error) {

    console.error(
      "GET ADMIN ORDERS ERROR:",
      error
    );


    return res
      .status(500)
      .json({

        success: false,

        message:
          "Server error while retrieving orders"

      });

  }

}


/*
|--------------------------------------------------------------------------
| GET ONE ORDER
|--------------------------------------------------------------------------
|
| GET /api/admin/orders/:id
|
*/

export async function getAdminOrder(
  req,
  res
) {

  try {

    const {
      data: order,
      error
    } = await supabase
      .from("orders")
      .select(
        ADMIN_ORDER_SELECT
      )
      .eq(
        "id",
        req.params.id
      )
      .maybeSingle();


    if (error) {

      console.error(
        "GET ADMIN ORDER ERROR:",
        error
      );


      return res
        .status(500)
        .json({

          success: false,

          message:
            "Unable to retrieve order"

        });

    }


    if (!order) {

      return res
        .status(404)
        .json({

          success: false,

          message:
            "Order not found"

        });

    }


    return res
      .status(200)
      .json({

        success: true,

        order

      });


  } catch (error) {

    console.error(
      "GET ADMIN ORDER ERROR:",
      error
    );


    return res
      .status(500)
      .json({

        success: false,

        message:
          "Server error"

      });

  }

}


/*
|--------------------------------------------------------------------------
| UPDATE ORDER STATUS
|--------------------------------------------------------------------------
|
| PATCH /api/admin/orders/:id/status
|
| Body:
|
| {
|   "status": "confirmed"
| }
|
*/

export async function updateAdminOrderStatus(
  req,
  res
) {

  try {

    const orderId =
      req.params.id;


    const {
      status
    } = req.body;


    const validStatuses = [

      "confirmed",

      "processing",

      "packed",

      "shipped",

      "delivered",

      "cancelled"

    ];


    /*
    |--------------------------------------------------------------------------
    | Validation
    |--------------------------------------------------------------------------
    */

    if (
      !validStatuses.includes(
        status
      )
    ) {

      return res
        .status(400)
        .json({

          success: false,

          message:
            "Invalid order status"

        });

    }


    /*
    |--------------------------------------------------------------------------
    | PostgreSQL Transaction
    |--------------------------------------------------------------------------
    */

    const {
      data: result,
      error: rpcError
    } = await supabase.rpc(
      "admin_update_order_status",
      {

        p_order_id:
          orderId,

        p_new_status:
          status

      }
    );


    if (rpcError) {

      console.error(
        "ORDER STATUS RPC ERROR:",
        rpcError
      );


      const message =
        rpcError.message ||
        "";


      if (
        message.includes(
          "Order not found"
        )
      ) {

        return res
          .status(404)
          .json({

            success: false,

            message:
              "Order not found"

          });

      }


      if (
        message.includes(
          "Cannot change order status"
        )
      ) {

        return res
          .status(409)
          .json({

            success: false,

            message

          });

      }


      if (
        message.includes(
          "Cannot restore inventory"
        )
      ) {

        return res
          .status(409)
          .json({

            success: false,

            message

          });

      }


      return res
        .status(400)
        .json({

          success: false,

          message:
            message ||
            "Unable to update order status"

        });

    }


    /*
    |--------------------------------------------------------------------------
    | Return Updated Order
    |--------------------------------------------------------------------------
    */

    const {
      data: updatedOrder,
      error: fetchError
    } = await supabase
      .from("orders")
      .select(
        ADMIN_ORDER_SELECT
      )
      .eq(
        "id",
        orderId
      )
      .single();


    if (fetchError) {

      console.error(
        "FETCH UPDATED ORDER ERROR:",
        fetchError
      );


      return res
        .status(500)
        .json({

          success: false,

          message:
            "Order status changed but unable to reload order"

        });

    }


    return res
      .status(200)
      .json({

        success: true,

        message:
          status ===
          "cancelled"
            ? "Order cancelled and inventory restored successfully"
            : `Order moved to ${status}`,

        transition:
          result,

        order:
          updatedOrder

      });


  } catch (error) {

    console.error(
      "UPDATE ADMIN ORDER ERROR:",
      error
    );


    return res
      .status(500)
      .json({

        success: false,

        message:
          "Server error while updating order"

      });

  }

}