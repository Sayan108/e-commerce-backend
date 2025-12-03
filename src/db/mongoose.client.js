import mongoose from "mongoose";
import { config as cfg } from "../config/index.js";

export default async function connectMongoose() {
  const user = cfg.db.dbuser;
  const pass = cfg.db.dbpassword;
  const host = cfg.db.dbhost; // e.g. cluster0.ekiep4r.mongodb.net
  const dbname = cfg.db.dbname || "shopdb";

  // Encode password safely
  const encodedPassword = encodeURIComponent(pass || "");

  // Build URI
  const uri = "mongodb://127.0.0.1:27017/shopdb";

  try {
    await mongoose.connect(uri, {
      autoIndex: true,
    });
    console.log("MongoDB connected successfully");
  } catch (err) {
    console.error("MongoDB connection error:", err.message);
    throw err;
  }

  return mongoose;
}
