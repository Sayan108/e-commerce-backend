import express from "express";
const router = express.Router();
import { authMiddleware } from "../middleware/auth.middleware.js";
import { createOrder } from "../controllers/orders.controller.js";

router.post("/", authMiddleware, createOrder);
export { router };
