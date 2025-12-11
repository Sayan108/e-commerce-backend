import express from "express";
import {
  addToCart,
  getCart,
  updateCart,
  deleteCartItem,
  clearCart,
} from "../controllers/cart.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/", authMiddleware, addToCart); // Add to cart
router.get("/", authMiddleware, getCart); // Get cart
router.put("/:id", authMiddleware, updateCart); // Update quantity
router.delete("/:id", authMiddleware, deleteCartItem); // Delete item
router.delete("/", authMiddleware, clearCart); // Clear cart

export { router };
