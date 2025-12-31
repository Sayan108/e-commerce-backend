import express from "express";
import CartController from "./cart.controller.js";
import { AuthMiddleware } from "../../middleware/auth.middleware.js";

const router = express.Router();

const controller = new CartController();

router.post("/", AuthMiddleware.authMiddleware, controller.addToCart); // Add to cart
router.get("/", AuthMiddleware.authMiddleware, controller.getCart); // Get cart
router.put("/:id", AuthMiddleware.authMiddleware, controller.updateCart); // Update quantity
router.delete("/:id", AuthMiddleware.authMiddleware, controller.deleteCartItem); // Delete item
router.delete("/", AuthMiddleware.authMiddleware, controller.clearCart); // Clear cart

export { router };
