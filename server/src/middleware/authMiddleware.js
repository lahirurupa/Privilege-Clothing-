import jwt from "jsonwebtoken";

import {
  supabase
} from "../config/supabase.js";


/*
|--------------------------------------------------------------------------
| AUTHENTICATE USER
|--------------------------------------------------------------------------
*/

export async function authenticate(
  req,
  res,
  next
) {

  try {

    const authorization =
      req.headers.authorization;


    /*
    |--------------------------------------------------------------------------
    | Check Authorization header
    |--------------------------------------------------------------------------
    */

    if (
      !authorization ||
      !authorization.startsWith("Bearer ")
    ) {

      return res.status(401).json({
        success: false,
        message:
          "Authentication required"
      });

    }


    /*
    |--------------------------------------------------------------------------
    | Extract token
    |--------------------------------------------------------------------------
    */

    const token =
      authorization.substring(7);


    /*
    |--------------------------------------------------------------------------
    | Verify JWT
    |--------------------------------------------------------------------------
    */

    let decoded;


    try {

      decoded = jwt.verify(
        token,
        process.env.JWT_SECRET,
        {
          algorithms: ["HS256"],

          issuer:
            "privilege-clothing-api",

          audience:
            "privilege-clothing-web"
        }
      );

    } catch (error) {

      return res.status(401).json({
        success: false,
        message:
          "Invalid or expired authentication token"
      });

    }


    /*
    |--------------------------------------------------------------------------
    | Load current user from database
    |--------------------------------------------------------------------------
    |
    | We don't completely trust role information
    | stored inside an old JWT.
    |
    | This allows us to:
    |
    | - disable users
    | - remove admin rights
    | - change roles
    |
    | without waiting for old tokens to expire.
    |
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
        is_active
      `)
      .eq("id", decoded.sub)
      .maybeSingle();


    if (error) {

      console.error(
        "AUTH DATABASE ERROR:",
        error
      );

      return res.status(500).json({
        success: false,
        message:
          "Unable to authenticate user"
      });

    }


    if (!user) {

      return res.status(401).json({
        success: false,
        message:
          "User no longer exists"
      });

    }


    if (!user.is_active) {

      return res.status(403).json({
        success: false,
        message:
          "This account has been disabled"
      });

    }


    /*
    |--------------------------------------------------------------------------
    | Attach user to request
    |--------------------------------------------------------------------------
    */

    req.user = user;

    next();


  } catch (error) {

    console.error(
      "AUTHENTICATION ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Server error"
    });

  }
}


/*
|--------------------------------------------------------------------------
| ADMIN AUTHORIZATION
|--------------------------------------------------------------------------
*/

export function requireAdmin(
  req,
  res,
  next
) {

  if (
    !req.user ||
    req.user.role !== "admin"
  ) {

    return res.status(403).json({
      success: false,
      message:
        "Administrator access required"
    });

  }


  next();
}