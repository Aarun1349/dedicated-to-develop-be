import express from "express";
import ServerlessHttp from "serverless-http";
import cookieParser from "cookie-parser";
import cors from "cors";
import bodyParser from "body-parser";
import userRouter from "../../src/routes/user.route";
import bulletRouter from "../../src/routes/bullet.route";
import suggestionRouter from "../../src/routes/suggestion.route";
import noteRouter from "../../src/routes/note.route";
import futureRouter from "../../src/routes/futureLog.route";
import habitRouter from "../../src/routes/habit.route";
import adminRouter from "../../src/routes/admin.route";
const app = express();

const handler = ServerlessHttp(app);

// Middlewares
const corsOptions = {
  origin: "http://localhost:3000", // Replace with your frontend's origin
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  credentials: true, // Allow credentials (cookies, authorization headers, etc.)
};

app.use(cors(corsOptions));
app.use(cookieParser());
app.use(express.json({ limit: "16kb" }));
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));
app.get("/.netlify/functions/api", (req, res) => {
  res.json({ message: "Hello World!" });
});

// Routes declaration
app.use("/.netlify/functions/api/v1/users", userRouter);
app.use("/.netlify/functions/api/v1/bullet", bulletRouter);
app.use("/.netlify/functions/api/v1/suggest", suggestionRouter);
app.use("/.netlify/functions/api/v1/note", noteRouter);
app.use("/.netlify/functions/api/v1/future", futureRouter);
app.use("/.netlify/functions/api/v1/habit", habitRouter);
app.use("/.netlify/functions/api/v1/admin", adminRouter);

module.exports.handler = async (event, context) => {
  const result = await handler(event, context);
  return result;
};
