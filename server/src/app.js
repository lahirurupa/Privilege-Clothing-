import express from "express";

import cors from "cors";

import helmet from "helmet";

import morgan from "morgan";

import rateLimit
  from "express-rate-limit";


import {
  supabase
} from "./config/supabase.js";


import authRoutes
  from "./routes/authRoutes.js";

import categoryRoutes
  from "./routes/categoryRoutes.js";

import productRoutes
  from "./routes/productRoutes.js";

import cartRoutes
  from "./routes/cartRoutes.js";

import orderRoutes
  from "./routes/orderRoutes.js";

import adminProductRoutes
  from "./routes/adminProductRoutes.js";

import adminUserRoutes
  from "./routes/adminUserRoutes.js";

import adminOrderRoutes
  from "./routes/adminOrderRoutes.js";


const app =
  express();


/*
|--------------------------------------------------------------------------
| Security
|--------------------------------------------------------------------------
*/

app.use(
  helmet()
);


/*
|--------------------------------------------------------------------------
| CORS
|--------------------------------------------------------------------------
*/

const allowedOrigins = [

  process.env.ADMIN_ORIGIN,

  process.env.STOREFRONT_ORIGIN

];


app.use(
  cors({

    origin:
      function (
        origin,
        callback
      ) {

        /*
        |--------------------------------------------------------------------------
        | Postman / Server Tools
        |--------------------------------------------------------------------------
        */

        if (!origin) {

          return callback(
            null,
            true
          );

        }


        /*
        |--------------------------------------------------------------------------
        | Allowed Web Apps
        |--------------------------------------------------------------------------
        */

        if (
          allowedOrigins.includes(
            origin
          )
        ) {

          return callback(
            null,
            true
          );

        }


        return callback(
          new Error(
            "Not allowed by CORS"
          )
        );

      }

  })
);


/*
|--------------------------------------------------------------------------
| JSON
|--------------------------------------------------------------------------
*/

app.use(
  express.json({
    limit: "1mb"
  })
);


/*
|--------------------------------------------------------------------------
| Logging
|--------------------------------------------------------------------------
*/

app.use(
  morgan("dev")
);


/*
|--------------------------------------------------------------------------
| Rate Limiting
|--------------------------------------------------------------------------
*/

const apiLimiter =
  rateLimit({

    windowMs:
      15 * 60 * 1000,

    limit:
      500,

    standardHeaders:
      "draft-8",

    legacyHeaders:
      false

  });


app.use(
  "/api",
  apiLimiter
);


/*
|--------------------------------------------------------------------------
| Health Check
|--------------------------------------------------------------------------
*/

app.get(
  "/api/health",
  (
    req,
    res
  ) => {

    res.status(200).json({

      success: true,

      message:
        "Clothing Store API is running"

    });

  }
);


/*
|--------------------------------------------------------------------------
| Database Test
|--------------------------------------------------------------------------
*/

app.get(
  "/api/test-db",
  async (
    req,
    res
  ) => {

    try {

      const {
        data,
        error
      } = await supabase
        .from("categories")
        .select(
          "id, name, slug"
        )
        .limit(10);


      if (error) {

        throw error;

      }


      return res.json({

        success: true,

        message:
          "Supabase database connected successfully",

        categories:
          data

      });


    } catch (error) {

      console.error(
        "DATABASE TEST ERROR:",
        error
      );


      return res
        .status(500)
        .json({

          success: false,

          message:
            "Unable to connect to Supabase database"

        });

    }

  }
);


/*
|--------------------------------------------------------------------------
| PUBLIC / CUSTOMER ROUTES
|--------------------------------------------------------------------------
*/

app.use(
  "/api/auth",
  authRoutes
);


app.use(
  "/api/categories",
  categoryRoutes
);


/*
|--------------------------------------------------------------------------
| Prevent stale dynamic API responses
|--------------------------------------------------------------------------
*/

app.use(
  "/api/products",
  (
    req,
    res,
    next
  ) => {

    res.set(
      "Cache-Control",
      "no-store"
    );


    next();

  }
);


app.use(
  "/api/products",
  productRoutes
);


/*
|--------------------------------------------------------------------------
| CUSTOMER CART
|--------------------------------------------------------------------------
*/

app.use(
  "/api/cart",
  cartRoutes
);


/*
|--------------------------------------------------------------------------
| CUSTOMER ORDERS
|--------------------------------------------------------------------------
*/

app.use(
  "/api/orders",
  orderRoutes
);


/*
|--------------------------------------------------------------------------
| ADMIN ROUTES
|--------------------------------------------------------------------------
*/

app.use(
  "/api/admin/products",
  adminProductRoutes
);


app.use(
  "/api/admin/users",
  adminUserRoutes
);

app.use(
  "/api/admin/orders",
  adminOrderRoutes
);

/*
|--------------------------------------------------------------------------
| 404
|--------------------------------------------------------------------------
|
| IMPORTANT:
| Always keep this AFTER all application routes.
|
*/

app.use(
  (
    req,
    res
  ) => {

    return res
      .status(404)
      .json({

        success: false,

        message:
          "API route not found"

      });

  }
);


/*
|--------------------------------------------------------------------------
| Global Error Handler
|--------------------------------------------------------------------------
*/

app.use(
  (
    error,
    req,
    res,
    next
  ) => {

    console.error(
      "GLOBAL ERROR:",
      error
    );


    /*
    |--------------------------------------------------------------------------
    | Multer File Size
    |--------------------------------------------------------------------------
    */

    if (
      error.code ===
      "LIMIT_FILE_SIZE"
    ) {

      return res
        .status(400)
        .json({

          success: false,

          message:
            "Each image must be 3 MB or smaller"

        });

    }


    /*
    |--------------------------------------------------------------------------
    | Multer Maximum Images
    |--------------------------------------------------------------------------
    */

    if (
      error.code ===
      "LIMIT_FILE_COUNT"
    ) {

      return res
        .status(400)
        .json({

          success: false,

          message:
            "Maximum 5 images are allowed"

        });

    }


    /*
    |--------------------------------------------------------------------------
    | Generic Error
    |--------------------------------------------------------------------------
    */

    return res
      .status(
        error.status ||
        500
      )
      .json({

        success: false,

        message:
          process.env.NODE_ENV ===
          "production"
            ? "Something went wrong"
            : error.message

      });

  }
);


export default app;