import express from "express";
const router = express.Router();
import { authMiddleware } from "../middleware/auth.middleware.js";

import { postReview } from "../controllers/reviews.controller.js";

router.post("/", authMiddleware, postReview);

export { router };
