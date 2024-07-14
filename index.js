/**
 * Initializes the application by connecting to the database and starting the server.
 * 
 * This function attempts to establish a connection to the MongoDB database using the
 * connectDB function. Upon successful connection, it starts the Express application
 * server on the specified port. If the database connection fails, it logs an error message.
 * 
 * @async
 * @function
 * @returns {Promise<void>} A promise that resolves when the server starts listening,
 *                          or rejects if the database connection fails.
 * @throws {Error} If the database connection fails.
 */

import { connectDB } from "./src/db/index.js";
import { app } from "./src/app.js";
import "dotenv/config";

const PORT = process.env.PORT || 8080;

connectDB()
  .then(
    app.listen(PORT, () => {
      console.log(`App is listening to port ${PORT}`);
    })
  )
  .catch((err) => {
    console.log("MONGODB connection failed !!", err);
  });