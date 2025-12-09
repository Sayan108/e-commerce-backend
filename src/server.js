import express from "express";
import bodyParser from "body-parser";

import { config as cfg, pingUrl } from "./config/index.js";
import { router as routes } from "./routes/index.js";
import createKnex from "./db/knex.client.js";
import connectMongoose from "./db/mongoose.client.js";

import userModel from "./models/user.model.js";
import productModel from "./models/product.model.js";
import categoryModel from "./models/category.model.js";
import orderModel from "./models/order.model.js";
import reviewModel from "./models/review.model.js";
import ecommercedashboardModel from "./models/ecommercedashboard.model.js";
import addressModel from "./models/address.model.js";
import cors from "cors";
import axios from "axios";

async function main() {
  const app = express();
  app.use(cors());
  app.use(bodyParser.json());

  let dbHandles = {};

  if (cfg.db.type === "mongodb") {
    const mongoose = await connectMongoose();
    dbHandles.mongoose = mongoose;
  } else {
    const knex = createKnex();
    dbHandles.knex = knex;
  }

  // initialize models
  await Promise.all([
    userModel.init(dbHandles),
    productModel.init(dbHandles),
    categoryModel.init(dbHandles),
    orderModel.init(dbHandles),
    reviewModel.init(dbHandles),
    ecommercedashboardModel.init(dbHandles),
    addressModel.init(dbHandles),
  ]);

  app.use("/api", routes);

  app.get("/", (req, res) => res.json({ ok: true, db: cfg.db.type }));

  app.use((err, req, res, next) => {
    console.error("GLOBAL ERROR:", err);
    res.status(err.status || 500).json({
      success: false,
      message: err.message || "Internal Server Error",
    });
  });

  app.listen(cfg.port, () => {
    console.log(`Server running on port ${cfg.port} with DB=${cfg.db.type}`);
  });
}
setInterval(async () => {
  try {
    await axios.get(pingUrl);
    console.log("✅ Keep-alive ping sent:", new Date().toISOString());
  } catch (err) {
    console.error("❌ Keep-alive ping failed:", err.message);
  }
}, 2 * 60 * 100);
try {
  await main();
} catch (error) {
  console.error("Failed to start", error);
  process.exit(1);
}
