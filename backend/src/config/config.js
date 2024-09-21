// Configuring dotenv
import dotenv from "dotenv";
dotenv.config({ path: "./.env" });

import { DB_NAME } from "../constants.js";

// Config File stores all the configuration related variables of the backend
const config = {
  token: {
    accessToken: {
      privateKey: process.env.ACCESS_TOKEN_PRIVATE_KEY,
      expiry: process.env.ACCESS_TOKEN_EXPIRY,
    },
    refreshToken: {
      privateKey: process.env.REFRESH_TOKEN_PRIVATE_KEY,
      expiry: process.env.REFRESH_TOKEN_EXPIRY,
    },
  },
  database: {
    mongoDBConnectionString: process.env.MONGO_DB_CONNECTION_STRING,
    databaseName: DB_NAME,
  },
  app: {
    port: process.env.PORT || 8000,
    // corsOrigin: process.env.CORS_ORIGIN || "*",
    corsOrigin: process.env.CORS_ORIGIN, // testing
  },
  cloudinary: {
    apiKey: process.env.CLOUDINARY_API_KEY,
    apiSecret: process.env.CLOUDINARY_API_SECRET,
    cloudName: process.env.CLOUDINARY_CLOUD_NAME,
  },
};

export default config;
