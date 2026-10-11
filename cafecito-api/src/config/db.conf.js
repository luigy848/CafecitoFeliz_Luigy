import mongoose from "mongoose";

const connectDB = async () => {
  const dbURI = process.env.MONGODB_URI;

  if (!dbURI) {
    console.error("missing MONGODB_URI in .env");
    process.exit(1);
  }

  try {
    const connection = await mongoose.connect(dbURI, {
      serverSelectionTimeoutMS: 5000,
    });
    console.log(`connected to MongoDB: ${connection.connection.host}`);
  } catch (error) {
    console.error("could not connect to mongoDB:", error.message);
    process.exit(1);
  }
};

export default connectDB;
