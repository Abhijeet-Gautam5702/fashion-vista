import mongoose from "mongoose";
import config from "../config/config.js";

const connectToDatabase = async () => {
  try {
    const response = await mongoose.connect(
      `${config.database.mongoDBConnectionString}/${config.database.databaseName}`
    );
    console.log(
      `APP CONNECTED SUCCESSFULLY TO DATABASE | HOST : ${response.connection.host} | PORT : ${response.connection.port} | DATABASE NAME : ${response.connection.name}`
    );
  } catch (error) {
    console.log(
      `BACKEND ERROR || Connection to database failed || Error = ${error.message}`
    );
    throw error;
  }
};

export default connectToDatabase;
