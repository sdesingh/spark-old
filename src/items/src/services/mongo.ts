import mongoose from "mongoose";

export async function connectDb() {
  try {
    await mongoose.connect(process.env.MONGO_URL!, {
      useUnifiedTopology: true,
      useNewUrlParser: true
    });

    console.log("[x] Successfully connected to mongo");
  } catch (err) {
    console.log("Unable to connect to mongodb instance.");
  }
}
