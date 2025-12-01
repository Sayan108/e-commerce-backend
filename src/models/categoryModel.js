const cfg = require("../config");

let knex;
let mongoose;
let CatM;

async function init(dbHandles) {
  if (cfg.db.type === "mongodb") {
    mongoose = dbHandles.mongoose;
    const s = new mongoose.Schema({ name: String }, { timestamps: true });
    CatM = mongoose.models.Category || mongoose.model("Category", s);
  } else {
    knex = dbHandles.knex;
  }
}

async function createCategory(data) {
  if (cfg.db.type === "mongodb") return CatM.create(data);
  const [id] = await knex("categories")
    .insert(data)
    .returning("id")
    .catch(async (err) => {
      if (err && err.message && err.message.indexOf("RETURNING") !== -1) {
        const res = await knex("categories").insert(data);
        return [res[0]];
      }
      throw err;
    });
  return knex("categories").where({ id }).first();
}

async function listCategories() {
  if (cfg.db.type === "mongodb") return CatM.find().lean();
  return knex("categories").select("*");
}

module.exports = { init, createCategory, listCategories };
