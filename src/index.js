import dotenv from "dotenv";
import connectToDB from "./db";
import { app } from "./app.js";
dotenv.config({
  path: "/.env",
});
connectToDB().then(() => {
  app
    .listen(process.env.PORT || 8000, () => {
      console.log(`Server is running on port: ${process.env.PORT}`);
    })
    .catch((err) => {
      console.log("Connection Error", err);
    });
});
