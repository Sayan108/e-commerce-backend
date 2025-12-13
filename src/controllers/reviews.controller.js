import { Messages } from "../config/messages.js";
import productModel from "../models/product.model.js";
import reviewModel from "../models/review.model.js";
import userModel from "../models/user.model.js";

/* ===========================
   ✅ POST REVIEW
=========================== */
export const postReview = async (req, res) => {
  const { productId, rating, comment } = req.body;

  if (!productId || !rating) {
    return res.status(400).json({
      error: "productId and rating are required",
    });
  }

  try {
    const product = await productModel.getProductById(productId);
    if (!product) return res.json({ message: "Product not found " });
    const user = await userModel.findById(req.user.id);
    const review = await reviewModel.createReview({
      userId: req.user.id,
      productId,
      rating,
      comment: comment || "",
      userName: user.name || "User",
      userProfilePicture: user.profilePicture || "",
    });

    res.json({
      review,
      message: Messages.PRODUCT_REVIEW.PRODUCT_REVIEW_SUCCESS,
    });
    const list = await reviewModel.listReviewsByProduct(productId);
    const newRating =
      (list.reduce((ele) => +ele.rating) + rating) / (list.length + 1);
    await productModel.updateProduct(productId, {
      review: product.review + 1,
      rating: newRating,
    });
  } catch (error) {
    res.status(500).json({
      error,
      message: Messages.PRODUCT_REVIEW.PRODUCT_REVIEW_ERROR,
    });
  }
};

/* ===========================
   ✅ GET REVIEWS BY PRODUCT
=========================== */
export const getProductReviews = async (req, res) => {
  try {
    const productId = req.params.productId;

    if (!productId) {
      return res.status(400).json({ error: "productId is required" });
    }

    const list = await reviewModel.listReviewsByProduct(productId);

    res.json({
      list,
      message: Messages.PRODUCT_REVIEW.PRODUCT_REVIEW_SUCCESS,
    });
  } catch (error) {
    res.status(500).json({
      error,
      message: Messages.PRODUCT_REVIEW.PRODUCT_REVIEW_ERROR,
    });
  }
};

/* ===========================
   ✅ UPDATE REVIEW
=========================== */
export const updateReview = async (req, res) => {
  const { id } = req.params;
  const { rating, comment } = req.body;

  try {
    const updated = await reviewModel.updateReview(id, {
      rating,
      comment,
    });

    res.json({
      updated,
      message: Messages.PRODUCT_REVIEW.PRODUCT_REVIEW_UPDATED,
    });
  } catch (error) {
    res.status(500).json({
      error,
      message: Messages.PRODUCT_REVIEW.PRODUCT_REVIEW_ERROR,
    });
  }
};

/* ===========================
   ✅ DELETE REVIEW
=========================== */
export const deleteReview = async (req, res) => {
  const { id } = req.params;

  try {
    await reviewModel.deleteReview(id);

    res.json({
      message: Messages.PRODUCT_REVIEW.PRODUCT_REVIEW_DELETED,
    });
  } catch (error) {
    res.status(500).json({
      error,
      message: Messages.PRODUCT_REVIEW.PRODUCT_REVIEW_ERROR,
    });
  }
};

export const bulkInsertReviews = async (req, res) => {
  try {
    const { reviews } = req.body;
    console.log(reviews, "reviews");
    const b = await reviewModel.createReviewsBulk(reviews);
    res.json({ message: Messages.PRODUCT_REVIEW.PRODUCT_REVIEW_SUCCESS });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      error,
      message: Messages.PRODUCT_REVIEW.PRODUCT_REVIEW_ERROR,
    });
  }
};
