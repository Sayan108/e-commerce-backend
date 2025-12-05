import express from "express";
const router = express.Router();

import { authMiddleware } from "../middleware/auth.middleware.js";
import { requireRole } from "../middleware/roles.middleware.js";
import { Roles } from "../config/index.js";
import { getAllUsers, getOwnDetails } from "../controllers/user.controller.js";

// create user (admin/super_admin) or self-register via auth route
router.get(
  "/",
  authMiddleware,
  requireRole(Roles.ADMIN, Roles.SUPERADMIN),
  getAllUsers
);

router.get("/me", authMiddleware, getOwnDetails);

router.get(
  "/userdetails/:id",
  authMiddleware,
  requireRole(Roles.ADMIN, Roles.SUPERADMIN)
);

router.put("/");

export { router };
