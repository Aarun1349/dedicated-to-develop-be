"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.verifyJWT = exports.verifyAdminJWT = void 0;
var _ApiError = require("../utils/ApiError.js");
var _AsyncHandler = require("../utils/AsyncHandler.js");
var _jsonwebtoken = _interopRequireDefault(require("jsonwebtoken"));
var _userModel = require("../models/user.model.js");
var _adminModel = require("../models/admin.model.js");
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
const verifyJWT = exports.verifyJWT = (0, _AsyncHandler.asyncHandler)(async (req, _, next) => {
  // can be found this code in production scenario
  console.log("the cookies____", req.cookies);
  try {
    var _req$cookies, _req$header;
    const token = ((_req$cookies = req.cookies) === null || _req$cookies === void 0 ? void 0 : _req$cookies.accessToken) || ((_req$header = req.header("Authorization")) === null || _req$header === void 0 ? void 0 : _req$header.replace("Bearer ", ""));
    console.log("token____", token);
    if (!token || token === undefined) {
      throw new _ApiError.ApiError(401, "Unauthorized User");
    }
    const decoded = _jsonwebtoken.default.verify(token, process.env.ACCESS_TOKEN_SECRET);
    const user = await _userModel.User.findById(decoded === null || decoded === void 0 ? void 0 : decoded._id).select("-password -refreshToken");
    console.log("the user token____", decoded, user);
    if (!user) {
      //NEXT_VIDEO: discuss abput frontend
      throw new _ApiError.ApiError(401, "Invalid Access Token");
    }
    req.user = user;
    next();
  } catch (error) {
    throw new _ApiError.ApiError(500, "Something went wrong");
  }
});
const verifyAdminJWT = exports.verifyAdminJWT = (0, _AsyncHandler.asyncHandler)(async (req, _, next) => {
  // can be found this code in production scenario

  try {
    var _req$cookies2, _req$header2;
    const token = ((_req$cookies2 = req.cookies) === null || _req$cookies2 === void 0 ? void 0 : _req$cookies2.accessToken) || ((_req$header2 = req.header("Authorization")) === null || _req$header2 === void 0 ? void 0 : _req$header2.replace("Bearer ", ""));
    if (!token || token === undefined) {
      throw new _ApiError.ApiError(401, "Unauthorized User");
    }
    const decoded = _jsonwebtoken.default.verify(token, process.env.ACCESS_TOKEN_SECRET);
    const user = await _adminModel.Admin.findById(decoded === null || decoded === void 0 ? void 0 : decoded._id).select("-password -refreshToken");
    if (!user) {
      //NEXT_VIDEO: discuss abput frontend
      throw new _ApiError.ApiError(401, "Invalid Access Token");
    }
    req.user = user;
    next();
  } catch (error) {
    throw new _ApiError.ApiError(500, "Something went wrong");
  }
});