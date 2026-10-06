import {
  supabase
} from "../config/supabase.js";

import {
  createProductSchema,
  updateProductSchema
} from "../validators/productValidator.js";

import {
  createSlug
} from "../utils/createSlug.js";


/*
|--------------------------------------------------------------------------
| PRODUCT SELECT
|--------------------------------------------------------------------------
*/

const PRODUCT_SELECT = `

  id,
  name,
  slug,
  description,
  price,
  is_active,
  created_at,
  updated_at,

  category:categories (
    id,
    name,
    slug
  ),

  variants:product_variants (
    id,
    sku,
    color_name,
    color_hex,
    size,
    quantity,
    is_active,
    created_at,
    updated_at
  ),

  images:product_images (
    id,
    public_url,
    alt_text,
    display_order
  )

`;


/*
|--------------------------------------------------------------------------
| PUBLIC - GET PRODUCTS
|--------------------------------------------------------------------------
|
| Customers only see active products.
|
*/

// export async function getProducts(
//   req,
//   res
// ) {

//   try {

//     const page =
//       Math.max(
//         Number(req.query.page) || 1,
//         1
//       );

//     const limit =
//       Math.min(
//         Math.max(
//           Number(req.query.limit) || 20,
//           1
//         ),
//         50
//       );


//     const from =
//       (page - 1) * limit;

//     const to =
//       from + limit - 1;


//     let query = supabase
//       .from("products")
//       .select(
//         PRODUCT_SELECT,
//         {
//           count: "exact"
//         }
//       )
//       .eq("is_active", true)
//       .order(
//         "created_at",
//         {
//           ascending: false
//         }
//       )
//       .range(from, to);


//     /*
//     |--------------------------------------------------------------------------
//     | Search
//     |--------------------------------------------------------------------------
//     */

//     if (req.query.search) {

//       query = query.ilike(
//         "name",
//         `%${req.query.search}%`
//       );

//     }


//     /*
//     |--------------------------------------------------------------------------
//     | Category filter
//     |--------------------------------------------------------------------------
//     */

//     if (req.query.category_id) {

//       query = query.eq(
//         "category_id",
//         req.query.category_id
//       );

//     }


//     const {
//       data,
//       error,
//       count
//     } = await query;


//     if (error) {

//       console.error(
//         "GET PRODUCTS ERROR:",
//         error
//       );

//       return res.status(500).json({
//         success: false,
//         message:
//           "Unable to retrieve products"
//       });

//     }


//     /*
//     |--------------------------------------------------------------------------
//     | Hide inactive variants
//     |--------------------------------------------------------------------------
//     */

//     const products =
//       data.map(product => ({

//         ...product,

//         variants:
//           product.variants.filter(
//             variant =>
//               variant.is_active
//           )

//       }));


//     return res.status(200).json({

//       success: true,

//       pagination: {
//         page,
//         limit,
//         total: count,
//         pages:
//           Math.ceil(
//             count / limit
//           )
//       },

//       products

//     });


//   } catch (error) {

//     console.error(
//       "GET PRODUCTS ERROR:",
//       error
//     );

//     return res.status(500).json({
//       success: false,
//       message: "Server error"
//     });

//   }

// }

