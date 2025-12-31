import { config as cfg, dbs, sqlTableNames } from "../../config/index.js";

let knex;
let mongoose;
let ProductM;

class ProductModel {
  static async init(dbHandles) {
    if (cfg.db.type === dbs.MONGODB) {
      mongoose = dbHandles.mongoose;
      const s = new mongoose.Schema(
        {
          name: String,
          description: String,
          price: Number,
          originalPrice: Number,
          categoryId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Category",
            required: true,
          },
          features: [{ type: String }],
          stock: Number,
          imageurl: String,
          rating: Number,
          reviewCount: Number,

          isNewArrival: { type: Boolean, default: false },
        },
        { timestamps: true }
      );
      ProductM = mongoose.models.Product || mongoose.model("Product", s);
    } else {
      knex = dbHandles.knex;
    }
  }

  static async createProduct(data) {
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

  static async listProducts({
    page = 1,
    limit = 10,
    search = "",
    categoryId = null,
    minPrice = null,
    maxPrice = null,
    inStock = null,
    sortBy = "createdAt",
    sortOrder = "desc",
  }) {
    page = Number(page);
    limit = Math.min(Number(limit), 100);
    const skip = (page - 1) * limit;

    /* ------------------------ MONGODB ------------------------ */
    if (cfg.db.type === dbs.MONGODB) {
      const filter = {};

      // ✅ SEARCH
      if (search && search.trim() !== "") {
        filter.name = { $regex: search, $options: "i" };
      }

      // ✅ CATEGORY
      if (categoryId && mongoose.Types.ObjectId.isValid(categoryId)) {
        filter.categoryId = new mongoose.Types.ObjectId(categoryId);
      }

      // ✅ STOCK (ONLY apply if explicitly provided)
      if (inStock !== null) {
        filter.stock = inStock ? { $gt: 0 } : { $lte: 0 };
      }

      // ✅ PRICE RANGE (ONLY if provided)
      if (minPrice !== null || maxPrice !== null) {
        filter.price = {};

        if (minPrice !== null) {
          filter.price.$gte = Number(minPrice);
        }

        if (maxPrice !== null) {
          filter.price.$lte = Number(maxPrice);
        }
      }

      // ✅ SORT
      const sort = {
        [sortBy]: sortOrder === "asc" ? 1 : -1,

        _id: 1,
      };

      const [data, total] = await Promise.all([
        ProductM.find(filter).sort(sort).skip(skip).limit(limit).lean(),
        ProductM.countDocuments(filter),
      ]);

      return {
        data: data.map((item) => {
          return {
            _id: item._id,
            name: item.name,
            price: item.price,
            originalPrice: item.originalPrice,
            imageurl: item.imageurl,
          };
        }),
        pagination: {
          total,
          page,
          limit,
          totalPages: Math.ceil(total / limit),
        },
      };
    }

    /* ------------------------ SQL / KNEX ------------------------ */

    const query = knex("products");

    if (search && search.trim() !== "") {
      query.whereILike("name", `%${search}%`);
    }

    if (categoryId) {
      query.where("categoryId", categoryId);
    }

    if (inStock !== null) {
      inStock ? query.where("stock", ">", 0) : query.where("stock", "<=", 0);
    }

    if (minPrice !== null) {
      query.where("price", ">=", Number(minPrice));
    }

    if (maxPrice !== null) {
      query.where("price", "<=", Number(maxPrice));
    }

    const countQuery = query.clone().count("* as count").first();

    const dataQuery = query
      .clone()
      .orderBy(sortBy, sortOrder)
      .limit(limit)
      .offset(skip)
      .select("*");

    const [data, countResult] = await Promise.all([dataQuery, countQuery]);

    const total = Number(countResult.count);

    return {
      data,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  static async updateProduct(id, changes) {
    if (cfg.db.type === dbs.MONGODB)
      return ProductM.findByIdAndUpdate(id, changes, { new: true }).lean();
    await knex("products").where({ id }).update(changes);
    return knex("products").where({ id }).first();
  }

  static async deleteProduct(id) {
    if (cfg.db.type === dbs.MONGODB) return ProductM.findByIdAndDelete(id);
    return knex("products").where({ id }).del();
  }

  static async bulkInsertProducts(products) {
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

  static async getProductById(productId) {
    if (cfg.db.type === dbs.MONGODB) {
      return ProductM.findById(productId)
        .select(
          "_id name description features price originalPrice imageurl rating reviewCount stock"
        )
        .lean();
    }

    return knex("products")
      .where({ id: productId })
      .select(
        "id as _id",
        "name",
        "description",
        "price",
        "originalPrice",
        "imageurl",
        "rating",
        "reviewCount",
        "stock",
        "features"
      )
      .first();
  }

  static async validateProducts(items) {
    try {
      // Extract productIds correctly
      const productIds = items.map((item) => item.productId);

      if (!productIds.length) return { valid: false };

      // ------------------ MONGODB ------------------
      if (cfg.db.type === dbs.MONGODB) {
        const products = await ProductM.find({
          _id: { $in: productIds },
        }).lean();

        return { valid: products.length === productIds.length };
      }

      // ------------------ KNEX / SQL ------------------
      const products = await knex("products").whereIn("id", productIds);

      return { valid: products.length === productIds.length };
    } catch (err) {
      console.error("validateProducts error:", err);
      return { valid: false };
    }
  }

  /* -------------------- FEATURED PRODUCTS -------------------- */
  static async listNewProducts({ limit = 8 } = {}) {
    limit = Math.min(Number(limit), 20);

    /* ----------- MONGODB ----------- */
    if (cfg.db.type === dbs.MONGODB) {
      return ProductM.find({ isNewArrival: true })
        .sort({ createdAt: -1 })
        .limit(limit)
        .select("_id name price originalPrice imageurl")
        .lean();
    }

    /* ----------- SQL / KNEX ----------- */
    return knex("products")
      .where({ isFeatured: true })
      .orderBy("createdAt", "desc")
      .limit(limit)
      .select(
        "id as _id",
        "name",
        "price",
        "originalPrice",
        "imageurl",
        "rating",
        "reviewCount"
      );
  }
}

export default ProductModel;
