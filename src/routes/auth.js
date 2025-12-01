const express = require("express");
const router = express.Router();
const userModel = require("../models/userModel");
const bcrypt = require("bcrypt");
const { signToken } = require("../middleware/auth");

router.post("/register", async (req, res) => {
  const { name, email, password, role } = req.body;
  if (!email || !password)
    return res.status(400).json({ error: "email and password required" });
  const existing = await userModel.findByEmail(email);
  if (existing) return res.status(400).json({ error: "Email already in use" });
  const user = await userModel.createUser({ name, email, password, role });
  const token = signToken(user);
  res.json({ user, token });
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const user = await userModel.findByEmail(email);
  if (!user) return res.status(400).json({ error: "Invalid credentials" });
  const ok = await bcrypt.compare(password, user.password);
  if (!ok) return res.status(400).json({ error: "Invalid credentials" });
  const token = signToken(user);
  res.json({ user, token });
});

module.exports = router;
