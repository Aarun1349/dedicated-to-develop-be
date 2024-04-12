import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import bodyParser from "body-parser";
const app = express();

//Middlewares

app.use(cors({ origin: process.env.CORS_ORIGIN }));
app.use(cookieParser());
app.use(express.json({ limit: "16kb" }));
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"))   ;

//routes imports
import userRouter from "./routes/user.route.js";
import bulletRouter from "./routes/bullet.route.js";
import suggestionRouter from "./routes/suggestion.route.js";

//routes declaration
app.use("/api/v1/users", userRouter);
app.use("/api/v1/bullet", bulletRouter);
app.use("/api/v1/suggest", suggestionRouter);

export { app };
