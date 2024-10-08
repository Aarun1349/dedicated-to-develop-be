"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _mongoose = _interopRequireDefault(require("mongoose"));
var _constants = require("../constants.js");
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
const connectToDB = async () => {
  try {
    const connetionInstance = await _mongoose.default.connect(`${process.env.DB_STRING}${_constants.NEW_DB_NAME}`);
    console.log(`\n MONGODB Connected !! DB HOST:=>`, connetionInstance.connection.host);
  } catch (error) {
    console.log(`MONGODB Connection Error:${error.message}`);
  }
};
var _default = exports.default = connectToDB;