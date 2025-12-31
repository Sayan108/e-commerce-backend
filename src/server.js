import express from "express";
import bodyParser from "body-parser";

import cors from "cors";
import axios from "axios";
import UserModel from "./modules/auth/user.model.js";
import ProductModel from "./modules/products/product.model.js";
import CategoryModel from "./modules/categories/category.model.js";
import OrderModel from "./modules/orders/order.model.js";
import ReviewModel from "./modules/reviews/review.model.js";
import EcommerceDashboardModel from "./modules/dashboard/ecommercedashboard.model.js";
import AddressModel from "./modules/address/address.model.js";
import CartModel from "./modules/cart/cart.model.js";

import { config as cfg, pingUrl } from "./config/index.js";

import DbClient from "./db/knex.client.js";
import MongooseClient from "./db/mongoose.client.js";

import { router as routes } from "./modules/index.js";

class Server {
  async start() {
    const app = express();
    app.use(cors());
    app.use(bodyParser.json({ limit: "50mb" }));
    app.use(bodyParser.urlencoded({ extended: true, limit: "50mb" }));

    let dbHandles = {};

    if (cfg.db.type === "mongodb") {
      const mongoose = await MongooseClient.connect();
      dbHandles.mongoose = mongoose;
    } else {
      const knex = DbClient.createKnex();
      dbHandles.knex = knex;
    }

    // initialize models
    await Promise.all([
      UserModel.init(dbHandles),
      ProductModel.init(dbHandles),
      CategoryModel.init(dbHandles),
      OrderModel.init(dbHandles),
      ReviewModel.init(dbHandles),
      EcommerceDashboardModel.init(dbHandles),
      AddressModel.init(dbHandles),
      CartModel.init(dbHandles),
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

    // Keep-alive ping
    setInterval(async () => {
      try {
        await axios.get(pingUrl);
        console.log("✅ Keep-alive ping sent:", new Date().toISOString());
      } catch (err) {
        console.error("❌ Keep-alive ping failed:", err.message);
      }
    }, 2 * 60 * 1000);
  }
}

try {
  const server = new Server();
  await server.start();
} catch (error) {
  console.error("Failed to start", error);
  process.exit(1);
}