export async function getProducts(
  req,
  res,
  next
) {

  try {

    /*
    |--------------------------------------------------------------------------
    | Pagination
    |--------------------------------------------------------------------------
    */

    const page =
      Math.max(
        parseInt(
          req.query.page
        ) || 1,
        1
      );


    const limit =
      Math.min(
        Math.max(
          parseInt(
            req.query.limit
          ) || 20,
          1
        ),
        50
      );


    const from =
      (page - 1) *
      limit;


    const to =
      from +
      limit -
      1;


    /*
    |--------------------------------------------------------------------------
    | Optional Filters
    |--------------------------------------------------------------------------
    */

    const search =
      req.query.search
        ?.trim() || "";


    const categoryId =
      req.query.category_id
        ?.trim() || "";


    /*
    |--------------------------------------------------------------------------
    | Public Products Query
    |--------------------------------------------------------------------------
    |
    | IMPORTANT:
    | Newest products appear first.
    |
    */

    let query =
      supabase
        .from("products")
        .select(
          PRODUCT_SELECT,
          {
            count: "exact"
          }
        )
        .eq(
          "is_active",
          true
        )
        .order(
          "created_at",
          {
            ascending: false
          }
        );


    /*
    |--------------------------------------------------------------------------
    | Search
    |--------------------------------------------------------------------------
    */

    if (search) {

      query =
        query.ilike(
          "name",
          `%${search}%`
        );

    }


    /*
    |--------------------------------------------------------------------------
    | Category
    |--------------------------------------------------------------------------
    */

    if (categoryId) {

      query =
        query.eq(
          "category_id",
          categoryId
        );

    }


    /*
    |--------------------------------------------------------------------------
    | Pagination
    |--------------------------------------------------------------------------
    */

    query =
      query.range(
        from,
        to
      );


    /*
    |--------------------------------------------------------------------------
    | Execute
    |--------------------------------------------------------------------------
    */

    const {
      data,
      error,
      count
    } = await query;


    if (error) {

      throw error;

    }


    /*
    |--------------------------------------------------------------------------
    | Remove inactive variants from public response
    |--------------------------------------------------------------------------
    */

    const products =
      (
        data || []
      ).map(
        product => ({

          ...product,

          variants:
            (
              product.variants ||
              []
            ).filter(
              variant =>
                variant.is_active
            ),

          images:
            [
              ...(product.images || [])
            ].sort(
              (a, b) =>
                Number(
                  a.display_order
                ) -
                Number(
                  b.display_order
                )
            )

        })
      );


    /*
    |--------------------------------------------------------------------------
    | Response
    |--------------------------------------------------------------------------
    */

    return res
      .status(200)
      .json({

        success: true,

        products,

        pagination: {

          page,

          limit,

          total:
            count || 0,

          pages:
            Math.ceil(
              (count || 0) /
              limit
            )

        }

      });


  } catch (error) {

    next(error);

  }

}

/*
|--------------------------------------------------------------------------
| PUBLIC - GET ONE PRODUCT
|--------------------------------------------------------------------------
*/

export async function getProduct(
  req,
  res
) {

  try {

    const {
      data: product,
      error
    } = await supabase
      .from("products")
      .select(PRODUCT_SELECT)
      .eq(
        "id",
        req.params.id
      )
      .eq(
        "is_active",
        true
      )
      .maybeSingle();


    if (error) {

      console.error(error);

      return res.status(500).json({
        success: false,
        message:
          "Unable to retrieve product"
      });

    }


    if (!product) {

      return res.status(404).json({
        success: false,
        message:
          "Product not found"
      });

    }


    product.variants =
      product.variants.filter(
        variant =>
          variant.is_active
      );


    return res.status(200).json({

      success: true,

      product

    });


  } catch (error) {

    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Server error"
    });

  }

}


/*
|--------------------------------------------------------------------------
| ADMIN - GET ALL PRODUCTS
|--------------------------------------------------------------------------
|
| Admin sees active AND inactive products.
|
*/

export async function getAdminProducts(
  req,
  res
) {

  try {

    const {
      data,
      error
    } = await supabase
      .from("products")
      .select(PRODUCT_SELECT)
      .order(
        "created_at",
        {
          ascending: false
        }
      );


    if (error) {

      console.error(error);

      return res.status(500).json({
        success: false,
        message:
          "Unable to retrieve products"
      });

    }


    return res.status(200).json({

      success: true,

      products: data

    });


  } catch (error) {

    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Server error"
    });

  }

}


/*
|--------------------------------------------------------------------------
| ADMIN - GET ONE PRODUCT
|--------------------------------------------------------------------------
*/

export async function getAdminProduct(
  req,
  res
) {

  try {

    const {
      data,
      error
    } = await supabase
      .from("products")
      .select(PRODUCT_SELECT)
      .eq(
        "id",
        req.params.id
      )
      .maybeSingle();


    if (error) {

      console.error(error);

      return res.status(500).json({
        success: false,
        message:
          "Unable to retrieve product"
      });

    }


    if (!data) {

      return res.status(404).json({
        success: false,
        message:
          "Product not found"
      });

    }


    return res.status(200).json({

      success: true,

      product: data

    });


  } catch (error) {

    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Server error"
    });

  }

}


/*
|--------------------------------------------------------------------------
| ADMIN - CREATE PRODUCT
|--------------------------------------------------------------------------
*/

