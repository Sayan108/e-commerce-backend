import mongoose from "mongoose";

class MongooseClient {
  static async connect() {
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
}

export default MongooseClient;
