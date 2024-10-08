"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.upload = void 0;
var _multer = _interopRequireDefault(require("multer"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
const storage = _multer.default.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./public/photos");
  },
  filename: function (req, file, cb) {
    // const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, file.originalname);
  }
});
const upload = exports.upload = (0, _multer.default)({
  storage: storage
});