import { Messages } from "../config/messages.js";
import reviewModel from "../models/review.model.js";

export const postReview = async (req, res) => {
  const { productId, rating, comment } = req.body;
  if (!productId || !rating) {
    return res.status(400).json({ error: "productId and rating are required" });
  }
  try {
    const review = await reviewModel.createReview({
      userId: req.user.id,
      productId,
      rating,
      comment: comment || "",
    });
    res.json({
      review,
      message: Messages.PRODUCT_REVIEW.PRODUCT_REVIEW_SUCCESS,
    });
  } catch (error) {
    res
      .status(500)
      .json({ error: Messages.PRODUCT_REVIEW.PRODUCT_REVIEW_ERROR });
  }
};
