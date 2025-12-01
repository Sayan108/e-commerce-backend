const express = require("express");
const bodyParser = require("body-parser");
const cfg = require("./config");
const routes = require("./routes");
const createKnex = require("./db/knexClient");
const connectMongoose = require("./db/mongooseClient");

const userModel = require("./models/userModel");
const productModel = require("./models/productModel");
const categoryModel = require("./models/categoryModel");
const orderModel = require("./models/orderModel");
const reviewModel = require("./models/reviewModel");

async function main() {
  const app = express();
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
  ]);

  app.use("/api", routes);

  app.get("/", (req, res) => res.json({ ok: true, db: cfg.db.type }));

  app.listen(cfg.port, () => {
    console.log(`Server running on port ${cfg.port} with DB=${cfg.db.type}`);
  });
}

main().catch((err) => {
  console.error("Failed to start", err);
  process.exit(1);
});
