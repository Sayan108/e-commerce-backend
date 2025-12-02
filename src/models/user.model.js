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
        email: { type: String, unique: true },
        password: String,
        role: { type: String, default: Roles.CUSTOMER },
      },
      { timestamps: true }
    );
    UserM = mongoose.models.User || mongoose.model("User", UserSchema);
  } else {
    knex = dbHandles.knex;
  }
}

async function createUser({ name, email, password, role = Roles.CUSTOMER }) {
  const hash = await bcrypt.hash(password, 10);
  if (cfg.db.type === dbs.MONGODB) {
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
  if (cfg.db.type === dbs.MONGODB) return UserM.findOne({ email }).lean();
  return knex("users").where({ email }).first();
}

async function findById(id) {
  if (cfg.db.type === dbs.MONGODB) return UserM.findById(id).lean();
  return knex("users").where({ id }).first();
}

export default { init, createUser, findByEmail, findById };