export async function createProduct(
  req,
  res
) {

  try {

    const validation =
      createProductSchema.safeParse(
        req.body
      );


    if (!validation.success) {

      return res.status(400).json({

        success: false,

        message:
          "Validation failed",

        errors:
          validation.error.issues

      });

    }


    const {
      name,
      description,
      category_id,
      price,
      is_active,
      variants
    } = validation.data;


    /*
    |--------------------------------------------------------------------------
    | Verify category
    |--------------------------------------------------------------------------
    */

    const {
      data: category,
      error: categoryError
    } = await supabase
      .from("categories")
      .select(
        "id, name, is_active"
      )
      .eq(
        "id",
        category_id
      )
      .maybeSingle();


    if (categoryError) {

      console.error(
        categoryError
      );

      return res.status(500).json({
        success: false,
        message:
          "Unable to validate category"
      });

    }


    if (!category) {

      return res.status(400).json({
        success: false,
        message:
          "Selected category does not exist"
      });

    }


    /*
    |--------------------------------------------------------------------------
    | Create product
    |--------------------------------------------------------------------------
    */

    const slug =
      createSlug(name);


    const {
      data: product,
      error: productError
    } = await supabase
      .from("products")
      .insert({

        name:
          name.trim(),

        slug,

        description,

        category_id,

        price,

        is_active

      })
      .select("id")
      .single();


    if (productError) {

      console.error(
        "PRODUCT INSERT ERROR:",
        productError
      );

      return res.status(500).json({
        success: false,
        message:
          "Unable to create product"
      });

    }


    /*
    |--------------------------------------------------------------------------
    | Prepare variants
    |--------------------------------------------------------------------------
    */

    const variantRows =
      variants.map(
        variant => ({

          product_id:
            product.id,

          sku:
            variant.sku
              .trim()
              .toUpperCase(),

          color_name:
            variant.color_name.trim(),

          color_hex:
            variant.color_hex || null,

          size:
            variant.size
              .trim()
              .toUpperCase(),

          quantity:
            variant.quantity,

          is_active:
            variant.is_active

        })
      );


    /*
    |--------------------------------------------------------------------------
    | Insert variants
    |--------------------------------------------------------------------------
    */

    const {
      error: variantError
    } = await supabase
      .from("product_variants")
      .insert(
        variantRows
      );


    if (variantError) {

      console.error(
        "VARIANT INSERT ERROR:",
        variantError
      );


      /*
      |--------------------------------------------------------------------------
      | Cleanup product if variants fail
      |--------------------------------------------------------------------------
      */

      await supabase
        .from("products")
        .delete()
        .eq(
          "id",
          product.id
        );


      if (
        variantError.code ===
        "23505"
      ) {

        return res.status(409).json({
          success: false,
          message:
            "Duplicate SKU or duplicate color/size combination"
        });

      }


      return res.status(500).json({
        success: false,
        message:
          "Unable to create product variants"
      });

    }


    /*
    |--------------------------------------------------------------------------
    | Get complete product
    |--------------------------------------------------------------------------
    */

    const {
      data: completeProduct,
      error: fetchError
    } = await supabase
      .from("products")
      .select(PRODUCT_SELECT)
      .eq(
        "id",
        product.id
      )
      .single();


    if (fetchError) {

      console.error(
        fetchError
      );

    }


    return res.status(201).json({

      success: true,

      message:
        "Product created successfully",

      product:
        completeProduct || {
          id: product.id
        }

    });


  } catch (error) {

    console.error(
      "CREATE PRODUCT ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Server error"
    });

  }

}


/*
|--------------------------------------------------------------------------
| ADMIN - UPDATE PRODUCT
|--------------------------------------------------------------------------
*/

