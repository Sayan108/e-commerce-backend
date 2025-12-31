import express from "express";
const router = express.Router();
import { AuthMiddleware } from "../../middleware/auth.middleware.js";
import { RolesMiddleware } from "../../middleware/roles.middleware.js";
import CategoriesController from "./categories.controller.js";
import { Roles } from "../../config/index.js";

const controller = new CategoriesController();

router.post(
  "/",
  AuthMiddleware.authMiddleware,
  RolesMiddleware.requireRole(Roles.ADMIN, Roles.SUPERADMIN),
  controller.createCategory
);

router.delete(
  "/:id",
  AuthMiddleware.authMiddleware,
  RolesMiddleware.requireRole(Roles.ADMIN, Roles.SUPERADMIN),
  controller.deleteCategory
);
router.get("/", controller.getAllCategories);

router.put(
  "/:id",
  AuthMiddleware.authMiddleware,
  RolesMiddleware.requireRole(Roles.ADMIN, Roles.SUPERADMIN),
  controller.updateCategory
);

router.post(
  "/bulk-insert",
  AuthMiddleware.authMiddleware,
  RolesMiddleware.requireRole(Roles.ADMIN, Roles.SUPERADMIN),
  controller.bulkInsertCategories
);

router.get("/featured", controller.getFeaturedCategories);

export { router };
