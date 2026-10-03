// import {
//   supabase
// } from "../config/supabase.js";

// import {
//   createOrderSchema
// } from "../validators/orderValidator.js";


// /*
// |--------------------------------------------------------------------------
// | CREATE ORDER
// |--------------------------------------------------------------------------
// */

// export async function createOrder(
//   req,
//   res
// ) {

//   try {

//     const validation =
//       createOrderSchema.safeParse(
//         req.body
//       );


//     if (
//       !validation.success
//     ) {

//       return res
//         .status(400)
//         .json({

//           success: false,

//           message:
//             "Validation failed",

//           errors:
//             validation
//               .error
//               .issues

//         });

//     }


//     const data =
//       validation.data;


//     /*
//     |--------------------------------------------------------------------------
//     | Combine duplicate variants
//     |--------------------------------------------------------------------------
//     |
//     | If frontend accidentally sends:
//     |
//     | M x 1
//     | M x 2
//     |
//     | Backend converts to:
//     |
//     | M x 3
//     |
//     */

//     const itemMap =
//       new Map();


//     for (
//       const item of
//       data.items
//     ) {

//       const current =
//         itemMap.get(
//           item.variant_id
//         ) || 0;


//       itemMap.set(
//         item.variant_id,
//         current +
//           item.quantity
//       );

//     }


//     const items =
//       Array.from(
//         itemMap.entries()
//       ).map(
//         (
//           [
//             variant_id,
//             quantity
//           ]
//         ) => ({

//           variant_id,

//           quantity

//         })
//       );


//     /*
//     |--------------------------------------------------------------------------
//     | Final max check
//     |--------------------------------------------------------------------------
//     */

//     for (
//       const item of
//       items
//     ) {

//       if (
//         item.quantity >
//         20
//       ) {

//         return res
//           .status(400)
//           .json({

//             success: false,

//             message:
//               "Maximum quantity per product variant is 20"

//           });

//       }

//     }


//     /*
//     |--------------------------------------------------------------------------
//     | PostgreSQL Transaction
//     |--------------------------------------------------------------------------
//     */

//     const {
//       data: order,
//       error
//     } =
//       await supabase.rpc(
//         "place_order",
//         {

//           p_user_id:
//             req.user.id,

//           p_customer_name:
//             data.customer_name,

//           p_customer_email:
//             req.user.email,

//           p_phone:
//             data.phone,

//           p_address_line1:
//             data.address_line1,

//           p_address_line2:
//             data.address_line2,

//           p_city:
//             data.city,

//           p_postal_code:
//             data.postal_code,

//           p_items:
//             items

//         }
//       );


//     if (error) {

//       console.error(
//         "CREATE ORDER RPC ERROR:",
//         error
//       );


//       const message =
//         error.message || "";


//       if (
//         message.includes(
//           "Insufficient stock"
//         )
//       ) {

//         return res
//           .status(409)
//           .json({

//             success: false,

//             message

//           });

//       }


//       if (
//         message.includes(
//           "no longer available"
//         )
//       ) {

//         return res
//           .status(409)
//           .json({

//             success: false,

//             message

//           });

//       }


//       return res
//         .status(400)
//         .json({

//           success: false,

//           message:
//             message ||
//             "Unable to create order"

//         });

//     }


//     return res
//       .status(201)
//       .json({

//         success: true,

//         message:
//           "Order placed successfully",

//         order

//       });


//   } catch (error) {

//     console.error(
//       "CREATE ORDER ERROR:",
//       error
//     );


//     return res
//       .status(500)
//       .json({

//         success: false,

//         message:
//           "Server error while placing order"

//       });

//   }

// }


// /*
// |--------------------------------------------------------------------------
// | CUSTOMER - GET MY ORDERS
// |--------------------------------------------------------------------------
// */

// export async function getMyOrders(
//   req,
//   res
// ) {

//   try {

//     const {
//       data,
//       error
//     } = await supabase
//       .from("orders")
//       .select(`
//         id,
//         order_number,
//         customer_name,
//         phone,
//         address_line1,
//         address_line2,
//         city,
//         postal_code,
//         subtotal,
//         delivery_fee,
//         total,
//         payment_method,
//         payment_status,
//         status,
//         created_at,

//         items:order_items (
//           id,
//           product_id,
//           variant_id,
//           product_name,
//           sku,
//           color_name,
//           size,
//           unit_price,
//           quantity,
//           line_total
//         )
//       `)
//       .eq(
//         "user_id",
//         req.user.id
//       )
//       .order(
//         "created_at",
//         {
//           ascending: false
//         }
//       );


//     if (error) {

//       console.error(
//         "GET ORDERS ERROR:",
//         error
//       );


//       return res
//         .status(500)
//         .json({

//           success: false,

//           message:
//             "Unable to retrieve orders"

//         });

//     }


//     return res
//       .status(200)
//       .json({

//         success: true,

//         orders:
//           data || []

//       });


//   } catch (error) {

//     console.error(error);


//     return res
//       .status(500)
//       .json({

//         success: false,

//         message:
//           "Server error"

//       });

//   }

// }


// /*
// |--------------------------------------------------------------------------
// | CUSTOMER - GET ONE ORDER
// |--------------------------------------------------------------------------
// */

