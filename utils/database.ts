import mongoose from "mongoose";
let isConnected = false; // track the connection

export const connectToDB = async () => {
  mongoose.set("strictQuery", true);

  if (isConnected) {
    console.log("MongoDB is already connected");
    return;
  }

  try {
    await mongoose.connect(process.env.MONGODB_URI as string);
    // Removed the dbName option since it's already in the connection string

    isConnected = true;
    console.log("MongoDB connected");
  } catch (error: any) {
    console.error(error);
  }
};
