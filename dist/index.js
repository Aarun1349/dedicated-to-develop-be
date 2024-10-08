"use strict";

var _dotenv = _interopRequireDefault(require("dotenv"));
var _index = _interopRequireDefault(require("./db/index.js"));
var _app = require("./app.js");
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
_dotenv.default.config({
  path: "/.env"
});
(0, _index.default)().then(() => {
  _app.app.listen(process.env.PORT || 8000, () => {
    console.log(`Server is running at port:${process.env.PORT}`);
  });
}).catch(err => {
  console.log("Connection Error", err);
});