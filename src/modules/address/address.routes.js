import express from "express";
const router = express.Router();
import { authMiddleware } from "../../middleware/auth.middleware.js";
import {
  createAddress,
  deleteAddress,
  getAllAddresses,
  updateAddress,
} from "./address.controller.js";

router.post(
  "/",
  authMiddleware,

  createAddress
);

router.delete("/:id", authMiddleware, deleteAddress);

router.get("/", authMiddleware, getAllAddresses);

router.put("/:id", authMiddleware, updateAddress);

export { router };
