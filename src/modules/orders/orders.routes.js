import express from "express";
const router = express.Router();
import { AuthMiddleware } from "../../middleware/auth.middleware.js";
import OrdersController from "./orders.controller.js";
import { RolesMiddleware } from "../../middleware/roles.middleware.js";
import { Roles } from "../../config/index.js";

const controller = new OrdersController();

router.post("/", AuthMiddleware.authMiddleware, controller.createOrder);

router.get("/:id", AuthMiddleware.authMiddleware, controller.getOrdersByUser);

router.get(
  "/",
  AuthMiddleware.authMiddleware,
  RolesMiddleware.requireRole(Roles.ADMIN, Roles.SUPERADMIN),
  controller.getAllOrders
);

router.put(
  "/:id",
  AuthMiddleware.authMiddleware,
  controller.updateOrderDetails
);

router.patch(
  "/:id",
  AuthMiddleware.authMiddleware,
  RolesMiddleware.requireRole(Roles.ADMIN, Roles.SUPERADMIN),
  controller.updateOrderStatus
);

export { router };
