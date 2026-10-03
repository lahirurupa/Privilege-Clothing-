// import {
//   supabase
// } from "../config/supabase.js";

// import {
//   addCartItemSchema,
//   updateCartItemSchema
// } from "../validators/cartValidator.js";


// /*
// |--------------------------------------------------------------------------
// | Helper - convert database cart into frontend-friendly structure
// |--------------------------------------------------------------------------
// */

// function formatCartItems(
//   rows = []
// ) {

//   return rows.map(
//     row => {

//       const variant =
//         row.variant;


//       const product =
//         variant?.product;


//       const images =
//         [
//           ...(product?.images || [])
//         ].sort(
//           (a, b) =>
//             a.display_order -
//             b.display_order
//         );


//       return {

//         id:
//           row.id,

//         variantId:
//           variant?.id,

//         productId:
//           product?.id,

//         productName:
//           product?.name,

//         price:
//           Number(
//             product?.price || 0
//           ),

//         image:
//           images[0]
//             ?.public_url ||
//           "",

//         sku:
//           variant?.sku,

//         colorName:
//           variant?.color_name,

//         colorHex:
//           variant?.color_hex,

//         size:
//           variant?.size,

//         quantity:
//           row.quantity,

//         availableStock:
//           Number(
//             variant?.quantity || 0
//           ),

//         productActive:
//           Boolean(
//             product?.is_active
//           ),

//         variantActive:
//           Boolean(
//             variant?.is_active
//           )

//       };

//     }
//   );

// }


// /*
// |--------------------------------------------------------------------------
// | GET CART
// |--------------------------------------------------------------------------
// |
// | GET /api/cart
// |
// */

// export async function getCart(
//   req,
//   res
// ) {

//   try {

//     const {
//       data,
//       error
//     } = await supabase
//       .from("cart_items")
//       .select(`
//         id,
//         quantity,
//         created_at,
//         updated_at,

//         variant:product_variants (
//           id,
//           sku,
//           color_name,
//           color_hex,
//           size,
//           quantity,
//           is_active,

//           product:products (
//             id,
//             name,
//             price,
//             is_active,

//             images:product_images (
//               id,
//               public_url,
//               alt_text,
//               display_order
//             )
//           )
//         )
//       `)
//       .eq(
//         "user_id",
//         req.user.id
//       )
//       .order(
//         "created_at",
//         {
//           ascending: true
//         }
//       );


//     if (error) {

//       console.error(
//         "GET CART ERROR:",
//         error
//       );


//       return res
//         .status(500)
//         .json({

//           success: false,

//           message:
//             "Unable to retrieve cart"

//         });

//     }


//     const cart =
//       formatCartItems(
//         data || []
//       );


//     const subtotal =
//       cart.reduce(
//         (
//           total,
//           item
//         ) =>
//           total +
//           item.price *
//           item.quantity,
//         0
//       );


//     return res.json({

//       success: true,

//       cart,

//       subtotal,

//       count:
//         cart.reduce(
//           (
//             total,
//             item
//           ) =>
//             total +
//             item.quantity,
//           0
//         )

//     });


//   } catch (error) {

//     console.error(
//       "GET CART ERROR:",
//       error
//     );


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
// | ADD TO CART
// |--------------------------------------------------------------------------
// |
// | POST /api/cart/items
// |
// */

// export async function addCartItem(
//   req,
//   res
// ) {

//   try {

//     const validation =
//       addCartItemSchema.safeParse(
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
//             "Invalid cart item",

//           errors:
//             validation
//               .error
//               .issues

//         });

//     }


//     const {
//       variant_id,
//       quantity
//     } = validation.data;


//     /*
//     |--------------------------------------------------------------------------
//     | Check product + variant
//     |--------------------------------------------------------------------------
//     */

//     const {
//       data: variant,
//       error: variantError
//     } = await supabase
//       .from(
//         "product_variants"
//       )
//       .select(`
//         id,
//         quantity,
//         is_active,

//         product:products (
//           id,
//           name,
//           is_active
//         )
//       `)
//       .eq(
//         "id",
//         variant_id
//       )
//       .maybeSingle();


//     if (variantError) {

//       console.error(
//         variantError
//       );


//       return res
//         .status(500)
//         .json({

//           success: false,

//           message:
//             "Unable to check product"

//         });

//     }


