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

async function listProducts({
  page = 1,
  limit = 10,
  search = "",
  categoryId,
  minPrice,
  maxPrice,
  inStock,
  sortBy = "createdAt", // default sort by createdAt
  sortOrder = "desc", // default sort descending
}) {
  page = Number(page);
  limit = Math.min(Number(limit), 100); // safety cap for limit
  const skip = (page - 1) * limit;

  /* ------------------------ MONGODB ------------------------ */
  if (cfg.db.type === dbs.MONGODB) {
    const filter = {};

    // Handle search filter if provided
    if (search) {
      filter.name = { $regex: search, $options: "i" }; // case insensitive search
    }

    // Handle category filter if provided
    if (categoryId) {
      filter.categoryId = categoryId;
    }

    // Handle stock filter if provided
    if (inStock !== undefined) {
      filter.stock = inStock === "true" ? { $gt: 0 } : { $lte: 0 }; // check stock
    }

    // Handle price range filters if provided
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice); // minimum price
      if (maxPrice) filter.price.$lte = Number(maxPrice); // maximum price
    }

    // Sorting
    const sort = {
      [sortBy]: sortOrder === "asc" ? 1 : -1, // ascending or descending
    };

    // Fetch data and total count in parallel
    const [data, total] = await Promise.all([
      ProductM.find(filter).sort(sort).skip(skip).limit(limit).lean(),
      ProductM.countDocuments(filter),
    ]);

    return {
      data,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit), // calculate total pages
      },
    };
  }

  /* ------------------------ SQL / KNEX ------------------------ */

  const query = knex("products");

  // Handle search filter if provided
  if (search) {
    query.whereILike("name", `%${search}%`);
  }

  // Handle category filter if provided
  if (categoryId) {
    query.where("categoryId", categoryId);
  }

  // Handle stock filter if provided
  if (inStock !== undefined) {
    if (inStock === "true") {
      query.where("stock", ">", 0); // only in-stock items
    } else {
      query.where("stock", "<=", 0); // out-of-stock items
    }
  }

  // Handle price range filters if provided
  if (minPrice) {
    query.where("price", ">=", Number(minPrice)); // minimum price
  }
  if (maxPrice) {
    query.where("price", "<=", Number(maxPrice)); // maximum price
  }

  // Count the total number of products (for pagination)
  const countQuery = query.clone().count("* as count").first();

  // Fetch the product data (with pagination)
  const dataQuery = query
    .clone()
    .orderBy(sortBy, sortOrder)
    .limit(limit)
    .offset(skip)
    .select("*");

  // Execute both queries in parallel
  const [data, countResult] = await Promise.all([dataQuery, countQuery]);

  // Total count from the count query
  const total = Number(countResult.count);

  return {
    data,
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit), // calculate total pages
    },
  };
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

async function getProductById(productId) {
  if (cfg.db.type === dbs.MONGODB) {
    return ProductM.findById(productId);
  }
  return knex("products").where({ id: productId }).first();
}

async function validateProducts(items) {
  if (cfg.db.type === dbs.MONGODB) {
    const productIds = items.map((item) => item.productId);
    const products = await ProductM.find({ _id: { $in: productIds } }).lean();

    return productIds.length === products.length;
  }
  const productIds = items.map((item) => item.productId);
  const products = await knex("products").whereIn("id", productIds);

  return productIds.length === products.length;
}

export default {
  init,
  createProduct,
  listProducts,
  updateProduct,
  deleteProduct,

  getProductById,
  bulkInsertProducts,
  validateProducts,
};
