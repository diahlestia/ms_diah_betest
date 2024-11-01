// db.config.js
import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const MONGO_DB = process.env.MONGO_DB;
const MONGO_URL = process.env.MONGO_URL;

export const connectDB = async () => {
  try {
    await mongoose.connect(`${MONGO_URL}/${MONGO_DB}`, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("DB Connected Successfully....");
  } catch (err) {
    console.error("DB Connection Failed!");
    console.error(err);
    process.exit(1);
  }
};

export default connectDB;
