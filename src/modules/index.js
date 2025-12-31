import express from "express";
import { config as cfg } from "../config/index.js";

import { router as auth } from "../modules/auth/auth.routes.js";
import { router as users } from "../modules/auth/users.routes.js";
import { router as products } from "../modules/products/products.routes.js";
import { router as categories } from "../modules/categories/categories.routes.js";
import { router as orders } from "../modules/orders/orders.routes.js";
import { router as reviews } from "../modules/reviews/reviews.routes.js";
import { router as ecommercedashboard } from "../modules/dashboard/ecommercedashboard.routes.js";
import { router as address } from "../modules/address/address.routes.js";
import { router as cart } from "../modules/cart/cart.routes.js";

class Modules {
  static getRouter() {
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
    if (cfg.routes.cart) router.use("/cart", cart);

    return router;
  }
}

export const router = Modules.getRouter();
