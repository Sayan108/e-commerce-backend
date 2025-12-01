const express = require("express");
const cfg = require("../config");
const auth = require("./auth");
const users = require("./users");
const products = require("./products");
const categories = require("./categories");
const orders = require("./orders");
const reviews = require("./reviews");

const router = express.Router();

if (cfg.routes.auth) router.use("/auth", auth);
if (cfg.routes.users) router.use("/users", users);
if (cfg.routes.products) router.use("/products", products);
if (cfg.routes.categories) router.use("/categories", categories);
if (cfg.routes.orders) router.use("/orders", orders);
if (cfg.routes.reviews) router.use("/reviews", reviews);

module.exports = router;
