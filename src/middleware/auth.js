const jwt = require("jsonwebtoken");
const cfg = require("../config");
const userModel = require("../models/userModel");

function signToken(user) {
  return jwt.sign({ id: user.id || user._id, role: user.role }, cfg.jwtSecret, {
    expiresIn: "7d",
  });
}

async function authMiddleware(req, res, next) {
  const h = req.headers.authorization;
  if (!h || !h.startsWith("Bearer "))
    return res.status(401).json({ error: "Missing token" });
  const token = h.slice(7);
  try {
    const payload = jwt.verify(token, cfg.jwtSecret);
    const user = await userModel.findById(payload.id);
    if (!user) return res.status(401).json({ error: "User not found" });
    req.user = { id: user.id || user._id, role: user.role };
    next();
  } catch (e) {
    return res.status(401).json({ error: "Invalid token" });
  }
}

module.exports = { signToken, authMiddleware };
