import { config as cfg, dbs } from "../config/index.js";

let knex;
let mongoose;
let ReviewM;

async function init(dbHandles) {
  if (cfg.db.type === dbs.MONGODB) {
    mongoose = dbHandles.mongoose;
    const s = new mongoose.Schema(
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
        rating: { type: Number, required: true, min: 1.0, max: 5.0 },
        comment: { type: String },

        userName: { type: String },

        userProfilePicture: { type: String },
      },
      { timestamps: true }
    );
    ReviewM = mongoose.models.Review || mongoose.model("Review", s);
  } else {
    knex = dbHandles.knex;
  }
}

async function createReview(data) {
  if (cfg.db.type === dbs.MONGODB) return ReviewM.create(data);
  const [id] = await knex("reviews")
    .insert(data)
    .returning("id")
    .catch(async (err) => {
      if (err && err.message && err.message.indexOf("RETURNING") !== -1) {
        const res = await knex("reviews").insert(data);
        return [res[0]];
      }
      throw err;
    });
  return knex("reviews").where({ id }).first();
}

async function createReviewsBulk(dataArray) {
  if (!Array.isArray(dataArray) || dataArray.length === 0) {
    return [];
  }

  /* -------------------- MONGODB -------------------- */
  if (cfg.db.type === dbs.MONGODB) {
    return ReviewM.insertMany(dataArray, { ordered: true });
  }

  /* -------------------- SQL (KNEX) -------------------- */
  try {
    const ids = await knex("reviews").insert(dataArray).returning("id");

    // PostgreSQL returns array of objects or ids
    const insertedIds = ids.map((r) => (typeof r === "object" ? r.id : r));

    return knex("reviews").whereIn("id", insertedIds);
  } catch (err) {
    // ---- MySQL / SQLite fallback (no RETURNING support)
    if (err?.message?.includes("RETURNING")) {
      await knex("reviews").insert(dataArray);

      // Fetch latest inserted rows (best effort)
      return knex("reviews").orderBy("id", "desc").limit(dataArray.length);
    }
    throw err;
  }
}

async function listReviewsByProduct(productId) {
  if (cfg.db.type === dbs.MONGODB) return ReviewM.find({ productId }).lean();
  return knex("reviews").where({ productId }).select("*");
}

async function deleteReview(id) {
  if (cfg.db.type === dbs.MONGODB) {
    return ReviewM.findByIdAndDelete(id);
  }
  return knex("reviews").where({ id }).del();
}

async function updateReview(id, changes) {
  if (cfg.db.type === dbs.MONGODB) {
    return ReviewM.findByIdAndUpdate(id, changes, { new: true });
  }
  await knex("reviews").where({ id }).update(changes);
  return knex("reviews").where({ id }).first();
}

export default {
  init,
  createReview,
  listReviewsByProduct,
  createReviewsBulk,
  deleteReview,
  updateReview,
};
