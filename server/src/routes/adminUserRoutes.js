import express from "express";

import {
  getUsers,
  getUser,
  updateUserStatus
} from "../controllers/userController.js";

import {
  authenticate,
  requireAdmin
} from "../middleware/authMiddleware.js";


const router = express.Router();


/*
|--------------------------------------------------------------------------
| Protect All User Management Routes
|--------------------------------------------------------------------------
|
| Every route below requires:
|
| 1. Valid JWT
| 2. Logged-in user
| 3. Administrator role
|
*/

router.use(
  authenticate,
  requireAdmin
);


/*
|--------------------------------------------------------------------------
| GET ALL USERS
|--------------------------------------------------------------------------
|
| GET /api/admin/users
|
| Optional query examples:
|
| /api/admin/users?search=john
| /api/admin/users?status=active
| /api/admin/users?status=disabled
| /api/admin/users?role=customer
| /api/admin/users?role=admin
|
*/

router.get(
  "/",
  getUsers
);


/*
|--------------------------------------------------------------------------
| GET ONE USER
|--------------------------------------------------------------------------
|
| GET /api/admin/users/:id
|
*/

router.get(
  "/:id",
  getUser
);


/*
|--------------------------------------------------------------------------
| ENABLE / DISABLE USER
|--------------------------------------------------------------------------
|
| PATCH /api/admin/users/:id/status
|
| Body:
|
| {
|   "is_active": false
| }
|
*/

router.patch(
  "/:id/status",
  updateUserStatus
);


export default router;