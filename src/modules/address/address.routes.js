import express from "express";
const router = express.Router();
import { AuthMiddleware } from "../../middleware/auth.middleware.js";
import AddressController from "./address.controller.js";

const controller = new AddressController();

router.post(
  "/",
  AuthMiddleware.authMiddleware,

  controller.createAddress
);

router.delete("/:id", AuthMiddleware.authMiddleware, controller.deleteAddress);

router.get("/", AuthMiddleware.authMiddleware, controller.getAllAddresses);

router.put("/:id", AuthMiddleware.authMiddleware, controller.updateAddress);

export { router };
