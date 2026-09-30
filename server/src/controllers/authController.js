import bcrypt from "bcryptjs";

import { supabase } from "../config/supabase.js";

import {
  registerSchema,
  loginSchema
} from "../validators/authValidator.js";

import {
  generateToken
} from "../utils/generateToken.js";


/*
|--------------------------------------------------------------------------
| REGISTER
|--------------------------------------------------------------------------
*/

export async function register(req, res) {
  try {
    const validation =
      registerSchema.safeParse(req.body);

    if (!validation.success) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: validation.error.issues
      });
    }

    const {
      name,
      email,
      password
    } = validation.data;

    const normalizedEmail =
      email.toLowerCase().trim();


    /*
    |--------------------------------------------------------------------------
    | Check existing user
    |--------------------------------------------------------------------------
    */

    const {
      data: existingUser,
      error: checkError
    } = await supabase
      .from("users")
      .select("id")
      .eq("email", normalizedEmail)
      .maybeSingle();


    if (checkError) {
      console.error(checkError);

      return res.status(500).json({
        success: false,
        message: "Unable to register user"
      });
    }


    if (existingUser) {
      return res.status(409).json({
        success: false,
        message:
          "An account with this email already exists"
      });
    }


    /*
    |--------------------------------------------------------------------------
    | Hash password
    |--------------------------------------------------------------------------
    */

    const passwordHash =
      await bcrypt.hash(password, 12);


    /*
    |--------------------------------------------------------------------------
    | Create customer
    |--------------------------------------------------------------------------
    |
    | IMPORTANT:
    | We DO NOT accept role from req.body.
    |
    | Every public registration starts as customer.
    |
    */

    const {
      data: user,
      error
    } = await supabase
      .from("users")
      .insert({
        name: name.trim(),
        email: normalizedEmail,
        password_hash: passwordHash,
        role: "customer",
        is_active: true
      })
      .select(
        "id, name, email, role, is_active, created_at"
      )
      .single();


    if (error) {
      console.error(
        "REGISTER DATABASE ERROR:",
        error
      );

      return res.status(500).json({
        success: false,
        message: "Unable to create account"
      });
    }


    /*
    |--------------------------------------------------------------------------
    | Generate JWT
    |--------------------------------------------------------------------------
    */

    const token =
      generateToken(user);


    return res.status(201).json({
      success: true,

      message:
        "Account created successfully",

      token,

      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });

  } catch (error) {

    console.error(
      "REGISTER ERROR:",
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
| LOGIN
|--------------------------------------------------------------------------
*/

export async function login(req, res) {
  try {

    const validation =
      loginSchema.safeParse(req.body);

    if (!validation.success) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: validation.error.issues
      });
    }


    const {
      email,
      password
    } = validation.data;


    const normalizedEmail =
      email.toLowerCase().trim();


    /*
    |--------------------------------------------------------------------------
    | Find user
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
        password_hash,
        role,
        is_active
      `)
      .eq("email", normalizedEmail)
      .maybeSingle();


    if (error) {
      console.error(
        "LOGIN DATABASE ERROR:",
        error
      );

      return res.status(500).json({
        success: false,
        message: "Unable to login"
      });
    }


    /*
    |--------------------------------------------------------------------------
    | Don't reveal whether email or password was incorrect
    |--------------------------------------------------------------------------
    */

    if (!user) {
      return res.status(401).json({
        success: false,
        message:
          "Invalid email or password"
      });
    }


    /*
    |--------------------------------------------------------------------------
    | Check active status
    |--------------------------------------------------------------------------
    */

    if (!user.is_active) {
      return res.status(403).json({
        success: false,
        message:
          "This account has been disabled"
      });
    }


    /*
    |--------------------------------------------------------------------------
    | Compare password
    |--------------------------------------------------------------------------
    */

    const passwordMatches =
      await bcrypt.compare(
        password,
        user.password_hash
      );


    if (!passwordMatches) {
      return res.status(401).json({
        success: false,
        message:
          "Invalid email or password"
      });
    }


    /*
    |--------------------------------------------------------------------------
    | Generate JWT
    |--------------------------------------------------------------------------
    */

    const token =
      generateToken(user);


    return res.status(200).json({
      success: true,

      message: "Login successful",

      token,

      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });


  } catch (error) {

    console.error(
      "LOGIN ERROR:",
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
| GET CURRENT USER
|--------------------------------------------------------------------------
*/

export async function getMe(req, res) {

  return res.status(200).json({

    success: true,

    user: {
      id: req.user.id,
      name: req.user.name,
      email: req.user.email,
      role: req.user.role
    }

  });
}