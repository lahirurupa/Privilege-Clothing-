import express from "express";

import {
  getAdminCategories,
  getAdminCategory,
  createAdminCategory,
  updateAdminCategory,
  deleteAdminCategory
} from "../controllers/adminCategoryController.js";

import {
  authenticate,
  requireAdmin
} from "../middleware/authMiddleware.js";


const router =
  express.Router();


/*
|--------------------------------------------------------------------------
| Admin Authentication
|--------------------------------------------------------------------------
*/

router.use(
  authenticate,
  requireAdmin
);


/*
|--------------------------------------------------------------------------
| READ ALL
|--------------------------------------------------------------------------
*/

router.get(
  "/",
  getAdminCategories
);


/*
|--------------------------------------------------------------------------
| CREATE
|--------------------------------------------------------------------------
*/

router.post(
  "/",
  createAdminCategory
);


/*
|--------------------------------------------------------------------------
| READ ONE
|--------------------------------------------------------------------------
*/

router.get(
  "/:id",
  getAdminCategory
);


/*
|--------------------------------------------------------------------------
| UPDATE
|--------------------------------------------------------------------------
*/

router.patch(
  "/:id",
  updateAdminCategory
);


/*
|--------------------------------------------------------------------------
| DELETE
|--------------------------------------------------------------------------
*/

router.delete(
  "/:id",
  deleteAdminCategory
);


export default router;