//     if (
//       !variant ||
//       !variant.is_active ||
//       !variant.product
//         ?.is_active
//     ) {

//       return res
//         .status(404)
//         .json({

//           success: false,

//           message:
//             "Product is no longer available"

//         });

//     }


//     if (
//       Number(
//         variant.quantity
//       ) <= 0
//     ) {

//       return res
//         .status(409)
//         .json({

//           success: false,

//           message:
//             "This item is out of stock"

//         });

//     }


//     /*
//     |--------------------------------------------------------------------------
//     | Check whether already in customer's cart
//     |--------------------------------------------------------------------------
//     */

//     const {
//       data: existing,
//       error: existingError
//     } = await supabase
//       .from("cart_items")
//       .select(`
//         id,
//         quantity
//       `)
//       .eq(
//         "user_id",
//         req.user.id
//       )
//       .eq(
//         "variant_id",
//         variant_id
//       )
//       .maybeSingle();


//     if (existingError) {

//       console.error(
//         existingError
//       );


//       return res
//         .status(500)
//         .json({

//           success: false,

//           message:
//             "Unable to update cart"

//         });

//     }


//     const existingQuantity =
//       existing
//         ? Number(
//             existing.quantity
//           )
//         : 0;


//     const requestedQuantity =
//       existingQuantity +
//       quantity;


//     if (
//       requestedQuantity >
//       Number(
//         variant.quantity
//       )
//     ) {

//       return res
//         .status(409)
//         .json({

//           success: false,

//           message:
//             `Only ${variant.quantity} item(s) are currently available`

//         });

//     }


//     if (
//       requestedQuantity >
//       20
//     ) {

//       return res
//         .status(400)
//         .json({

//           success: false,

//           message:
//             "Maximum quantity per variant is 20"

//         });

//     }


//     /*
//     |--------------------------------------------------------------------------
//     | Update or Insert
//     |--------------------------------------------------------------------------
//     */

//     if (existing) {

//       const {
//         error
//       } = await supabase
//         .from("cart_items")
//         .update({

//           quantity:
//             requestedQuantity

//         })
//         .eq(
//           "id",
//           existing.id
//         )
//         .eq(
//           "user_id",
//           req.user.id
//         );


//       if (error) {

//         console.error(error);


//         return res
//           .status(500)
//           .json({

//             success: false,

//             message:
//               "Unable to update cart"

//           });

//       }

//     } else {

//       const {
//         error
//       } = await supabase
//         .from("cart_items")
//         .insert({

//           user_id:
//             req.user.id,

//           variant_id,

//           quantity

//         });


//       if (error) {

//         console.error(error);


//         return res
//           .status(500)
//           .json({

//             success: false,

//             message:
//               "Unable to add item to cart"

//           });

//       }

//     }


//     return res
//       .status(201)
//       .json({

//         success: true,

//         message:
//           "Item added to cart"

//       });


//   } catch (error) {

//     console.error(
//       "ADD CART ERROR:",
//       error
//     );


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
// | UPDATE QUANTITY
// |--------------------------------------------------------------------------
// |
// | PATCH /api/cart/items/:variantId
// |
// */

// export async function updateCartItem(
//   req,
//   res
// ) {

//   try {

//     const validation =
//       updateCartItemSchema.safeParse(
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
//             "Invalid quantity"

//         });

//     }


//     const variantId =
//       req.params.variantId;


//     const {
//       quantity
//     } = validation.data;


//     /*
//     |--------------------------------------------------------------------------
//     | Verify current stock
//     |--------------------------------------------------------------------------
//     */

//     const {
//       data: variant,
//       error: variantError
//     } = await supabase
//       .from(
//         "product_variants"
//       )
//       .select(`
//         id,
//         quantity,
//         is_active,

//         product:products (
//           id,
//           is_active
//         )
//       `)
//       .eq(
//         "id",
//         variantId
//       )
//       .maybeSingle();


//     if (
//       variantError ||
//       !variant
//     ) {

//       return res
//         .status(404)
//         .json({

//           success: false,

//           message:
//             "Product variant not found"

//         });

//     }


//     if (
//       !variant.is_active ||
//       !variant.product
//         ?.is_active
//     ) {

//       return res
//         .status(409)
//         .json({

//           success: false,

//           message:
//             "This product is no longer available"

//         });

//     }


