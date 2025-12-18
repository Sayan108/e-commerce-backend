import express from "express";
const router = express.Router();
import productModel from "../models/product.model.js";
import { authMiddleware } from "../middleware/auth.middleware.js";
import { requireRole } from "../middleware/roles.middleware.js";
import { Roles } from "../config/index.js";
import {
  bulkInsertProducts,
  createProducts,
  deleteProduct,
  getAllProducts,
  getNewarrivals,
  getProductById,
  getProductsByCategoriesWithFilter,
  updateProduct,
} from "../controllers/products.controller.js";

router.post(
  "/",
  authMiddleware,
  requireRole(Roles.ADMIN, Roles.SUPERADMIN),
  createProducts
);

router.get("/:id", getProductById);

router.get("/", getProductsByCategoriesWithFilter);

router.put(
  "/:id",
  authMiddleware,
  requireRole(Roles.ADMIN, Roles.SUPERADMIN),
  updateProduct
);

router.delete(
  "/:id",
  authMiddleware,
  requireRole(Roles.ADMIN, Roles.SUPERADMIN),
  deleteProduct
);

router.post(
  "/bulk-insert",
  authMiddleware,
  requireRole(Roles.ADMIN, Roles.SUPERADMIN),
  bulkInsertProducts
);

router.get("/newarrival", getNewarrivals);

export { router };
