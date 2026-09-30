import express from "express";

import rateLimit from "express-rate-limit";

import {
  register,
  login,
  getMe
} from "../controllers/authController.js";

import {
  authenticate
} from "../middleware/authMiddleware.js";


const router = express.Router();


/*
|--------------------------------------------------------------------------
| Login rate limiter
|--------------------------------------------------------------------------
*/

const loginLimiter = rateLimit({

  windowMs:
    15 * 60 * 1000,

  limit: 10,

  standardHeaders: "draft-8",

  legacyHeaders: false,

  message: {
    success: false,
    message:
      "Too many login attempts. Please try again later."
  }

});


/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
*/

router.post(
  "/register",
  register
);


router.post(
  "/login",
  loginLimiter,
  login
);


router.get(
  "/me",
  authenticate,
  getMe
);


export default router;