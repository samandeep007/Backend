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
