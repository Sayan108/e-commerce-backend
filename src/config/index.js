import dotenv from "dotenv";

dotenv.config();

const getBool = (v, def = false) => {
  if (v === undefined) return def;
  return String(v).toLowerCase() === "true";
};

export const config = {
  port: 3000,
  jwtSecret: process.env.JWT_SECRET || "secretkey",
  db: {
    type: process.env.DB_TYPE || "mongodb",
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

export const Roles = {
  ADMIN: "admin",
  customer: "customer",
  SUPERADMIN: "superadmin",
};

export const dbs = {
  MONGODB: "mongodb",
  MYSQL: "mysql",
  POSTGRESQL: "postgresql",
  MSSQL: "mssql",
};

export const orderStatuses = {
  PLACED: "placed",
  SHIPPED: "shipped",
  DELIVERED: "delivered",
  CANCELLED: "cancelled",
};
