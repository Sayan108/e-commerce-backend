import { config as cfg, dbs } from "../config/index.js";

let knex;
let mongoose;
let ReviewM;

async function init(dbHandles) {
  if (cfg.db.type === dbs.MONGODB) {
    mongoose = dbHandles.mongoose;
    const s = new mongoose.Schema(
      {
        userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
        rating: Number,
        comment: String,
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
  deleteReview,
  updateReview,
};
