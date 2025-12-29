import express from "express";
const router = express.Router();
import { authMiddleware } from "../../middleware/auth.middleware.js";

import {
  deleteReview,
  getProductReviews,
  postReview,
  updateReview,
  bulkInsertReviews,
} from "./reviews.controller.js";
import { requireRole } from "../../middleware/roles.middleware.js";
import { Roles } from "../../config/index.js";

router.post("/", authMiddleware, postReview);
router.post(
  "/bulk",
  authMiddleware,
  requireRole(Roles.ADMIN, Roles.SUPERADMIN),
  bulkInsertReviews
);

router.get("/:productId", getProductReviews);
router.put("/:id", authMiddleware, updateReview);
router.delete("/:id", authMiddleware, deleteReview);

export { router };
