import express from "express";
const router = express.Router();

import { authMiddleware } from "../../middleware/auth.middleware.js";
import { requireRole } from "../../middleware/roles.middleware.js";

import { Roles } from "../../config/index.js";
import {
  createDashBoardBanner,
  createDashboardVideo,
  deleteDashBoardBanner,
  deleteDashboardVideo,
  getAllDashBoardBanners,
  getDashboardVideos,
  updateDashBoardBanner,
  updateDashboardVideo,
  listFaqs,
  createFaq,
  deleteFaq,
  bulkUpdateFaqs,
  getContactUsInfo,
  createOrUpdateContactUsInfo,
} from "./ecommercedashboard.controller.js";

/* ===================== BANNER ===================== */

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

/* ===================== VIDEOS ===================== */

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

/* ===================== FAQ ===================== */

// Public
router.get("/faq", listFaqs);

// Admin
router.post(
  "/faq",
  authMiddleware,
  requireRole(Roles.ADMIN, Roles.SUPERADMIN),
  createFaq
);

router.delete(
  "/faq/:id",
  authMiddleware,
  requireRole(Roles.ADMIN, Roles.SUPERADMIN),
  deleteFaq
);

router.post(
  "/faq/bulk-insert",
  authMiddleware,
  requireRole(Roles.ADMIN, Roles.SUPERADMIN),
  bulkUpdateFaqs
);

router.get("/contactusinfo", getContactUsInfo);

router.post(
  "/contactusinfo",
  authMiddleware,
  requireRole(Roles.ADMIN, Roles.SUPERADMIN),
  createOrUpdateContactUsInfo
);

export { router };
