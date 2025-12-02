import reviewModel from "../models/review.model.js";

export const postReview = async (req, res) => {
  const { productId, rating, comment } = req.body;
  if (!productId || !rating) {
    return res.status(400).json({ error: "productId and rating are required" });
  }
  const review = await reviewModel.createReview({
    userId: req.user.id,
    productId,
    rating,
    comment: comment || "",
  });
  res.json(review);
};
