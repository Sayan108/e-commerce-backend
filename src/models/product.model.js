import { config as cfg, dbs, sqlTableNames } from "../config/index.js";

let knex;
let mongoose;
let ProductM;

async function init(dbHandles) {
  if (cfg.db.type === dbs.MONGODB) {
    mongoose = dbHandles.mongoose;
    const s = new mongoose.Schema(
      {
        name: String,
        description: String,
        price: Number,
        categoryId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Category",
          required: true,
        },
        stock: Number,
        imageUrl: String,
      },
      { timestamps: true }
    );
    ProductM = mongoose.models.Product || mongoose.model("Product", s);
  } else {
    knex = dbHandles.knex;
  }
}

async function createProduct(data) {
  if (cfg.db.type === dbs.MONGODB) return ProductM.create(data);
  const [id] = await knex(sqlTableNames.PRODUCTS)
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
  if (cfg.db.type === dbs.MONGODB) return ProductM.find().lean();
  return knex("products").select("*");
}

async function getProduct(id) {
  if (cfg.db.type === dbs.MONGODB) return ProductM.findById(id).lean();
  return knex("products").where({ id }).first();
}

async function updateProduct(id, changes) {
  if (cfg.db.type === dbs.MONGODB)
    return ProductM.findByIdAndUpdate(id, changes, { new: true }).lean();
  await knex("products").where({ id }).update(changes);
  return knex("products").where({ id }).first();
}

async function deleteProduct(id) {
  if (cfg.db.type === dbs.MONGODB) return ProductM.findByIdAndDelete(id);
  return knex("products").where({ id }).del();
}

async function bulkInsertProducts(products) {
  if (!Array.isArray(products) || products.length === 0) {
    throw new Error("Products must be a non-empty array");
  }

  // ---------- ✅ MongoDB ----------

  if (cfg.db.type === dbs.MONGODB) {
    return ProductM.insertMany(products, {
      ordered: false, // prevents full failure if one item is invalid
    });
  }

  // ---------- ✅ SQL (Knex with Transaction) ----------
  return knex.transaction(async (trx) => {
    const ids = await trx("products")
      .insert(products)
      .returning("id")
      .catch(async (err) => {
        // MySQL / SQLite fallback
        if (err?.message?.includes("RETURNING")) {
          const res = await trx("products").insert(products);
          return res;
        }
        throw err;
      });

    return ids;
  });
}

export default {
  init,
  createProduct,
  listProducts,
  getProduct,
  updateProduct,
  deleteProduct,
  bulkInsertProducts,
};
