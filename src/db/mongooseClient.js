const mongoose = require("mongoose");

async function connectMongoose() {
  const host = process.env.DB_HOST || "localhost";
  const port = process.env.DB_PORT || 27017;
  const name = process.env.DB_NAME || "shopdb";
  const user = process.env.DB_USER;
  const pass = process.env.DB_PASSWORD;
  const auth = user ? `${user}:${encodeURIComponent(pass)}@` : "";
  const uri = `mongodb://${auth}${host}:${port}/${name}`;
  await mongoose.connect(uri, { autoIndex: true });
  return mongoose;
}

module.exports = connectMongoose;
