import express from "express";
const router = express.Router();

import { AuthMiddleware } from "../../middleware/auth.middleware.js";
import { RolesMiddleware } from "../../middleware/roles.middleware.js";
import { Roles } from "../../config/index.js";
import UserController from "./user.controller.js";

// create user (admin/super_admin) or self-register via auth route
const controller = new UserController();

router.get(
  "/",
  AuthMiddleware.authMiddleware,
  RolesMiddleware.requireRole(Roles.ADMIN, Roles.SUPERADMIN),
  controller.getAllUsers
);

router.get("/me", AuthMiddleware.authMiddleware, controller.getOwnDetails);

router.get(
  "/userdetails/:id",
  AuthMiddleware.authMiddleware,
  RolesMiddleware.requireRole(Roles.ADMIN, Roles.SUPERADMIN),
  controller.getUserDetailsById
);

router.put(
  "/",
  AuthMiddleware.authMiddleware,
  RolesMiddleware.requireRole(Roles.ADMIN, Roles.SUPERADMIN),
  controller.updateUser
);

router.put("/me", AuthMiddleware.authMiddleware, controller.updateSelf);

export { router };
