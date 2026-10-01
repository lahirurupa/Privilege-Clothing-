import {
  supabase
} from "../config/supabase.js";

import {
  variantSchema,
  updateVariantSchema
} from "../validators/productValidator.js";


/*
|--------------------------------------------------------------------------
| CREATE VARIANT
|--------------------------------------------------------------------------
*/

export async function createVariant(
  req,
  res
) {

  try {

    const validation =
      variantSchema.safeParse(
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


    const productId =
      req.params.productId;


    /*
    |--------------------------------------------------------------------------
    | Check product
    |--------------------------------------------------------------------------
    */

    const {
      data: product
    } = await supabase
      .from("products")
      .select("id")
      .eq(
        "id",
        productId
      )
      .maybeSingle();


    if (!product) {

      return res.status(404).json({
        success: false,
        message:
          "Product not found"
      });

    }


    const variant =
      validation.data;


    const {
      data,
      error
    } = await supabase
      .from("product_variants")
      .insert({

        product_id:
          productId,

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
      .select()
      .single();


    if (error) {

      console.error(
        "CREATE VARIANT ERROR:",
        error
      );


      if (
        error.code === "23505"
      ) {

        return res.status(409).json({
          success: false,
          message:
            "SKU or color/size combination already exists"
        });

      }


      return res.status(500).json({
        success: false,
        message:
          "Unable to create variant"
      });

    }


    return res.status(201).json({

      success: true,

      message:
        "Variant created successfully",

      variant: data

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
| UPDATE VARIANT
|--------------------------------------------------------------------------
*/

export async function updateVariant(
  req,
  res
) {

  try {

    const validation =
      updateVariantSchema.safeParse(
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


    const {
      productId,
      variantId
    } = req.params;


    const updates = {
      ...validation.data
    };


    if (updates.sku) {

      updates.sku =
        updates.sku
          .trim()
          .toUpperCase();

    }


    if (updates.size) {

      updates.size =
        updates.size
          .trim()
          .toUpperCase();

    }


    if (updates.color_name) {

      updates.color_name =
        updates.color_name.trim();

    }


    const {
      data,
      error
    } = await supabase
      .from("product_variants")
      .update(updates)
      .eq(
        "id",
        variantId
      )
      .eq(
        "product_id",
        productId
      )
      .select()
      .maybeSingle();


    if (error) {

      console.error(
        "UPDATE VARIANT ERROR:",
        error
      );


      if (
        error.code === "23505"
      ) {

        return res.status(409).json({
          success: false,
          message:
            "SKU or color/size combination already exists"
        });

      }


      return res.status(500).json({
        success: false,
        message:
          "Unable to update variant"
      });

    }


    if (!data) {

      return res.status(404).json({
        success: false,
        message:
          "Variant not found"
      });

    }


    return res.status(200).json({

      success: true,

      message:
        "Variant updated successfully",

      variant: data

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
| DELETE VARIANT
|--------------------------------------------------------------------------
*/

export async function deleteVariant(
  req,
  res
) {

  try {

    const {
      productId,
      variantId
    } = req.params;


    /*
    |--------------------------------------------------------------------------
    | Find variant first
    |--------------------------------------------------------------------------
    */

    const {
      data: variant,
      error: findError
    } = await supabase
      .from("product_variants")
      .select("id, sku")
      .eq(
        "id",
        variantId
      )
      .eq(
        "product_id",
        productId
      )
      .maybeSingle();


    if (findError) {

      return res.status(500).json({
        success: false,
        message:
          "Unable to find variant"
      });

    }


    if (!variant) {

      return res.status(404).json({
        success: false,
        message:
          "Variant not found"
      });

    }


    const {
      error
    } = await supabase
      .from("product_variants")
      .delete()
      .eq(
        "id",
        variantId
      )
      .eq(
        "product_id",
        productId
      );


    if (error) {

      console.error(error);

      return res.status(500).json({
        success: false,
        message:
          "Unable to delete variant"
      });

    }


    return res.status(200).json({

      success: true,

      message:
        "Variant deleted successfully"

    });


  } catch (error) {

    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Server error"
    });

  }

}