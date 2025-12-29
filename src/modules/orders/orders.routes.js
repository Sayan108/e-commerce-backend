import express from "express";
const router = express.Router();
import { authMiddleware } from "../../middleware/auth.middleware.js";
import {
  createOrder,
  getAllOrders,
  getOrdersByUser,
  updateOrderDetails,
  updateOrderStatus,
} from "./orders.controller.js";
import { requireRole } from "../../middleware/roles.middleware.js";
import { Roles } from "../../config/index.js";

router.post("/", authMiddleware, createOrder);

router.get("/:id", authMiddleware, getOrdersByUser);

router.get(
  "/",
  authMiddleware,
  requireRole(Roles.ADMIN, Roles.SUPERADMIN),
  getAllOrders
);

router.put("/:id", authMiddleware, updateOrderDetails);

router.patch(
  "/:id",
  authMiddleware,
  requireRole(Roles.ADMIN, Roles.SUPERADMIN),
  updateOrderStatus
);

export { router };