export async function updateProduct(
  req,
  res
) {

  try {

    const validation =
      updateProductSchema.safeParse(
        req.body
      );


    if (!validation.success) {

      return res.status(400).json({

        success: false,

        message:
          "Validation failed",

        errors:
          validation.error.issues

      });

    }


    if (
      Object.keys(
        validation.data
      ).length === 0
    ) {

      return res.status(400).json({
        success: false,
        message:
          "No update fields provided"
      });

    }


    const productId =
      req.params.id;


    /*
    |--------------------------------------------------------------------------
    | Check product exists
    |--------------------------------------------------------------------------
    */

    const {
      data: existingProduct,
      error: checkError
    } = await supabase
      .from("products")
      .select("id")
      .eq(
        "id",
        productId
      )
      .maybeSingle();


    if (checkError) {

      return res.status(500).json({
        success: false,
        message:
          "Unable to check product"
      });

    }


    if (!existingProduct) {

      return res.status(404).json({
        success: false,
        message:
          "Product not found"
      });

    }


    const updates = {
      ...validation.data
    };


    /*
    |--------------------------------------------------------------------------
    | Generate new slug if product name changes
    |--------------------------------------------------------------------------
    */

    if (updates.name) {

      updates.name =
        updates.name.trim();

      updates.slug =
        createSlug(
          updates.name
        );

    }


    /*
    |--------------------------------------------------------------------------
    | Verify category
    |--------------------------------------------------------------------------
    */

    if (
      updates.category_id
    ) {

      const {
        data: category
      } = await supabase
        .from("categories")
        .select("id")
        .eq(
          "id",
          updates.category_id
        )
        .maybeSingle();


      if (!category) {

        return res.status(400).json({
          success: false,
          message:
            "Selected category does not exist"
        });

      }

    }


    const {
      data,
      error
    } = await supabase
      .from("products")
      .update(updates)
      .eq(
        "id",
        productId
      )
      .select(PRODUCT_SELECT)
      .single();


    if (error) {

      console.error(
        "UPDATE PRODUCT ERROR:",
        error
      );

      return res.status(500).json({
        success: false,
        message:
          "Unable to update product"
      });

    }


    return res.status(200).json({

      success: true,

      message:
        "Product updated successfully",

      product: data

    });


  } catch (error) {

    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Server error"
    });

  }

}


/*
|--------------------------------------------------------------------------
| ADMIN - DELETE PRODUCT
|--------------------------------------------------------------------------
*/

export async function deleteProduct(
  req,
  res
) {

  try {

    const productId =
      req.params.id;


    /*
    |--------------------------------------------------------------------------
    | Find product
    |--------------------------------------------------------------------------
    */

    const {
      data: product,
      error: findError
    } = await supabase
      .from("products")
      .select(
        "id, name"
      )
      .eq(
        "id",
        productId
      )
      .maybeSingle();


    if (findError) {

      console.error(
        findError
      );

      return res.status(500).json({
        success: false,
        message:
          "Unable to find product"
      });

    }


    if (!product) {

      return res.status(404).json({
        success: false,
        message:
          "Product not found"
      });

    }


    /*
    |--------------------------------------------------------------------------
    | Get Storage paths
    |--------------------------------------------------------------------------
    */

    const {
      data: images,
      error: imageError
    } = await supabase
      .from(
        "product_images"
      )
      .select(
        "storage_path"
      )
      .eq(
        "product_id",
        productId
      );


    if (imageError) {

      console.error(
        imageError
      );

      return res.status(500).json({
        success: false,
        message:
          "Unable to retrieve product images"
      });

    }


    /*
    |--------------------------------------------------------------------------
    | Remove Storage images
    |--------------------------------------------------------------------------
    */

    if (
      images &&
      images.length > 0
    ) {

      const paths =
        images.map(
          image =>
            image.storage_path
        );


      const {
        error: storageError
      } = await supabase
        .storage
        .from(
          "product-images"
        )
        .remove(paths);


      if (storageError) {

        console.error(
          "PRODUCT STORAGE CLEANUP ERROR:",
          storageError
        );

        return res.status(500).json({
          success: false,
          message:
            "Unable to remove product images"
        });

      }

    }


    /*
    |--------------------------------------------------------------------------
    | Delete product
    |--------------------------------------------------------------------------
    |
    | PostgreSQL CASCADE deletes:
    |
    | product_variants
    | product_images
    |
    */

    const {
      error: deleteError
    } = await supabase
      .from("products")
      .delete()
      .eq(
        "id",
        productId
      );


    if (deleteError) {

      console.error(
        deleteError
      );

      return res.status(500).json({
        success: false,
        message:
          "Unable to delete product"
      });

    }


    return res.status(200).json({

      success: true,

      message:
        "Product deleted successfully"

    });


  } catch (error) {

    console.error(
      "DELETE PRODUCT ERROR:",
      error
    );


    return res.status(500).json({

      success: false,

      message:
        "Server error"

    });

  }

}