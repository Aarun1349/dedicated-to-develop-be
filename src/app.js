import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import bodyParser from "body-parser";
const app = express();

//Middlewares

// app.use(cors({ origin: process.env.CORS_ORIGIN, credentials: true }));
const corsOptions = {
  origin: "http://localhost:3000", // Replace with your frontend's origin
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  credentials: true, // Allow credentials (cookies, authorization headers, etc.)
};

app.use(cors(corsOptions));
app.use(cookieParser());
// Middleware to log cookies
// app.use((req, res, next) => {
//     console.log("Cookies: ", req.cookies);
//     next();
//   });
app.use(express.json({ limit: "16kb" }));
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));

//routes imports
import userRouter from "./routes/user.route.js";
import bulletRouter from "./routes/bullet.route.js";
import suggestionRouter from "./routes/suggestion.route.js";
import noteRouter from "./routes/note.route.js";
import futureRouter from "./routes/futureLog.route.js";
import habitRouter from "./routes/habit.route.js";
import adminRouter from "./routes/admin.route.js";

//routes declaration
app.use("/api/v1/users", userRouter);
app.use("/api/v1/bullet", bulletRouter);
app.use("/api/v1/suggest", suggestionRouter);
app.use("/api/v1/note", noteRouter);
app.use("/api/v1/future", futureRouter);
app.use("/api/v1/habit", habitRouter);
app.use("/api/v1/admin", adminRouter);

export { app };
