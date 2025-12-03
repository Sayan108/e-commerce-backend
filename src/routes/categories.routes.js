import express from "express";
const router = express.Router();
import categoryModel from "../models/category.model.js";
import { authMiddleware } from "../middleware/auth.middleware.js";
import { requireRole } from "../middleware/roles.middleware.js";
import {
  bulkInsertCategories,
  createCategory,
  getAllCategories,
} from "../controllers/categories.controller.js";
import { Roles } from "../config/index.js";

router.post(
  "/",
  authMiddleware,
  requireRole(Roles.ADMIN, Roles.SUPERADMIN),
  createCategory
);

router.get("/", getAllCategories);

router.post(
  "/bulk-insert",
  authMiddleware,
  requireRole(Roles.ADMIN, Roles.SUPERADMIN),
  bulkInsertCategories
);

export { router };
