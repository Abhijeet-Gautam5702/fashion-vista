import "dotenv/config"; // Importing and configuring dotenv package directly
import config from "./config/config.js";
import connectToDatabase from "./database/database.js";
import app from "./app.js";

const port = config.app.port;

await connectToDatabase();
try {
  app.listen(port, () => {
    console.log(`App running successfully on PORT ${port}`);
  });
} catch (error) {
  console.log(`BACKEND ERROR || Express App error || Error = ${error.message}`);
  throw error;
}