//     if (
//       quantity >
//       Number(
//         variant.quantity
//       )
//     ) {

//       return res
//         .status(409)
//         .json({

//           success: false,

//           message:
//             `Only ${variant.quantity} item(s) available`

//         });

//     }


//     const {
//       data,
//       error
//     } = await supabase
//       .from("cart_items")
//       .update({
//         quantity
//       })
//       .eq(
//         "user_id",
//         req.user.id
//       )
//       .eq(
//         "variant_id",
//         variantId
//       )
//       .select("id")
//       .maybeSingle();


//     if (error) {

//       console.error(error);


//       return res
//         .status(500)
//         .json({

//           success: false,

//           message:
//             "Unable to update cart"

//         });

//     }


//     if (!data) {

//       return res
//         .status(404)
//         .json({

//           success: false,

//           message:
//             "Cart item not found"

//         });

//     }


//     return res.json({

//       success: true,

//       message:
//         "Cart updated"

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


// /*
// |--------------------------------------------------------------------------
// | DELETE ITEM
// |--------------------------------------------------------------------------
// |
// | DELETE /api/cart/items/:variantId
// |
// */

// export async function deleteCartItem(
//   req,
//   res
// ) {

//   try {

//     const {
//       error
//     } = await supabase
//       .from("cart_items")
//       .delete()
//       .eq(
//         "user_id",
//         req.user.id
//       )
//       .eq(
//         "variant_id",
//         req.params.variantId
//       );


//     if (error) {

//       console.error(error);


//       return res
//         .status(500)
//         .json({

//           success: false,

//           message:
//             "Unable to remove cart item"

//         });

//     }


//     return res.json({

//       success: true,

//       message:
//         "Item removed from cart"

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


// /*
// |--------------------------------------------------------------------------
// | CLEAR CART
// |--------------------------------------------------------------------------
// |
// | DELETE /api/cart
// |
// */

// export async function clearCart(
//   req,
//   res
// ) {

//   try {

//     const {
//       error
//     } = await supabase
//       .from("cart_items")
//       .delete()
//       .eq(
//         "user_id",
//         req.user.id
//       );


//     if (error) {

//       console.error(error);


//       return res
//         .status(500)
//         .json({

//           success: false,

//           message:
//             "Unable to clear cart"

//         });

//     }


//     return res.json({

//       success: true,

//       message:
//         "Cart cleared"

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
  addCartItemSchema,
  updateCartItemSchema
} from "../validators/cartValidator.js";


/*
|--------------------------------------------------------------------------
| Convert DB Cart to Frontend Format
|--------------------------------------------------------------------------
*/

function formatCartItems(
  rows = []
) {

  return rows.map(
    row => {

      const variant =
        row.variant;


      const product =
        variant?.product;


      const images =
        [
          ...(product?.images || [])
        ].sort(
          (a, b) =>
            a.display_order -
            b.display_order
        );


      return {

        id:
          row.id,

        variantId:
          variant?.id,

        productId:
          product?.id,

        productName:
          product?.name,

        price:
          Number(
            product?.price ||
            0
          ),

        image:
          images[0]
            ?.public_url ||
          "",

        sku:
          variant?.sku,

        colorName:
          variant?.color_name,

        colorHex:
          variant?.color_hex,

        size:
          variant?.size,

        quantity:
          Number(
            row.quantity
          ),

        availableStock:
          Number(
            variant?.quantity ||
            0
          ),

        productActive:
          Boolean(
            product?.is_active
          ),

        variantActive:
          Boolean(
            variant?.is_active
          )

      };

    }
  );

}


/*
|--------------------------------------------------------------------------
| READ CART
|--------------------------------------------------------------------------
|
| GET /api/cart
|
*/

