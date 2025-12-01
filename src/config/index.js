const dotenv = require("dotenv");
dotenv.config();

const getBool = (v, def = false) => {
  if (v === undefined) return def;
  return String(v).toLowerCase() === "true";
};

module.exports = {
  port: process.env.PORT || 3000,
  jwtSecret: process.env.JWT_SECRET || "change_me",
  db: {
    type: (process.env.DB_TYPE || "postgresql").toLowerCase(),
  },
  routes: {
    auth: getBool(process.env.ENABLE_AUTH, true),
    users: getBool(process.env.ENABLE_USERS, true),
    products: getBool(process.env.ENABLE_PRODUCTS, true),
    categories: getBool(process.env.ENABLE_CATEGORIES, true),
    orders: getBool(process.env.ENABLE_ORDERS, true),
    reviews: getBool(process.env.ENABLE_REVIEWS, true),
  },
  rawEnv: process.env,
};
