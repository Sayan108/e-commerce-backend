import bcrypt from "bcrypt";
import { config as cfg, dbs, Roles } from "../config/index.js";

let knex;
let mongoose;
let UserSchema;
let UserM;

async function init(dbHandles) {
  if (cfg.db.type === dbs.MONGODB) {
    mongoose = dbHandles.mongoose;
    // define schema
    UserSchema = new mongoose.Schema(
      {
        name: String,
        email: { type: String, unique: true, required: true },
        password: String,
        role: { type: String, default: Roles.CUSTOMER, required: true },
        phone: { type: String },
        token: [{ type: String }],
      },
      { timestamps: true }
    );
    UserM = mongoose.models.User || mongoose.model("User", UserSchema);
  } else {
    knex = dbHandles.knex;
  }
}

async function createUser({ email, password, role = Roles.CUSTOMER }) {
  const hash = await bcrypt.hash(password, 10);
  if (cfg.db.type === dbs.MONGODB) {
    return UserM.create({ email, password: hash, role });
  } else {
    const [id] = await knex("users")
      .insert({ email, password: hash, role })
      .returning("id")
      .catch(async (err) => {
        // sqlite/pg differences
        if (err && err.message && err.message.indexOf("RETURNING") !== -1) {
          const res = await knex("users").insert({
            name,
            email,
            password: hash,
            role,
          });
          return [res[0]];
        }
        throw err;
      });
    return knex("users").where({ id }).first();
  }
}

async function findByEmail(email) {
  if (cfg.db.type === dbs.MONGODB) return UserM.findOne({ email }).lean();
  return knex("users").where({ email }).first();
}

async function findById(id) {
  if (cfg.db.type === dbs.MONGODB) return UserM.findById(id).lean();
  return knex("users").where({ id }).first();
}

async function updateUser(id, changes) {
  if (cfg.db.type === dbs.MONGODB) {
    return UserM.findByIdAndUpdate(id, changes, { new: true }).lean();
  }
  await knex("users").where({ id }).update(changes);
  return knex("users").where({ id }).first();
}

async function listUsers({
  page = 1,
  limit = 10,
  sortBy = "createdAt", // name | email | createdAt
  sortOrder = "desc", // asc | desc
} = {}) {
  page = Number(page);
  limit = Math.min(Number(limit), 100); // safety cap
  const skip = (page - 1) * limit;

  /* ---------------------- MONGODB ---------------------- */
  if (cfg.db.type === dbs.MONGODB) {
    const sort = {
      [sortBy]: sortOrder === "asc" ? 1 : -1,
    };

    const [data, total] = await Promise.all([
      UserM.find().sort(sort).skip(skip).limit(limit).lean(),
      UserM.countDocuments(),
    ]);

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

  /* ---------------------- SQL / KNEX ---------------------- */

  const query = knex("users");

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

export default {
  init,
  createUser,
  findByEmail,
  findById,
  updateUser,
  listUsers,
};