export async function getCart(
  req,
  res
) {

  try {

    const {
      data,
      error
    } = await supabase
      .from("cart_items")
      .select(`
        id,
        quantity,
        created_at,
        updated_at,

        variant:product_variants (
          id,
          sku,
          color_name,
          color_hex,
          size,
          quantity,
          is_active,

          product:products (
            id,
            name,
            price,
            is_active,

            images:product_images (
              id,
              public_url,
              alt_text,
              display_order
            )
          )
        )
      `)
      .eq(
        "user_id",
        req.user.id
      )
      .order(
        "created_at",
        {
          ascending: true
        }
      );


    if (error) {

      console.error(
        "GET CART DATABASE ERROR:",
        error
      );


      return res
        .status(500)
        .json({

          success: false,

          message:
            "Unable to retrieve cart"

        });

    }


    const cart =
      formatCartItems(
        data || []
      );


    const subtotal =
      cart.reduce(
        (
          total,
          item
        ) =>

          total +
          (
            item.price *
            item.quantity
          ),

        0
      );


    const count =
      cart.reduce(
        (
          total,
          item
        ) =>

          total +
          item.quantity,

        0
      );


    return res
      .status(200)
      .json({

        success: true,

        cart,

        subtotal,

        count

      });


  } catch (error) {

    console.error(
      "GET CART ERROR:",
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
| CREATE CART ITEM
|--------------------------------------------------------------------------
|
| POST /api/cart/items
|
*/

export async function addCartItem(
  req,
  res
) {

  try {

    const validation =
      addCartItemSchema.safeParse(
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
            "Invalid cart item",

          errors:
            validation
              .error
              .issues

        });

    }


    const {
      variant_id,
      quantity
    } = validation.data;


    /*
    |--------------------------------------------------------------------------
    | Check Variant + Product
    |--------------------------------------------------------------------------
    */

    const {
      data: variant,
      error: variantError
    } = await supabase
      .from(
        "product_variants"
      )
      .select(`
        id,
        quantity,
        is_active,

        product:products (
          id,
          name,
          is_active
        )
      `)
      .eq(
        "id",
        variant_id
      )
      .maybeSingle();


    if (variantError) {

      console.error(
        "VARIANT CHECK ERROR:",
        variantError
      );


      return res
        .status(500)
        .json({

          success: false,

          message:
            "Unable to check product"

        });

    }


    if (
      !variant ||
      !variant.is_active ||
      !variant.product
        ?.is_active
    ) {

      return res
        .status(404)
        .json({

          success: false,

          message:
            "Product is no longer available"

        });

    }


    const stock =
      Number(
        variant.quantity
      );


    if (
      stock <= 0
    ) {

      return res
        .status(409)
        .json({

          success: false,

          message:
            "This item is out of stock"

        });

    }


    /*
    |--------------------------------------------------------------------------
    | Check Existing Cart Row
    |--------------------------------------------------------------------------
    */

    const {
      data: existing,
      error: existingError
    } = await supabase
      .from("cart_items")
      .select(`
        id,
        quantity
      `)
      .eq(
        "user_id",
        req.user.id
      )
      .eq(
        "variant_id",
        variant_id
      )
      .maybeSingle();


    if (existingError) {

      console.error(
        existingError
      );


      return res
        .status(500)
        .json({

          success: false,

          message:
            "Unable to update cart"

        });

    }


    const existingQuantity =
      existing
        ? Number(
            existing.quantity
          )
        : 0;


    const requestedQuantity =
      existingQuantity +
      Number(quantity);


    /*
    |--------------------------------------------------------------------------
    | Stock Check
    |--------------------------------------------------------------------------
    */

    if (
      requestedQuantity >
      stock
    ) {

      return res
        .status(409)
        .json({

          success: false,

          message:
            `Only ${stock} item(s) are currently available`

        });

    }


    if (
      requestedQuantity >
      20
    ) {

      return res
        .status(400)
        .json({

          success: false,

          message:
            "Maximum quantity per variant is 20"

        });

    }


    /*
    |--------------------------------------------------------------------------
    | Existing Row → Update
    |--------------------------------------------------------------------------
    */

    if (existing) {

      const {
        error
      } = await supabase
        .from("cart_items")
        .update({

          quantity:
            requestedQuantity

        })
        .eq(
          "id",
          existing.id
        )
        .eq(
          "user_id",
          req.user.id
        );


      if (error) {

        console.error(
          "CART UPDATE ERROR:",
          error
        );


        return res
          .status(500)
          .json({

            success: false,

            message:
              "Unable to update cart"

          });

      }

    }

    /*
    |--------------------------------------------------------------------------
    | New Row → Insert
    |--------------------------------------------------------------------------
    */

    else {

      const {
        error
      } = await supabase
        .from("cart_items")
        .insert({

          user_id:
            req.user.id,

          variant_id,

          quantity:
            Number(quantity)

        });


      if (error) {

        console.error(
          "CART INSERT ERROR:",
          error
        );


        return res
          .status(500)
          .json({

            success: false,

            message:
              "Unable to add item to cart"

          });

      }

    }


    return res
      .status(201)
      .json({

        success: true,

        message:
          "Item added to cart"

      });


  } catch (error) {

    console.error(
      "ADD CART ERROR:",
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
| UPDATE CART QUANTITY
|--------------------------------------------------------------------------
|
| PATCH /api/cart/items/:variantId
|
*/

export async function updateCartItem(
  req,
  res
) {

  try {

    const validation =
      updateCartItemSchema.safeParse(
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
            "Invalid quantity",

          errors:
            validation
              .error
              .issues

        });

    }


    const variantId =
      req.params.variantId;


    const {
      quantity
    } = validation.data;


    /*
    |--------------------------------------------------------------------------
    | Verify Current Stock
    |--------------------------------------------------------------------------
    */

    const {
      data: variant,
      error: variantError
    } = await supabase
      .from(
        "product_variants"
      )
      .select(`
        id,
        quantity,
        is_active,

        product:products (
          id,
          is_active
        )
      `)
      .eq(
        "id",
        variantId
      )
      .maybeSingle();


    if (
      variantError ||
      !variant
    ) {

      return res
        .status(404)
        .json({

          success: false,

          message:
            "Product variant not found"

        });

    }


    if (
      !variant.is_active ||
      !variant.product
        ?.is_active
    ) {

      return res
        .status(409)
        .json({

          success: false,

          message:
            "This product is no longer available"

        });

    }


    if (
      Number(quantity) >
      Number(
        variant.quantity
      )
    ) {

      return res
        .status(409)
        .json({

          success: false,

          message:
            `Only ${variant.quantity} item(s) available`

        });

    }


    /*
    |--------------------------------------------------------------------------
    | Update only current customer's row
    |--------------------------------------------------------------------------
    */

    const {
      data,
      error
    } = await supabase
      .from("cart_items")
      .update({

        quantity:
          Number(quantity)

      })
      .eq(
        "user_id",
        req.user.id
      )
      .eq(
        "variant_id",
        variantId
      )
      .select("id")
      .maybeSingle();


    if (error) {

      console.error(
        "UPDATE CART ERROR:",
        error
      );


      return res
        .status(500)
        .json({

          success: false,

          message:
            "Unable to update cart"

        });

    }


    if (!data) {

      return res
        .status(404)
        .json({

          success: false,

          message:
            "Cart item not found"

        });

    }


    return res.json({

      success: true,

      message:
        "Cart updated successfully"

    });


  } catch (error) {

    console.error(
      "UPDATE CART ERROR:",
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
| DELETE SINGLE CART ITEM
|--------------------------------------------------------------------------
|
| DELETE /api/cart/items/:variantId
|
*/

export async function deleteCartItem(
  req,
  res
) {

  try {

    const variantId =
      req.params.variantId;


    const {
      data,
      error
    } = await supabase
      .from("cart_items")
      .delete()
      .eq(
        "user_id",
        req.user.id
      )
      .eq(
        "variant_id",
        variantId
      )
      .select("id");


    if (error) {

      console.error(
        "DELETE CART ITEM ERROR:",
        error
      );


      return res
        .status(500)
        .json({

          success: false,

          message:
            "Unable to remove cart item"

        });

    }


    if (
      !data ||
      data.length === 0
    ) {

      return res
        .status(404)
        .json({

          success: false,

          message:
            "Cart item not found"

        });

    }


    return res.json({

      success: true,

      message:
        "Item removed from cart"

    });


  } catch (error) {

    console.error(
      "DELETE CART ERROR:",
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
| CLEAR ENTIRE CART
|--------------------------------------------------------------------------
|
| DELETE /api/cart
|
*/

export async function clearCart(
  req,
  res
) {

  try {

    const {
      error
    } = await supabase
      .from("cart_items")
      .delete()
      .eq(
        "user_id",
        req.user.id
      );


    if (error) {

      console.error(
        "CLEAR CART ERROR:",
        error
      );


      return res
        .status(500)
        .json({

          success: false,

          message:
            "Unable to clear cart"

        });

    }


    return res.json({

      success: true,

      message:
        "Cart cleared successfully"

    });


  } catch (error) {

    console.error(
      "CLEAR CART ERROR:",
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