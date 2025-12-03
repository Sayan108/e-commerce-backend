import express from "express";
const router = express.Router();

import { authMiddleware } from "../middleware/auth.middleware.js";
import { requireRole } from "../middleware/roles.middleware.js";

import { Roles } from "../config/index.js";
import {
  createDashBoardBanner,
  deleteDashBoardBanner,
  getAllDashBoardBanners,
  updateDashBoardBanner,
} from "../controllers/ecommercedashboard.controller.js";

router.post(
  "/banner",
  authMiddleware,
  requireRole(Roles.ADMIN, Roles.SUPERADMIN),
  createDashBoardBanner
);

router.get("/banner", getAllDashBoardBanners);

router.delete(
  "/banner/:id",
  authMiddleware,
  requireRole(Roles.ADMIN, Roles.SUPERADMIN),
  deleteDashBoardBanner
);

router.put(
  "/banner/:id",
  authMiddleware,
  requireRole(Roles.ADMIN, Roles.SUPERADMIN),
  updateDashBoardBanner
);

router.get("/videos", getDashboardVideos);

router.post(
  "/videos",
  authMiddleware,
  requireRole(Roles.ADMIN, Roles.SUPERADMIN),
  createDashboardVideo
);

router.put(
  "/videos/:id",
  authMiddleware,
  requireRole(Roles.ADMIN, Roles.SUPERADMIN),
  updateDashboardVideo
);

router.delete(
  "/videos/:id",
  authMiddleware,
  requireRole(Roles.ADMIN, Roles.SUPERADMIN),
  deleteDashboardVideo
);

export { router };
