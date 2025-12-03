import express from "express";
const router = express.Router();
import { authMiddleware } from "../middleware/auth.middleware.js";
import { requireRole } from "../middleware/roles.middleware.js";
import {
  bulkInsertCategories,
  createCategory,
  deleteCategory,
  getAllCategories,
  updateCategory,
} from "../controllers/categories.controller.js";
import { Roles } from "../config/index.js";

router.post(
  "/",
  authMiddleware,
  requireRole(Roles.ADMIN, Roles.SUPERADMIN),
  createCategory
);

router.delete(
  "/:id",
  authMiddleware,
  requireRole(Roles.ADMIN, Roles.SUPERADMIN),
  deleteCategory
);
router.get("/", getAllCategories);

router.put(
  "/:id",
  authMiddleware,
  requireRole(Roles.ADMIN, Roles.SUPERADMIN),
  updateCategory
);

router.post(
  "/bulk-insert",
  authMiddleware,
  requireRole(Roles.ADMIN, Roles.SUPERADMIN),
  bulkInsertCategories
);

export { router };
