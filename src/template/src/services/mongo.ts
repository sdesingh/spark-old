import mongoose from "mongoose";
import { logger } from "./logging";

export async function connectDb() {
  try {
    await mongoose.connect(process.env.MONGO_URL!, {
      useUnifiedTopology: true,
      useNewUrlParser: true
    });

    logger.info("Successfully connected to MongoDB.");
  } catch (err) {
    logger.error("Unable to connect to MongoDB.", err);
  }
}
