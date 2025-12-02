import bcrypt from "bcrypt";
import { config as cfg } from "../config/index.js";

let knex;
let mongoose;
let UserSchema;
let UserM;

async function init(dbHandles) {
  if (cfg.db.type === "mongodb") {
    mongoose = dbHandles.mongoose;
    // define schema
    UserSchema = new mongoose.Schema(
      {
        name: String,
        email: { type: String, unique: true },
        password: String,
        role: { type: String, default: "customer" },
      },
      { timestamps: true }
    );
    UserM = mongoose.models.User || mongoose.model("User", UserSchema);
  } else {
    knex = dbHandles.knex;
    // for SQL we assume table 'users' exists. migrations are out of scope here.
  }
}

async function createUser({ name, email, password, role = "customer" }) {
  const hash = await bcrypt.hash(password, 10);
  if (cfg.db.type === "mongodb") {
    return UserM.create({ name, email, password: hash, role });
  } else {
    const [id] = await knex("users")
      .insert({ name, email, password: hash, role })
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
  if (cfg.db.type === "mongodb") return UserM.findOne({ email }).lean();
  return knex("users").where({ email }).first();
}

async function findById(id) {
  if (cfg.db.type === "mongodb") return UserM.findById(id).lean();
  return knex("users").where({ id }).first();
}

export default { init, createUser, findByEmail, findById };
