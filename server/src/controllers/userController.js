import {
  supabase
} from "../config/supabase.js";


/*
|--------------------------------------------------------------------------
| GET ALL USERS
|--------------------------------------------------------------------------
|
| Admin only
|
| GET /api/admin/users
|
*/

export async function getUsers(
  req,
  res
) {

  try {

    /*
    |--------------------------------------------------------------------------
    | Query Parameters
    |--------------------------------------------------------------------------
    */

    const search =
      req.query.search
        ?.trim() || "";


    const status =
      req.query.status ||
      "all";


    const role =
      req.query.role ||
      "all";


    /*
    |--------------------------------------------------------------------------
    | Base Query
    |--------------------------------------------------------------------------
    |
    | IMPORTANT:
    |
    | password_hash is intentionally NOT returned.
    |
    */

    let query =
      supabase
        .from("users")
        .select(`
          id,
          name,
          email,
          role,
          is_active,
          created_at,
          updated_at
        `)
        .order(
          "created_at",
          {
            ascending: false
          }
        );


    /*
    |--------------------------------------------------------------------------
    | Search by name or email
    |--------------------------------------------------------------------------
    */

    if (search) {

      query =
        query.or(
          `name.ilike.%${search}%,email.ilike.%${search}%`
        );

    }


    /*
    |--------------------------------------------------------------------------
    | Filter by Status
    |--------------------------------------------------------------------------
    */

    if (
      status === "active"
    ) {

      query =
        query.eq(
          "is_active",
          true
        );

    }


    if (
      status === "disabled"
    ) {

      query =
        query.eq(
          "is_active",
          false
        );

    }


    /*
    |--------------------------------------------------------------------------
    | Filter by Role
    |--------------------------------------------------------------------------
    */

    if (
      role === "customer" ||
      role === "admin"
    ) {

      query =
        query.eq(
          "role",
          role
        );

    }


    /*
    |--------------------------------------------------------------------------
    | Execute Query
    |--------------------------------------------------------------------------
    */

    const {
      data: users,
      error
    } = await query;


    if (error) {

      console.error(
        "GET USERS DATABASE ERROR:",
        error
      );


      return res
        .status(500)
        .json({

          success: false,

          message:
            "Unable to retrieve users"

        });

    }


    /*
    |--------------------------------------------------------------------------
    | Success
    |--------------------------------------------------------------------------
    */

    return res
      .status(200)
      .json({

        success: true,

        count:
          users?.length || 0,

        users:
          users || []

      });


  } catch (error) {

    console.error(
      "GET USERS ERROR:",
      error
    );


    return res
      .status(500)
      .json({

        success: false,

        message:
          "Server error while retrieving users"

      });

  }

}


/*
|--------------------------------------------------------------------------
| GET ONE USER
|--------------------------------------------------------------------------
|
| Admin only
|
| GET /api/admin/users/:id
|
*/

export async function getUser(
  req,
  res
) {

  try {

    const userId =
      req.params.id;


    /*
    |--------------------------------------------------------------------------
    | Find User
    |--------------------------------------------------------------------------
    */

    const {
      data: user,
      error
    } = await supabase
      .from("users")
      .select(`
        id,
        name,
        email,
        role,
        is_active,
        created_at,
        updated_at
      `)
      .eq(
        "id",
        userId
      )
      .maybeSingle();


    /*
    |--------------------------------------------------------------------------
    | Database Error
    |--------------------------------------------------------------------------
    */

    if (error) {

      console.error(
        "GET USER DATABASE ERROR:",
        error
      );


      return res
        .status(500)
        .json({

          success: false,

          message:
            "Unable to retrieve user"

        });

    }


    /*
    |--------------------------------------------------------------------------
    | User Not Found
    |--------------------------------------------------------------------------
    */

    if (!user) {

      return res
        .status(404)
        .json({

          success: false,

          message:
            "User not found"

        });

    }


    /*
    |--------------------------------------------------------------------------
    | Success
    |--------------------------------------------------------------------------
    */

    return res
      .status(200)
      .json({

        success: true,

        user

      });


  } catch (error) {

    console.error(
      "GET USER ERROR:",
      error
    );


    return res
      .status(500)
      .json({

        success: false,

        message:
          "Server error while retrieving user"

      });

  }

}


