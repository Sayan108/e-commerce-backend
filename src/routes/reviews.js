const express = require("express");
const router = express.Router();
const { authMiddleware } = require("../middleware/auth");
const orderModel = require("../models/orderModel");
const reviewModel = require("../models/reviewModel");

router.post("/", authMiddleware, async (req, res) => {
  const { productId, rating, comment } = req.body;
  const ok = await orderModel.userHasPurchased(req.user.id, productId);
  if (!ok)
    return res
      .status(400)
      .json({ error: "You can only review products you purchased" });
  const r = await reviewModel.createReview({
    userId: req.user.id,
    productId,
    rating,
    comment,
  });
  res.json(r);
});

module.exports = router;
