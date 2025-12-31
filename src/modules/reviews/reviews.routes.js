import express from "express";
const router = express.Router();
import { AuthMiddleware } from "../../middleware/auth.middleware.js";

import ReviewsController from "./reviews.controller.js";
import { RolesMiddleware } from "../../middleware/roles.middleware.js";
import { Roles } from "../../config/index.js";

const controller = new ReviewsController();

router.post("/", AuthMiddleware.authMiddleware, controller.postReview);
router.post(
  "/bulk",
  AuthMiddleware.authMiddleware,
  RolesMiddleware.requireRole(Roles.ADMIN, Roles.SUPERADMIN),
  controller.bulkInsertReviews
);

router.get("/:productId", controller.getProductReviews);
router.put("/:id", AuthMiddleware.authMiddleware, controller.updateReview);
router.delete("/:id", AuthMiddleware.authMiddleware, controller.deleteReview);

export { router };
