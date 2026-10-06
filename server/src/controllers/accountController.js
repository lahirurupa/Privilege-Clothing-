import {
  supabase
} from "../config/supabase.js";

import {
  updateCustomerProfileSchema
} from "../validators/customerProfileValidator.js";


const PROFILE_SELECT = `
  id,
  name,
  email,
  phone,
  address_line1,
  address_line2,
  city,
  postal_code,
  role,
  is_active,
  created_at,
  updated_at
`;


/*
|--------------------------------------------------------------------------
| GET CUSTOMER PROFILE
|--------------------------------------------------------------------------
|
| GET /api/account/profile
|
*/

export async function getCustomerProfile(
  req,
  res
) {

  try {

    const {
      data: profile,
      error
    } = await supabase
      .from("users")
      .select(
        PROFILE_SELECT
      )
      .eq(
        "id",
        req.user.id
      )
      .maybeSingle();


    if (error) {

      console.error(
        "GET CUSTOMER PROFILE ERROR:",
        error
      );


      return res
        .status(500)
        .json({

          success: false,

          message:
            "Unable to retrieve profile"

        });

    }


    if (!profile) {

      return res
        .status(404)
        .json({

          success: false,

          message:
            "Customer profile not found"

        });

    }


    return res.json({

      success: true,

      profile

    });


  } catch (error) {

    console.error(
      "GET CUSTOMER PROFILE ERROR:",
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
| UPDATE CUSTOMER PROFILE
|--------------------------------------------------------------------------
|
| PATCH /api/account/profile
|
*/

export async function updateCustomerProfile(
  req,
  res
) {

  try {

    const validation =
      updateCustomerProfileSchema.safeParse(
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


    const updates = {};


    /*
    |--------------------------------------------------------------------------
    | Name
    |--------------------------------------------------------------------------
    */

    if (
      data.name !==
      undefined
    ) {

      updates.name =
        data.name.trim();

    }


    /*
    |--------------------------------------------------------------------------
    | Optional profile fields
    |--------------------------------------------------------------------------
    |
    | Empty strings are stored as NULL.
    |
    */

    const nullableFields = [

      "phone",

      "address_line1",

      "address_line2",

      "city",

      "postal_code"

    ];


    for (
      const field of
      nullableFields
    ) {

      if (
        data[field] !==
        undefined
      ) {

        const value =
          data[field]
            ?.trim();


        updates[field] =
          value
            ? value
            : null;

      }

    }


    const {
      data: profile,
      error
    } = await supabase
      .from("users")
      .update(
        updates
      )
      .eq(
        "id",
        req.user.id
      )
      .select(
        PROFILE_SELECT
      )
      .single();


    if (error) {

      console.error(
        "UPDATE CUSTOMER PROFILE ERROR:",
        error
      );


      return res
        .status(500)
        .json({

          success: false,

          message:
            "Unable to update profile"

        });

    }


    return res.json({

      success: true,

      message:
        "Profile updated successfully",

      profile

    });


  } catch (error) {

    console.error(
      "UPDATE CUSTOMER PROFILE ERROR:",
      error
    );


    return res
      .status(500)
      .json({

        success: false,

        message:
          "Server error while updating profile"

      });

  }

}