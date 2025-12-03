import mongoose from "mongoose";

export default async function connectMongoose() {
  const uri = process.env.MONGO_URI ?? "mongodb://127.0.0.1:27017/shopdb";

  try {
    await mongoose.connect(uri, {
      autoIndex: true,
    });
    console.log("MongoDB connected successfully");
  } catch (err) {
    console.error("MongoDB connection error:", err.message);
    throw err;
  }

  return mongoose;
}