/*
|--------------------------------------------------------------------------
| ENABLE / DISABLE USER
|--------------------------------------------------------------------------
|
| Admin only
|
| PATCH /api/admin/users/:id/status
|
| Body:
|
| {
|   "is_active": false
| }
|
*/

export async function updateUserStatus(
  req,
  res
) {

  try {

    const userId =
      req.params.id;


    const {
      is_active
    } = req.body;


    /*
    |--------------------------------------------------------------------------
    | Validate Input
    |--------------------------------------------------------------------------
    */

    if (
      typeof is_active !==
      "boolean"
    ) {

      return res
        .status(400)
        .json({

          success: false,

          message:
            "is_active must be true or false"

        });

    }


    /*
    |--------------------------------------------------------------------------
    | Find Target User
    |--------------------------------------------------------------------------
    */

    const {
      data: targetUser,
      error: findError
    } = await supabase
      .from("users")
      .select(`
        id,
        name,
        email,
        role,
        is_active
      `)
      .eq(
        "id",
        userId
      )
      .maybeSingle();


    if (findError) {

      console.error(
        "FIND USER ERROR:",
        findError
      );


      return res
        .status(500)
        .json({

          success: false,

          message:
            "Unable to check user"

        });

    }


    /*
    |--------------------------------------------------------------------------
    | User Not Found
    |--------------------------------------------------------------------------
    */

    if (!targetUser) {

      return res
        .status(404)
        .json({

          success: false,

          message:
            "User not found"

        });

    }


    /*
    |--------------------------------------------------------------------------
    | Prevent Admin Disabling Own Account
    |--------------------------------------------------------------------------
    */

    if (
      req.user.id ===
        targetUser.id &&
      is_active === false
    ) {

      return res
        .status(400)
        .json({

          success: false,

          message:
            "You cannot disable your own administrator account."

        });

    }


    /*
    |--------------------------------------------------------------------------
    | Protect Other Admin Accounts
    |--------------------------------------------------------------------------
    |
    | For now we only use this page for customer account management.
    |
    | This prevents accidentally disabling another administrator.
    |
    */

    if (
      targetUser.role ===
        "admin" &&
      targetUser.id !==
        req.user.id
    ) {

      return res
        .status(403)
        .json({

          success: false,

          message:
            "Administrator accounts cannot be disabled from User Management."

        });

    }


    /*
    |--------------------------------------------------------------------------
    | Nothing Changed
    |--------------------------------------------------------------------------
    */

    if (
      targetUser.is_active ===
      is_active
    ) {

      return res
        .status(200)
        .json({

          success: true,

          message:
            is_active
              ? "User is already active"
              : "User is already disabled",

          user:
            targetUser

        });

    }


    /*
    |--------------------------------------------------------------------------
    | Update Status
    |--------------------------------------------------------------------------
    */

    const {
      data: updatedUser,
      error: updateError
    } = await supabase
      .from("users")
      .update({

        is_active

      })
      .eq(
        "id",
        userId
      )
      .select(`
        id,
        name,
        email,
        role,
        is_active,
        created_at,
        updated_at
      `)
      .single();


    if (updateError) {

      console.error(
        "UPDATE USER STATUS ERROR:",
        updateError
      );


      return res
        .status(500)
        .json({

          success: false,

          message:
            "Unable to update user status"

        });

    }


    /*
    |--------------------------------------------------------------------------
    | Success
    |--------------------------------------------------------------------------
    */

    return res
      .status(200)
      .json({

        success: true,

        message:
          is_active
            ? "User enabled successfully"
            : "User disabled successfully",

        user:
          updatedUser

      });


  } catch (error) {

    console.error(
      "UPDATE USER STATUS ERROR:",
      error
    );


    return res
      .status(500)
      .json({

        success: false,

        message:
          "Server error while updating user"

      });

  }

}






