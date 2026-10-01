import * as z from "zod";


/*
|--------------------------------------------------------------------------
| PRODUCT VARIANT
|--------------------------------------------------------------------------
*/

export const variantSchema = z.object({

  sku: z
    .string()
    .trim()
    .min(2, "SKU is required")
    .max(50, "SKU cannot exceed 50 characters"),

  color_name: z
    .string()
    .trim()
    .min(1, "Color is required")
    .max(50),

  color_hex: z
    .string()
    .regex(
      /^#[0-9A-Fa-f]{6}$/,
      "Color must be a valid HEX value such as #000000"
    )
    .optional()
    .nullable(),

  size: z
    .string()
    .trim()
    .min(1, "Size is required")
    .max(20),

  quantity: z.coerce
    .number()
    .int("Quantity must be a whole number")
    .min(0, "Quantity cannot be negative"),

  is_active: z
    .boolean()
    .default(true)

});


/*
|--------------------------------------------------------------------------
| CREATE PRODUCT
|--------------------------------------------------------------------------
*/

export const createProductSchema = z.object({

  name: z
    .string()
    .trim()
    .min(2, "Product name is required")
    .max(150),

  description: z
    .string()
    .trim()
    .max(5000)
    .optional()
    .default(""),

  category_id: z
    .uuid("Invalid category ID"),

  price: z.coerce
    .number()
    .min(0, "Price cannot be negative"),

  is_active: z
    .boolean()
    .default(true),

  variants: z
    .array(variantSchema)
    .min(
      1,
      "At least one product variant is required"
    )
    .max(
      100,
      "Too many variants"
    )

});


/*
|--------------------------------------------------------------------------
| UPDATE PRODUCT
|--------------------------------------------------------------------------
*/

export const updateProductSchema = z.object({

  name: z
    .string()
    .trim()
    .min(2)
    .max(150)
    .optional(),

  description: z
    .string()
    .trim()
    .max(5000)
    .optional(),

  category_id: z
    .uuid()
    .optional(),

  price: z.coerce
    .number()
    .min(0)
    .optional(),

  is_active: z
    .boolean()
    .optional()

});


/*
|--------------------------------------------------------------------------
| UPDATE VARIANT
|--------------------------------------------------------------------------
*/

export const updateVariantSchema =
  variantSchema.partial();