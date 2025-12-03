import express from "express";
import { config as cfg } from "../config/index.js";

import { router as auth } from "./auth.routes.js";
import { router as users } from "./users.routes.js";
import { router as products } from "./products.routes.js";
import { router as categories } from "./categories.routes.js";
import { router as orders } from "./orders.routes.js";
import { router as reviews } from "./reviews.routes.js";
import { router as ecommercedashboard } from "./ecommercedashboard.routes.js";
import { router as address } from "./address.routes.js";

const router = express.Router();

if (cfg.routes.auth) router.use("/auth", auth);
if (cfg.routes.users) router.use("/users", users);
if (cfg.routes.products) router.use("/products", products);
if (cfg.routes.categories) router.use("/categories", categories);
if (cfg.routes.orders) router.use("/orders", orders);
if (cfg.routes.reviews) router.use("/reviews", reviews);
if (cfg.routes.ecommercedashboard)
  router.use("/ecommercedashboard", ecommercedashboard);
if (cfg.routes.address) router.use("/address", address);

export { router };
