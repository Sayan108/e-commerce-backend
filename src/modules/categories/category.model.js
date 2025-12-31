import { config as cfg, dbs } from "../../config/index.js";

let knex;
let mongoose;
let CatM;

class CategoryModel {
  static async init(dbHandles) {
    if (cfg.db.type === dbs.MONGODB) {
      mongoose = dbHandles.mongoose;

      const schema = new mongoose.Schema(
        {
          name: { type: String, required: true, unique: true },
          imageurl: { type: String, required: true },
          isFeatueredCategory: { type: Boolean, default: false },
        },
        { timestamps: true }
      );

      CatM = mongoose.models.Category || mongoose.model("Category", schema);
    } else {
      knex = dbHandles.knex;
    }
  }

  /* -------------------- CREATE -------------------- */
  static async createCategory(data) {
    if (cfg.db.type === dbs.MONGODB) {
      const doc = await CatM.create(data);
      return {
        _id: doc._id,
        name: doc.name,
        imageurl: doc.imageurl,
      };
    }

    const [id] = await knex("categories")
      .insert(data)
      .returning("id")
      .catch(async (err) => {
        if (err?.message?.includes("RETURNING")) {
          const res = await knex("categories").insert(data);
          return [res[0]];
        }
        throw err;
      });

    return knex("categories")
      .where({ id })
      .select("id as _id", "name", "imageurl")
      .first();
  }

  /* -------------------- LIST -------------------- */
  static async listCategories() {
    if (cfg.db.type === dbs.MONGODB) {
      return CatM.find().select("_id name imageurl").lean();
    }

    return knex("categories").select("id as _id", "name", "imageurl");
  }

  /* -------------------- GET BY ID -------------------- */
  static async getCategoryById(categoryId) {
    if (cfg.db.type === dbs.MONGODB) {
      return CatM.findById(categoryId).select("_id name imageurl").lean();
    }

    return knex("categories")
      .where({ id: categoryId })
      .select("id as _id", "name", "imageurl")
      .first();
  }

  /* -------------------- UPDATE -------------------- */
  static async updateCategory(categoryId, data) {
    if (cfg.db.type === dbs.MONGODB) {
      return CatM.findByIdAndUpdate(categoryId, data, { new: true })
        .select("_id name imageurl")
        .lean();
    }

    await knex("categories").where({ id: categoryId }).update(data);

    return knex("categories")
      .where({ id: categoryId })
      .select("id as _id", "name", "imageurl")
      .first();
  }

  /* -------------------- DELETE -------------------- */
  static async deleteCategory(categoryId) {
    if (cfg.db.type === dbs.MONGODB) {
      return CatM.findByIdAndDelete(categoryId)
        ?.select("_id name imageurl")
        ?.lean();
    }

    return knex("categories").where({ id: categoryId }).del();
  }

  /* -------------------- BULK INSERT -------------------- */
  static async bulkInsertCategories(categories) {
    if (cfg.db.type === dbs.MONGODB) {
      const docs = await CatM.insertMany(categories);
      return docs.map((d) => ({
        _id: d._id,
        name: d.name,
        imageurl: d.imageurl,
      }));
    }

    return knex("categories").insert(categories);
  }

  /* -------------------- FEATURED CATEGORIES -------------------- */
  static async listFeaturedCategories() {
    /* ----------- MONGODB ----------- */
    if (cfg.db.type === dbs.MONGODB) {
      return CatM.find({ isFeatueredCategory: true })
        .select("_id name imageurl")
        .lean();
    }

    /* ----------- SQL / KNEX ----------- */
    return knex("categories")
      .where({ isFeatueredCategory: true })
      .select("id as _id", "name", "imageurl");
  }
}

export default CategoryModel;
