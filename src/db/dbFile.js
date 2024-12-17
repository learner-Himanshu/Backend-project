import mongoose, { Mongoose } from "mongoose";
import { DB_NAME } from "../constant.js";

const connectDB = async () => {
  try {
    const connectInstance = await mongoose.connect(
      `${process.env.DATABASE_URL}/${DB_NAME}`
    );
    console.log(
      `MongoDB Connect !! DB HOST: ${connectInstance.connection.host}`
    );
  } catch (error) {
    console.log(`MongoDB Connection Failed : ${error}`);
    process.exit(1);
  }
};

export default connectDB;
