
// import "dotenv/config"; // Importing and configuring dotenv package directly
// Configuring dotenv
// import dotenv from 'dotenv';
// dotenv.config({path:"./.env"});

import config from "./config/config.js";
import connectToDatabase from "./database/database.js";
import app from "./app.js";
import { v2 as cloudinary } from "cloudinary";
import { cleanDirectory } from "./utilities/index.js";


// Configuring Cloudinary
cloudinary.config({
  api_key: config.cloudinary.apiKey,
  api_secret: config.cloudinary.apiSecret,
  cloud_name: config.cloudinary.cloudName,
});

const port = config.app.port;

// Clean the temp directory whenenver the server starts
cleanDirectory("public/temp/");

await connectToDatabase();
try {
  app.listen(port, () => {
    console.log(`App running successfully on PORT ${port}`);
  });
} catch (error) {
  console.log(`BACKEND ERROR || Express App error || Error = ${error.message}`);
  throw error;
}
