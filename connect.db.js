import mongoose from "mongoose";

const userName = "arun";
const password = encodeURIComponent("Payal123");

const databaseName = "ecommerce";

const dbURL = `mongodb+srv://${userName}:${password}@cluster0.qdunzwe.mongodb.net/${databaseName}?retryWrites=true&w=majority&appName=Cluster0`;

const connectDB = async () => {
  try {
    await mongoose.connect(dbURL);
    console.log("DB connection established...");
  } catch (error) {
    console.log(error.message);
    console.log("DB connection failed...");
  }
};

export default connectDB;
