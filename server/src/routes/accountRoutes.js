import express from "express";

import {
  getCustomerProfile,
  updateCustomerProfile
} from "../controllers/accountController.js";

import {
  authenticate,
  requireCustomer
} from "../middleware/authMiddleware.js";


const router =
  express.Router();


/*
|--------------------------------------------------------------------------
| Customer Authentication Required
|--------------------------------------------------------------------------
*/

router.use(
  authenticate,
  requireCustomer
);


/*
|--------------------------------------------------------------------------
| Profile
|--------------------------------------------------------------------------
*/

router.get(
  "/profile",
  getCustomerProfile
);


router.patch(
  "/profile",
  updateCustomerProfile
);


export default router;