/*
|--------------------------------------------------------------------------
| CUSTOMER ORDER ACTIVITY REPORT
|--------------------------------------------------------------------------
|
| GET /api/admin/users/order-summary
|
| Examples:
|
| /api/admin/users/order-summary?min_orders=1
|
| /api/admin/users/order-summary?min_orders=5
|
| /api/admin/users/order-summary
|   ?min_orders=3
|   &from=2026-09-01T00:00:00.000Z
|   &to=2026-10-01T00:00:00.000Z
|
*/

export async function getCustomerOrderSummary(
  req,
  res
) {

  try {

    /*
    |--------------------------------------------------------------------------
    | Minimum Orders
    |--------------------------------------------------------------------------
    */

    const minOrders =
      Number.parseInt(
        req.query.min_orders ??
        "1",
        10
      );


    if (
      !Number.isInteger(
        minOrders
      ) ||
      minOrders < 0 ||
      minOrders > 100000
    ) {

      return res
        .status(400)
        .json({

          success: false,

          message:
            "min_orders must be a valid number greater than or equal to 0"

        });

    }


    /*
    |--------------------------------------------------------------------------
    | Date Range
    |--------------------------------------------------------------------------
    */

    const from =
      req.query.from
        ?.trim() ||
      null;


    const to =
      req.query.to
        ?.trim() ||
      null;


    let fromDate =
      null;


    let toDate =
      null;


    /*
    |--------------------------------------------------------------------------
    | Validate From
    |--------------------------------------------------------------------------
    */

    if (from) {

      fromDate =
        new Date(from);


      if (
        Number.isNaN(
          fromDate.getTime()
        )
      ) {

        return res
          .status(400)
          .json({

            success: false,

            message:
              "Invalid start date"

          });

      }

    }


    /*
    |--------------------------------------------------------------------------
    | Validate To
    |--------------------------------------------------------------------------
    */

    if (to) {

      toDate =
        new Date(to);


      if (
        Number.isNaN(
          toDate.getTime()
        )
      ) {

        return res
          .status(400)
          .json({

            success: false,

            message:
              "Invalid end date"

          });

      }

    }


    /*
    |--------------------------------------------------------------------------
    | Validate Date Order
    |--------------------------------------------------------------------------
    */

    if (
      fromDate &&
      toDate &&
      fromDate >=
        toDate
    ) {

      return res
        .status(400)
        .json({

          success: false,

          message:
            "End date must be after start date"

        });

    }


    /*
    |--------------------------------------------------------------------------
    | Run PostgreSQL Report
    |--------------------------------------------------------------------------
    */

    const {
      data,
      error
    } = await supabase.rpc(
      "admin_customer_order_summary",
      {

        p_from:
          fromDate
            ? fromDate.toISOString()
            : null,

        p_to:
          toDate
            ? toDate.toISOString()
            : null,

        p_min_orders:
          minOrders

      }
    );


    if (error) {

      console.error(
        "CUSTOMER ORDER SUMMARY ERROR:",
        error
      );


      return res
        .status(500)
        .json({

          success: false,

          message:
            "Unable to retrieve customer order activity"

        });

    }


    /*
    |--------------------------------------------------------------------------
    | Statistics
    |--------------------------------------------------------------------------
    */

    const customers =
      data || [];


    const totalOrders =
      customers.reduce(
        (
          total,
          customer
        ) =>
          total +
          Number(
            customer.order_count ||
            0
          ),
        0
      );


    const totalSpent =
      customers.reduce(
        (
          total,
          customer
        ) =>
          total +
          Number(
            customer.total_spent ||
            0
          ),
        0
      );


    return res
      .status(200)
      .json({

        success: true,

        filters: {

          from:
            fromDate
              ?.toISOString() ||
            null,

          to:
            toDate
              ?.toISOString() ||
            null,

          min_orders:
            minOrders

        },

        stats: {

          customers:
            customers.length,

          orders:
            totalOrders,

          revenue:
            totalSpent

        },

        customers

      });


  } catch (error) {

    console.error(
      "CUSTOMER ORDER SUMMARY ERROR:",
      error
    );


    return res
      .status(500)
      .json({

        success: false,

        message:
          "Server error while retrieving customer order activity"

      });

  }

}