// export async function getMyOrder(
//   req,
//   res
// ) {

//   try {

//     const {
//       data,
//       error
//     } = await supabase
//       .from("orders")
//       .select(`
//         id,
//         order_number,
//         customer_name,
//         customer_email,
//         phone,
//         address_line1,
//         address_line2,
//         city,
//         postal_code,
//         subtotal,
//         delivery_fee,
//         total,
//         payment_method,
//         payment_status,
//         status,
//         created_at,

//         items:order_items (
//           id,
//           product_id,
//           variant_id,
//           product_name,
//           sku,
//           color_name,
//           size,
//           unit_price,
//           quantity,
//           line_total
//         )
//       `)
//       .eq(
//         "id",
//         req.params.id
//       )
//       .eq(
//         "user_id",
//         req.user.id
//       )
//       .maybeSingle();


//     if (error) {

//       console.error(error);


//       return res
//         .status(500)
//         .json({

//           success: false,

//           message:
//             "Unable to retrieve order"

//         });

//     }


//     if (!data) {

//       return res
//         .status(404)
//         .json({

//           success: false,

//           message:
//             "Order not found"

//         });

//     }


//     return res.json({

//       success: true,

//       order: data

//     });


//   } catch (error) {

//     console.error(error);


//     return res
//       .status(500)
//       .json({

//         success: false,

//         message:
//           "Server error"

//       });

//   }

// }
















import {
  supabase
} from "../config/supabase.js";

import {
  createOrderSchema
} from "../validators/orderValidator.js";


/*
|--------------------------------------------------------------------------
| CREATE ORDER
|--------------------------------------------------------------------------
*/

export async function createOrder(
  req,
  res
) {

  try {

    const validation =
      createOrderSchema.safeParse(
        req.body
      );


    if (
      !validation.success
    ) {

      return res
        .status(400)
        .json({

          success: false,

          message:
            "Validation failed",

          errors:
            validation
              .error
              .issues

        });

    }


    const data =
      validation.data;


    /*
    |--------------------------------------------------------------------------
    | PostgreSQL Transaction
    |--------------------------------------------------------------------------
    |
    | This function:
    |
    | 1. Reads customer's cart
    | 2. Locks product variants
    | 3. Verifies current stock
    | 4. Uses real DB prices
    | 5. Creates order
    | 6. Creates order items
    | 7. Deducts stock
    | 8. Clears customer's cart
    |
    | All inside one transaction.
    |
    */

    const {
      data: order,
      error
    } = await supabase.rpc(
      "place_order_from_cart",
      {

        p_user_id:
          req.user.id,

        p_customer_name:
          data.customer_name,

        p_customer_email:
          req.user.email,

        p_phone:
          data.phone,

        p_address_line1:
          data.address_line1,

        p_address_line2:
          data.address_line2,

        p_city:
          data.city,

        p_postal_code:
          data.postal_code

      }
    );


    if (error) {

      console.error(
        "CREATE ORDER RPC ERROR:",
        error
      );


      const message =
        error.message ||
        "";


      if (
        message.includes(
          "Insufficient stock"
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
          "no longer available"
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
          "cart is empty"
        )
      ) {

        return res
          .status(400)
          .json({

            success: false,

            message:
              "Your cart is empty"

          });

      }


      return res
        .status(400)
        .json({

          success: false,

          message:
            message ||
            "Unable to create order"

        });

    }


    return res
      .status(201)
      .json({

        success: true,

        message:
          "Order placed successfully",

        order

      });


  } catch (error) {

    console.error(
      "CREATE ORDER ERROR:",
      error
    );


    return res
      .status(500)
      .json({

        success: false,

        message:
          "Server error while placing order"

      });

  }

}


/*
|--------------------------------------------------------------------------
| CUSTOMER - GET MY ORDERS
|--------------------------------------------------------------------------
*/

export async function getMyOrders(
  req,
  res
) {

  try {

    const {
      data,
      error
    } = await supabase
      .from("orders")
      .select(`
        id,
        order_number,
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
      `)
      .eq(
        "user_id",
        req.user.id
      )
      .order(
        "created_at",
        {
          ascending: false
        }
      );


    if (error) {

      console.error(
        "GET MY ORDERS ERROR:",
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


    return res.json({

      success: true,

      orders:
        data || []

    });


  } catch (error) {

    console.error(
      "GET MY ORDERS ERROR:",
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
| CUSTOMER - GET ONE ORDER
|--------------------------------------------------------------------------
*/

export async function getMyOrder(
  req,
  res
) {

  try {

    const {
      data,
      error
    } = await supabase
      .from("orders")
      .select(`
        id,
        order_number,
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
      `)
      .eq(
        "id",
        req.params.id
      )
      .eq(
        "user_id",
        req.user.id
      )
      .maybeSingle();


    if (error) {

      console.error(
        "GET ORDER ERROR:",
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


    if (!data) {

      return res
        .status(404)
        .json({

          success: false,

          message:
            "Order not found"

        });

    }


    return res.json({

      success: true,

      order:
        data

    });


  } catch (error) {

    console.error(
      "GET ORDER ERROR:",
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