import express from "express";
const router = express.Router();
import { authMiddleware } from "../middleware/auth.middleware.js";

import {
  deleteReview,
  getProductReviews,
  postReview,
  updateReview,
} from "../controllers/reviews.controller.js";

router.post("/", authMiddleware, postReview);

router.get("/:productId", authMiddleware, getProductReviews);
router.put("/:id", authMiddleware, updateReview);
router.delete("/:id", authMiddleware, deleteReview);

export { router };
