const express = require("express");
const router = express.Router();
const userModel = require("../models/userModel");
const { authMiddleware } = require("../middleware/auth");
const { requireRole } = require("../middleware/roles");

// create user (admin/super_admin) or self-register via auth route
router.get(
  "/",
  authMiddleware,
  requireRole("admin", "super_admin"),
  async (req, res) => {
    // ... minimal list implementation for SQL/Mongo
    // For brevity: direct DB access not shown. Implement as needed.
    res.json({ message: "List users - implement list in model" });
  }
);

router.get("/me", authMiddleware, async (req, res) => {
  const u = await userModel.findById(req.user.id);
  res.json(u);
});

module.exports = router;
