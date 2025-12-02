const dotenv = require("dotenv");
dotenv.config();

const getBool = (v, def = false) => {
  if (v === undefined) return def;
  return String(v).toLowerCase() === "true";
};

module.exports = {
  port: 3000,
  jwtSecret: process.env.JWT_SECRET || "secretkey",
  db: {
    type: "mongodb",
  },
  routes: {
    auth: true,
    users: true,
    products: true,
    categories: true,
    orders: true,
    reviews: true,
  },
  rawEnv: process.env,
};
