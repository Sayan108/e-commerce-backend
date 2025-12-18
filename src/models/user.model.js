import bcrypt from "bcrypt";
import { config as cfg, dbs, Roles } from "../config/index.js";

let knex;
let mongoose;
let UserM;

/* ===========================
          INIT
=========================== */
async function init(dbHandles) {
  if (cfg.db.type === dbs.MONGODB) {
    mongoose = dbHandles.mongoose;

    const userSchema = new mongoose.Schema(
      {
        name: { type: String, trim: true },
        email: {
          type: String,
          unique: true,
          required: true,
          lowercase: true,
          trim: true,
          index: true,
        },
        password: { type: String, required: true, select: false },
        role: {
          type: String,
          enum: Object.values(Roles),
          default: Roles.CUSTOMER,
        },
        phone: { type: String, trim: true },
        cartItemCount: { type: Number, default: 0 },
        profilePicture: { type: String },
      },
      { timestamps: true }
    );

    UserM = mongoose.models.User || mongoose.model("User", userSchema);
  } else {
    knex = dbHandles.knex;
  }
}

/* ===========================
      PUBLIC FIELDS ONLY
=========================== */
const USER_PUBLIC_FIELDS =
  "_id name email role phone cartItemCount profilePicture createdAt";

/* ===========================
      CREATE USER
=========================== */
async function createUser({ email, password, role = Roles.CUSTOMER }) {
  const hash = await bcrypt.hash(password, 10);

  if (cfg.db.type === dbs.MONGODB) {
    const user = await UserM.create({
      email: email.toLowerCase(),
      password: hash,
      role,
    });

    return UserM.findById(user._id).select(USER_PUBLIC_FIELDS).lean();
  }

  const [id] = await knex("users").insert({
    email: email.toLowerCase(),
    password: hash,
    role,
  });

  return knex("users").where({ id }).first();
}

/* ===========================
      FIND BY EMAIL (AUTH)
=========================== */
async function findByEmail(email) {
  if (cfg.db.type === dbs.MONGODB) {
    return UserM.findOne({ email: email.toLowerCase() })
      .select("+password")
      .lean();
  }

  return knex("users").where({ email: email.toLowerCase() }).first();
}

/* ===========================
      FIND BY ID (SAFE)
=========================== */
async function findById(id) {
  if (cfg.db.type === dbs.MONGODB) {
    return UserM.findById(id).select(USER_PUBLIC_FIELDS).lean();
  }

  return knex("users").where({ id }).first();
}

/* ===========================
      UPDATE USER
=========================== */
async function updateUser(id, changes) {
  delete changes.password; // ❌ never update password here

  if (cfg.db.type === dbs.MONGODB) {
    return UserM.findByIdAndUpdate(id, changes, { new: true })
      .select(USER_PUBLIC_FIELDS)
      .lean();
  }

  await knex("users").where({ id }).update(changes);
  return knex("users").where({ id }).first();
}

/* ===========================
      LIST USERS (ADMIN)
=========================== */
async function listUsers({
  page = 1,
  limit = 10,
  sortBy = "createdAt",
  sortOrder = "desc",
} = {}) {
  page = Number(page);
  limit = Math.min(Number(limit), 100);
  const skip = (page - 1) * limit;

  /* ---------- MONGODB ---------- */
  if (cfg.db.type === dbs.MONGODB) {
    const sort = { [sortBy]: sortOrder === "asc" ? 1 : -1 };

    const [data, total] = await Promise.all([
      UserM.find()
        .select(USER_PUBLIC_FIELDS)
        .sort(sort)
        .skip(skip)
        .limit(limit)
        .lean(),
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

  /* ---------- SQL ---------- */
  const query = knex("users");

  const [data, count] = await Promise.all([
    query
      .clone()
      .orderBy(sortBy, sortOrder)
      .limit(limit)
      .offset(skip)
      .select(
        "id",
        "name",
        "email",
        "role",
        "phone",
        "cartItemCount",
        "profilePicture",
        "createdAt"
      ),
    query.clone().count("* as count").first(),
  ]);

  return {
    data,
    pagination: {
      total: Number(count.count),
      page,
      limit,
      totalPages: Math.ceil(count.count / limit),
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
