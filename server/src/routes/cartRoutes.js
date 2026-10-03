// import express from "express";

// import {
//   getCart,
//   addCartItem,
//   updateCartItem,
//   deleteCartItem,
//   clearCart
// } from "../controllers/cartController.js";

// import {
//   authenticate,
//   requireCustomer
// } from "../middleware/authMiddleware.js";


// const router =
//   express.Router();


// /*
// |--------------------------------------------------------------------------
// | Every cart request requires customer authentication
// |--------------------------------------------------------------------------
// */

// router.use(
//   authenticate,
//   requireCustomer
// );


// router.get(
//   "/",
//   getCart
// );


// router.post(
//   "/items",
//   addCartItem
// );


// router.patch(
//   "/items/:variantId",
//   updateCartItem
// );


// router.delete(
//   "/items/:variantId",
//   deleteCartItem
// );


// router.delete(
//   "/",
//   clearCart
// );


// export default router;





import express from "express";

import {
  getCart,
  addCartItem,
  updateCartItem,
  deleteCartItem,
  clearCart
} from "../controllers/cartController.js";

import {
  authenticate,
  requireCustomer
} from "../middleware/authMiddleware.js";


const router =
  express.Router();


/*
|--------------------------------------------------------------------------
| All Cart Routes Require Customer Login
|--------------------------------------------------------------------------
*/

router.use(
  authenticate,
  requireCustomer
);


/*
|--------------------------------------------------------------------------
| READ
|--------------------------------------------------------------------------
*/

router.get(
  "/",
  getCart
);


/*
|--------------------------------------------------------------------------
| CREATE
|--------------------------------------------------------------------------
*/

router.post(
  "/items",
  addCartItem
);


/*
|--------------------------------------------------------------------------
| UPDATE
|--------------------------------------------------------------------------
*/

router.patch(
  "/items/:variantId",
  updateCartItem
);


/*
|--------------------------------------------------------------------------
| DELETE ITEM
|--------------------------------------------------------------------------
*/

router.delete(
  "/items/:variantId",
  deleteCartItem
);


/*
|--------------------------------------------------------------------------
| CLEAR CART
|--------------------------------------------------------------------------
*/

router.delete(
  "/",
  clearCart
);


export default router;