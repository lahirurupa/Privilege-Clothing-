import express from "express";

import {
  getAdminOrders,
  getAdminOrder,
  updateAdminOrderStatus
} from "../controllers/adminOrderController.js";

import {
  authenticate,
  requireAdmin
} from "../middleware/authMiddleware.js";


const router =
  express.Router();


/*
|--------------------------------------------------------------------------
| Protect Every Order Management Route
|--------------------------------------------------------------------------
*/

router.use(
  authenticate,
  requireAdmin
);


/*
|--------------------------------------------------------------------------
| GET ALL ORDERS
|--------------------------------------------------------------------------
*/

router.get(
  "/",
  getAdminOrders
);


/*
|--------------------------------------------------------------------------
| GET ONE ORDER
|--------------------------------------------------------------------------
*/

router.get(
  "/:id",
  getAdminOrder
);


/*
|--------------------------------------------------------------------------
| UPDATE STATUS
|--------------------------------------------------------------------------
*/

router.patch(
  "/:id/status",
  updateAdminOrderStatus
);


export default router;