import * as z from "zod";


export const createCategorySchema =
  z.object({

    name:
      z
        .string()
        .trim()
        .min(
          2,
          "Category name must contain at least 2 characters"
        )
        .max(
          100,
          "Category name is too long"
        ),

    is_active:
      z
        .boolean()
        .optional()
        .default(true)

  });


export const updateCategorySchema =
  z
    .object({

      name:
        z
          .string()
          .trim()
          .min(
            2,
            "Category name must contain at least 2 characters"
          )
          .max(
            100,
            "Category name is too long"
          )
          .optional(),

      is_active:
        z
          .boolean()
          .optional()

    })
    .refine(
      data =>
        Object.keys(data).length >
        0,
      {
        message:
          "At least one field is required"
      }
    );