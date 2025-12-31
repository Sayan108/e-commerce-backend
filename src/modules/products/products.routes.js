import express from "express";
const router = express.Router();
import { AuthMiddleware } from "../../middleware/auth.middleware.js";
import { RolesMiddleware } from "../../middleware/roles.middleware.js";
import { Roles } from "../../config/index.js";
import ProductsController from "./products.controller.js";

const controller = new ProductsController();

router.post(
  "/",
  AuthMiddleware.authMiddleware,
  RolesMiddleware.requireRole(Roles.ADMIN, Roles.SUPERADMIN),
  controller.createProducts
);

router.get("/newarrival", controller.getNewarrivals);

router.get("/:id", controller.getProductById);

router.get("/", controller.getProductsByCategoriesWithFilter);

router.put(
  "/:id",
  AuthMiddleware.authMiddleware,
  RolesMiddleware.requireRole(Roles.ADMIN, Roles.SUPERADMIN),
  controller.updateProduct
);

router.delete(
  "/:id",
  AuthMiddleware.authMiddleware,
  RolesMiddleware.requireRole(Roles.ADMIN, Roles.SUPERADMIN),
  controller.deleteProduct
);

router.post(
  "/bulk-insert",
  AuthMiddleware.authMiddleware,
  RolesMiddleware.requireRole(Roles.ADMIN, Roles.SUPERADMIN),
  controller.bulkInsertProducts
);

export { router };
