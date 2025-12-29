import { config as cfg, dbs } from "../../config/index.js";

let knex;
let mongoose;
let ReviewM;

/* ===========================
        INIT
=========================== */
async function init(dbHandles) {
  if (cfg.db.type === dbs.MONGODB) {
    mongoose = dbHandles.mongoose;

    const reviewSchema = new mongoose.Schema(
      {
        userId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
          required: true,
        },
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        rating: {
          type: Number,
          required: true,
          min: 1,
          max: 5,
          set: (v) => Math.round(v * 2) / 2, // ⭐ 0.5 steps
        },
        comment: {
          type: String,
          trim: true,
          maxlength: 500,
        },
        userName: String,
        userProfilePicture: String,
      },
      { timestamps: true }
    );

    // ✅ One review per user per product
    reviewSchema.index({ userId: 1, productId: 1 }, { unique: true });

    ReviewM = mongoose.models.Review || mongoose.model("Review", reviewSchema);
  } else {
    knex = dbHandles.knex;
  }
}

/* ===========================
      COMMON SELECT FIELDS
=========================== */
const REVIEW_FIELDS =
  "_id userId productId rating comment userName userProfilePicture createdAt";

/* ===========================
      CREATE REVIEW
=========================== */
async function createReview(data) {
  if (cfg.db.type === dbs.MONGODB) {
    const doc = await ReviewM.create(data);
    return ReviewM.findById(doc._id).select(REVIEW_FIELDS).lean();
  }

  const [id] = await knex("reviews").insert(data);
  return knex("reviews").where({ id }).first();
}

/* ===========================
      BULK INSERT
=========================== */
async function createReviewsBulk(reviews) {
  if (!Array.isArray(reviews) || reviews.length === 0) return [];

  if (cfg.db.type === dbs.MONGODB) {
    await ReviewM.insertMany(reviews, { ordered: false });
    return ReviewM.find().select(REVIEW_FIELDS).lean();
  }

  await knex("reviews").insert(reviews);
  return knex("reviews").orderBy("created_at", "desc").limit(reviews.length);
}

/* ===========================
      LIST BY PRODUCT
=========================== */
async function listReviewsByProduct(productId) {
  if (cfg.db.type === dbs.MONGODB) {
    return ReviewM.find({ productId })
      .select(REVIEW_FIELDS)
      .sort({ createdAt: -1 })
      .lean();
  }

  return knex("reviews")
    .where({ productId })
    .orderBy("created_at", "desc")
    .select("*");
}

/* ===========================
      UPDATE REVIEW
=========================== */
async function updateReview(id, changes) {
  if (cfg.db.type === dbs.MONGODB) {
    return ReviewM.findByIdAndUpdate(id, changes, { new: true })
      .select(REVIEW_FIELDS)
      .lean();
  }

  await knex("reviews").where({ id }).update(changes);
  return knex("reviews").where({ id }).first();
}

/* ===========================
      DELETE REVIEW
=========================== */
async function deleteReview(id) {
  if (cfg.db.type === dbs.MONGODB) {
    return ReviewM.findByIdAndDelete(id).lean();
  }

  return knex("reviews").where({ id }).del();
}

export default {
  init,
  createReview,
  createReviewsBulk,
  listReviewsByProduct,
  updateReview,
  deleteReview,
};
