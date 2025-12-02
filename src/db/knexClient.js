import knex from "knex";
import { config as cfg } from "../config/index.js";

export default function createKnex() {
  const type = cfg.db.type;
  const clientMap = {
    mysql: "mysql2",
    postgresql: "pg",
    mssql: "mssql",
  };
  const client = clientMap[type];
  if (!client) throw new Error("Unsupported SQL DB type for knex: " + type);

  return knex({
    client,
    connection: {
      host: process.env.DB_HOST,
      port: process.env.DB_PORT,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
    },
    pool: { min: 0, max: 7 },
  });
}
