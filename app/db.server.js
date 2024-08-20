
import mongoose from "mongoose";
const dbConnection = async () => {
  try {
    let connection = await mongoose.connect("mongodb://localhost:27017/love-and-money");
    console.log("Database is connected");
    return connection
  } catch (error) {
    console.log("Error in Database");
    return error;
  }
}

export default dbConnection(); 


