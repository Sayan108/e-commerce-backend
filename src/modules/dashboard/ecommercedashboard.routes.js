import express from "express";
const router = express.Router();

import { AuthMiddleware } from "../../middleware/auth.middleware.js";
import { RolesMiddleware } from "../../middleware/roles.middleware.js";

import { Roles } from "../../config/index.js";
import EcommerceDashboardController from "./ecommercedashboard.controller.js";

const controller = new EcommerceDashboardController();

/* ===================== BANNER ===================== */

router.post(
  "/banner",
  AuthMiddleware.authMiddleware,
  RolesMiddleware.requireRole(Roles.ADMIN, Roles.SUPERADMIN),
  controller.createDashBoardBanner
);

router.get("/banner", controller.getAllDashBoardBanners);

router.delete(
  "/banner/:id",
  AuthMiddleware.authMiddleware,
  RolesMiddleware.requireRole(Roles.ADMIN, Roles.SUPERADMIN),
  controller.deleteDashBoardBanner
);

router.put(
  "/banner/:id",
  AuthMiddleware.authMiddleware,
  RolesMiddleware.requireRole(Roles.ADMIN, Roles.SUPERADMIN),
  controller.updateDashBoardBanner
);

/* ===================== VIDEOS ===================== */

router.get("/videos", controller.getDashboardVideos);

router.post(
  "/videos",
  AuthMiddleware.authMiddleware,
  RolesMiddleware.requireRole(Roles.ADMIN, Roles.SUPERADMIN),
  controller.createDashboardVideo
);

router.put(
  "/videos/:id",
  AuthMiddleware.authMiddleware,
  RolesMiddleware.requireRole(Roles.ADMIN, Roles.SUPERADMIN),
  controller.updateDashboardVideo
);

router.delete(
  "/videos/:id",
  AuthMiddleware.authMiddleware,
  RolesMiddleware.requireRole(Roles.ADMIN, Roles.SUPERADMIN),
  controller.deleteDashboardVideo
);

/* ===================== FAQ ===================== */

// Public
router.get("/faq", controller.listFaqs);

// Admin
router.post(
  "/faq",
  AuthMiddleware.authMiddleware,
  RolesMiddleware.requireRole(Roles.ADMIN, Roles.SUPERADMIN),
  controller.createFaq
);

router.delete(
  "/faq/:id",
  AuthMiddleware.authMiddleware,
  RolesMiddleware.requireRole(Roles.ADMIN, Roles.SUPERADMIN),
  controller.deleteFaq
);

router.post(
  "/faq/bulk-insert",
  AuthMiddleware.authMiddleware,
  RolesMiddleware.requireRole(Roles.ADMIN, Roles.SUPERADMIN),
  controller.bulkUpdateFaqs
);

router.get("/contactusinfo", controller.getContactUsInfo);

router.post(
  "/contactusinfo",
  AuthMiddleware.authMiddleware,
  RolesMiddleware.requireRole(Roles.ADMIN, Roles.SUPERADMIN),
  controller.createOrUpdateContactUsInfo
);

export { router };
