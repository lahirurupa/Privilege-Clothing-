// import * as z from "zod";


// export const createOrderSchema =
//   z.object({

//     customer_name:
//       z
//         .string()
//         .trim()
//         .min(2)
//         .max(120),

//     phone:
//       z
//         .string()
//         .trim()
//         .min(
//           7,
//           "Phone number is required"
//         )
//         .max(30),

//     address_line1:
//       z
//         .string()
//         .trim()
//         .min(
//           5,
//           "Address is required"
//         )
//         .max(255),

//     address_line2:
//       z
//         .string()
//         .trim()
//         .max(255)
//         .optional()
//         .default(""),

//     city:
//       z
//         .string()
//         .trim()
//         .min(2)
//         .max(100),

//     postal_code:
//       z
//         .string()
//         .trim()
//         .max(20)
//         .optional()
//         .default(""),

//     items:
//       z
//         .array(

//           z.object({

//             variant_id:
//               z.uuid(),

//             quantity:
//               z.coerce
//                 .number()
//                 .int()
//                 .min(1)
//                 .max(20)

//           })

//         )
//         .min(1)
//         .max(50)

//   });





import * as z from "zod";


export const createOrderSchema =
  z.object({

    customer_name:
      z
        .string()
        .trim()
        .min(
          2,
          "Customer name is required"
        )
        .max(120),

    phone:
      z
        .string()
        .trim()
        .min(
          7,
          "Phone number is required"
        )
        .max(30),

    address_line1:
      z
        .string()
        .trim()
        .min(
          5,
          "Address is required"
        )
        .max(255),

    address_line2:
      z
        .string()
        .trim()
        .max(255)
        .optional()
        .default(""),

    city:
      z
        .string()
        .trim()
        .min(
          2,
          "City is required"
        )
        .max(100),

    postal_code:
      z
        .string()
        .trim()
        .max(20)
        .optional()
        .default("")

  });