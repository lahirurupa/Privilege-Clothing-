// import express from "express";

// import {
//   createOrder,
//   getMyOrders,
//   getMyOrder
// } from "../controllers/orderController.js";

// import {
//   authenticate,
//   requireCustomer
// } from "../middleware/authMiddleware.js";


// const router =
//   express.Router();


// router.use(
//   authenticate,
//   requireCustomer
// );


// router.post(
//   "/",
//   createOrder
// );


// router.get(
//   "/my",
//   getMyOrders
// );


// router.get(
//   "/:id",
//   getMyOrder
// );


// export default router;











import express from "express";

import {
  createOrder,
  getMyOrders,
  getMyOrder
} from "../controllers/orderController.js";

import {
  authenticate,
  requireCustomer
} from "../middleware/authMiddleware.js";


const router =
  express.Router();


/*
|--------------------------------------------------------------------------
| Customer Login Required
|--------------------------------------------------------------------------
*/

router.use(
  authenticate,
  requireCustomer
);


/*
|--------------------------------------------------------------------------
| CREATE ORDER
|--------------------------------------------------------------------------
*/

router.post(
  "/",
  createOrder
);


/*
|--------------------------------------------------------------------------
| MY ORDERS
|--------------------------------------------------------------------------
*/

router.get(
  "/my",
  getMyOrders
);


/*
|--------------------------------------------------------------------------
| ONE ORDER
|--------------------------------------------------------------------------
*/

router.get(
  "/:id",
  getMyOrder
);


export default router;