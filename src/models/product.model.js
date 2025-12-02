import { config as cfg } from "../config/index.js";

let knex;
let mongoose;
let ProductM;

async function init(dbHandles) {
  if (cfg.db.type === cfg.dbs.MONGODB) {
    mongoose = dbHandles.mongoose;
    const s = new mongoose.Schema(
      {
        name: String,
        description: String,
        price: Number,
        categoryId: String,
        stock: Number,
      },
      { timestamps: true }
    );
    ProductM = mongoose.models.Product || mongoose.model("Product", s);
  } else {
    knex = dbHandles.knex;
  }
}

async function createProduct(data) {
  if (cfg.db.type === "mongodb") return ProductM.create(data);
  const [id] = await knex("products")
    .insert(data)
    .returning("id")
    .catch(async (err) => {
      if (err && err.message && err.message.indexOf("RETURNING") !== -1) {
        const res = await knex("products").insert(data);
        return [res[0]];
      }
      throw err;
    });
  return knex("products").where({ id }).first();
}

async function listProducts() {
  if (cfg.db.type === "mongodb") return ProductM.find().lean();
  return knex("products").select("*");
}

async function getProduct(id) {
  if (cfg.db.type === "mongodb") return ProductM.findById(id).lean();
  return knex("products").where({ id }).first();
}

async function updateProduct(id, changes) {
  if (cfg.db.type === "mongodb")
    return ProductM.findByIdAndUpdate(id, changes, { new: true }).lean();
  await knex("products").where({ id }).update(changes);
  return knex("products").where({ id }).first();
}

async function deleteProduct(id) {
  if (cfg.db.type === "mongodb") return ProductM.findByIdAndDelete(id);
  return knex("products").where({ id }).del();
}

export default {
  init,
  createProduct,
  listProducts,
  getProduct,
  updateProduct,
  deleteProduct,
};
