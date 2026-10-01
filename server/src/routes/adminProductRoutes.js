import express from "express";

import {
  getAdminProducts,
  getAdminProduct,
  createProduct,
  updateProduct,
  deleteProduct
} from "../controllers/productController.js";

import {
  createVariant,
  updateVariant,
  deleteVariant
} from "../controllers/variantController.js";

import {
  authenticate,
  requireAdmin
} from "../middleware/authMiddleware.js";

import {
  uploadImages,
  deleteImage
} from "../controllers/imageController.js";

import {
  uploadProductImages
} from "../middleware/uploadMiddleware.js";


const router =
  express.Router();


/*
|--------------------------------------------------------------------------
| Protect every route below
|--------------------------------------------------------------------------
*/

router.use(
  authenticate,
  requireAdmin
);


/*
|--------------------------------------------------------------------------
| Products
|--------------------------------------------------------------------------
*/

router.get(
  "/",
  getAdminProducts
);


router.post(
  "/",
  createProduct
);


router.get(
  "/:id",
  getAdminProduct
);


router.patch(
  "/:id",
  updateProduct
);


router.delete(
  "/:id",
  deleteProduct
);


/*
|--------------------------------------------------------------------------
| Variants
|--------------------------------------------------------------------------
*/

router.post(
  "/:productId/variants",
  createVariant
);


router.patch(
  "/:productId/variants/:variantId",
  updateVariant
);


router.delete(
  "/:productId/variants/:variantId",
  deleteVariant
);



/*
|--------------------------------------------------------------------------
| Product Images
|--------------------------------------------------------------------------
*/

router.post(
  "/:productId/images",
  uploadProductImages.array(
    "images",
    5
  ),
  uploadImages
);


router.delete(
  "/:productId/images/:imageId",
  deleteImage
);



export default router;