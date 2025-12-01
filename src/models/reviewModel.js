const cfg = require("../config");

let knex;
let mongoose;
let ReviewM;

async function init(dbHandles) {
  if (cfg.db.type === "mongodb") {
    mongoose = dbHandles.mongoose;
    const s = new mongoose.Schema(
      {
        userId: String,
        productId: String,
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
  if (cfg.db.type === "mongodb") return ReviewM.create(data);
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

module.exports = { init, createReview };
