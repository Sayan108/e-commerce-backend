import { Messages } from "../../config/messages.js";
import ProductModel from "../products/product.model.js";
import ReviewModel from "./review.model.js";
import UserModel from "../auth/user.model.js";

class ReviewsController {
  /* ===========================
     ✅ POST REVIEW
  ============================ */
  async postReview(req, res) {
    const { productId, rating, comment } = req.body;

    if (!productId || !rating) {
      return res.status(400).json({
        error: "productId and rating are required",
      });
    }

    try {
      const product = await ProductModel.getProductById(productId);
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }

      const user = await UserModel.findById(req.user.id);

      const review = await ReviewModel.createReview({
        userId: req.user.id,
        productId,
        rating,
        comment: comment || "",
        userName: user?.name || "User",
        userProfilePicture: user?.profilePicture || "",
      });

      /* ---------------- UPDATE PRODUCT RATING ---------------- */
      const reviews = await ReviewModel.listReviewsByProduct(productId);

      const totalRating = reviews.reduce((sum, r) => sum + Number(r.rating), 0);

      const avgRating = totalRating / reviews.length;

      await ProductModel.updateProduct(productId, {
        reviewCount: reviews.length,
        rating: avgRating,
      });

      /* ---------------- SEND RESPONSE (ONLY ONCE) ---------------- */
      return res.status(201).json({
        review,
        message: Messages.PRODUCT_REVIEW.PRODUCT_REVIEW_SUCCESS,
      });
    } catch (error) {
      console.error("Post Review Error:", error);

      if (res.headersSent) return;

      return res.status(500).json({
        message: Messages.PRODUCT_REVIEW.PRODUCT_REVIEW_ERROR,
        error: error.message,
      });
    }
  }

  /* ===========================
     ✅ GET REVIEWS BY PRODUCT
  ============================ */
  async getProductReviews(req, res) {
    try {
      const productId = req.params.productId;

      if (!productId) {
        return res.status(400).json({ error: "productId is required" });
      }

      const list = await ReviewModel.listReviewsByProduct(productId);

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
  }

  /* ===========================
     ✅ UPDATE REVIEW
  ============================ */
  async updateReview(req, res) {
    const { id } = req.params;
    const { rating, comment } = req.body;

    try {
      const updated = await ReviewModel.updateReview(id, {
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
  }

  /* ===========================
     ✅ DELETE REVIEW
  ============================ */
  async deleteReview(req, res) {
    const { id } = req.params;

    try {
      await ReviewModel.deleteReview(id);

      res.json({
        message: Messages.PRODUCT_REVIEW.PRODUCT_REVIEW_DELETED,
      });
    } catch (error) {
      res.status(500).json({
        error,
        message: Messages.PRODUCT_REVIEW.PRODUCT_REVIEW_ERROR,
      });
    }
  }

  async bulkInsertReviews(req, res) {
    try {
      const { reviews } = req.body;
      console.log(reviews, "reviews");
      const b = await ReviewModel.createReviewsBulk(reviews);
      res.json({ message: Messages.PRODUCT_REVIEW.PRODUCT_REVIEW_SUCCESS });
    } catch (error) {
      console.log(error);
      res.status(500).json({
        error,
        message: Messages.PRODUCT_REVIEW.PRODUCT_REVIEW_ERROR,
      });
    }
  }
}

export default ReviewsController;
