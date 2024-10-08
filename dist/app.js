"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.app = void 0;
var _express = _interopRequireDefault(require("express"));
var _cookieParser = _interopRequireDefault(require("cookie-parser"));
var _cors = _interopRequireDefault(require("cors"));
var _bodyParser = _interopRequireDefault(require("body-parser"));
var _userRoute = _interopRequireDefault(require("./routes/user.route.js"));
var _bulletRoute = _interopRequireDefault(require("./routes/bullet.route.js"));
var _suggestionRoute = _interopRequireDefault(require("./routes/suggestion.route.js"));
var _noteRoute = _interopRequireDefault(require("./routes/note.route.js"));
var _futureLogRoute = _interopRequireDefault(require("./routes/futureLog.route.js"));
var _habitRoute = _interopRequireDefault(require("./routes/habit.route.js"));
var _adminRoute = _interopRequireDefault(require("./routes/admin.route.js"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
const app = exports.app = (0, _express.default)();

//Middlewares

// app.use(cors({ origin: process.env.CORS_ORIGIN, credentials: true }));
const corsOptions = {
  origin: "http://localhost:3000",
  // Replace with your frontend's origin
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  credentials: true // Allow credentials (cookies, authorization headers, etc.)
};
app.use((0, _cors.default)(corsOptions));
app.use((0, _cookieParser.default)());
// Middleware to log cookies
// app.use((req, res, next) => {
//     console.log("Cookies: ", req.cookies);
//     next();
//   });
app.use(_express.default.json({
  limit: "16kb"
}));
app.use(_bodyParser.default.json());
app.use(_express.default.urlencoded({
  extended: true,
  limit: "16kb"
}));
app.use(_express.default.static("public"));

//routes imports

//routes declaration
app.use("/api/v1/users", _userRoute.default);
app.use("/api/v1/bullet", _bulletRoute.default);
app.use("/api/v1/suggest", _suggestionRoute.default);
app.use("/api/v1/note", _noteRoute.default);
app.use("/api/v1/future", _futureLogRoute.default);
app.use("/api/v1/habit", _habitRoute.default);
app.use("/api/v1/admin", _adminRoute.default);