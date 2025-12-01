const express = require("express");
const router = express.Router();
const { authMiddleware } = require("../middleware/auth");
const orderModel = require("../models/orderModel");

router.post("/", authMiddleware, async (req, res) => {
  const payload = {
    userId: req.user.id,
    items: req.body.items || [],
    total: req.body.total || 0,
    status: "placed",
  };
  const order = await orderModel.placeOrder(payload);
  res.json(order);
});

module.exports = router;
