import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import rateLimit from "express-rate-limit";
import authRoutes from "./routes/authRoutes.js";

import {
  authenticate,
  requireAdmin
} from "./middleware/authMiddleware.js";

import productRoutes
  from "./routes/productRoutes.js";

import adminProductRoutes
  from "./routes/adminProductRoutes.js";

import categoryRoutes
  from "./routes/categoryRoutes.js";

import { supabase } from "./config/supabase.js";

const app = express();


/*
|--------------------------------------------------------------------------
| Security
|--------------------------------------------------------------------------
*/

app.use(helmet());


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
    origin: function (origin, callback) {

      // Allows Postman and similar tools
      if (!origin) {
        return callback(null, true);
      }

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(
        new Error("Not allowed by CORS")
      );
    }
  })
);


/*
|--------------------------------------------------------------------------
| Body parser
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

app.use(morgan("dev"));


/*
|--------------------------------------------------------------------------
| Rate Limiting
|--------------------------------------------------------------------------
*/

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,

  limit: 500,

  standardHeaders: "draft-8",

  legacyHeaders: false
});

app.use("/api", apiLimiter);


/*
|--------------------------------------------------------------------------
| Health Check
|--------------------------------------------------------------------------
*/

app.get("/api/health", (req, res) => {

  res.status(200).json({
    success: true,
    message: "Clothing Store API is running"
  });

});


/*
|--------------------------------------------------------------------------
| Database Connection Test
|--------------------------------------------------------------------------
*/

app.get("/api/test-db", async (req, res) => {

  try {

    const { data, error } = await supabase
      .from("categories")
      .select("id, name, slug")
      .limit(10);

    if (error) {
      throw error;
    }

    res.status(200).json({
      success: true,
      message: "Supabase database connected successfully",
      categories: data
    });

  } catch (error) {

    console.error(
      "Database connection error:",
      error
    );

    res.status(500).json({
      success: false,
      message:
        "Unable to connect to Supabase database"
    });

  }

});


app.use(
  "/api/auth",
  authRoutes
);



app.get(
  "/api/admin/test",
  authenticate,
  requireAdmin,
  (req, res) => {

    res.status(200).json({
      success: true,
      message:
        "Welcome administrator",
      user: {
        id: req.user.id,
        name: req.user.name,
        role: req.user.role
      }
    });

  }
);



/*
|--------------------------------------------------------------------------
| Categories
|--------------------------------------------------------------------------
*/

app.use(
  "/api/categories",
  categoryRoutes
);


/*
|--------------------------------------------------------------------------
| Public Products
|--------------------------------------------------------------------------
*/

app.use(
  "/api/products",
  productRoutes
);


/*
|--------------------------------------------------------------------------
| Admin Products
|--------------------------------------------------------------------------
*/

app.use(
  "/api/admin/products",
  adminProductRoutes
);


/*
|--------------------------------------------------------------------------
| 404
|--------------------------------------------------------------------------
*/

app.use((req, res) => {

  res.status(404).json({
    success: false,
    message: "API route not found"
  });

});


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
    | Multer errors
    |--------------------------------------------------------------------------
    */

    if (
      error.code ===
      "LIMIT_FILE_SIZE"
    ) {

      return res.status(400).json({

        success: false,

        message:
          "Each image must be 3 MB or smaller"

      });

    }


    if (
      error.code ===
      "LIMIT_FILE_COUNT"
    ) {

      return res.status(400).json({

        success: false,

        message:
          "Maximum 5 images are allowed"

      });

    }


    /*
    |--------------------------------------------------------------------------
    | Normal errors
    |--------------------------------------------------------------------------
    */

    return res
      .status(
        error.status || 500
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