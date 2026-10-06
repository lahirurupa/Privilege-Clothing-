import * as z from "zod";


const optionalText = (
  maxLength
) =>
  z
    .string()
    .trim()
    .max(maxLength)
    .optional();


export const updateCustomerProfileSchema =
  z
    .object({

      name:
        z
          .string()
          .trim()
          .min(
            2,
            "Name must contain at least 2 characters"
          )
          .max(100)
          .optional(),

      phone:
        z
          .string()
          .trim()
          .max(30)
          .refine(
            value =>
              value === "" ||
              /^[0-9+\-\s()]+$/.test(
                value
              ),
            {
              message:
                "Invalid phone number"
            }
          )
          .optional(),

      address_line1:
        optionalText(
          255
        ),

      address_line2:
        optionalText(
          255
        ),

      city:
        optionalText(
          100
        ),

      postal_code:
        optionalText(
          20
        )

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