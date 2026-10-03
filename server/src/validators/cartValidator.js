// import * as z from "zod";


// export const addCartItemSchema =
//   z.object({

//     variant_id:
//       z.uuid(
//         "Invalid product variant"
//       ),

//     quantity:
//       z.coerce
//         .number()
//         .int()
//         .min(1)
//         .max(20)
//         .default(1)

//   });


// export const updateCartItemSchema =
//   z.object({

//     quantity:
//       z.coerce
//         .number()
//         .int()
//         .min(1)
//         .max(20)

//   });




import * as z from "zod";


export const addCartItemSchema =
  z.object({

    variant_id:
      z.uuid(
        "Invalid product variant"
      ),

    quantity:
      z.coerce
        .number()
        .int()
        .min(1)
        .max(20)
        .default(1)

  });


export const updateCartItemSchema =
  z.object({

    quantity:
      z.coerce
        .number()
        .int()
        .min(1)
        .max(20)

  });