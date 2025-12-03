import dotenv from "dotenv";

dotenv.config();

export const config = {
  port: 3000,
  jwtSecret: "secretkey",
  db: {
    type: "",
    dbuser: "",
    dbpassword: "",
    dbhost: "cluster0.ekiep4r.mongodb.net",
    dbname: "shopdb",
    type: "mongodb",
    dbport: 21017,
  },
  routes: {
    auth: true,
    users: true,
    products: true,
    categories: true,
    orders: true,
    reviews: true,
    ecommercedashboard: true,
  },
};

export const Roles = {
  ADMIN: "admin",
  CUSTOMER: "customer",
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

export const sqlTableNames = {
  USERS: "users",
  PRODUCTS: "products",
  CATEGORIES: "categories",
  ORDERS: "orders",
  ORDER_ITEMS: "order_items",
  REVIEWS: "reviews",
};
