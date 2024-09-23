"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Admin = void 0;
var _mongoose = require("mongoose");
var _jsonwebtoken = _interopRequireDefault(require("jsonwebtoken"));
var _bcrypt = _interopRequireDefault(require("bcrypt"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
const adminSchema = new _mongoose.Schema({
  username: {
    unique: true,
    required: true,
    type: String,
    lowercase: true,
    trim: true,
    index: true
  },
  email: {
    unique: true,
    required: true,
    type: String,
    lowercase: true,
    trim: true
  },
  password: {
    unique: true,
    required: [true, "Password is required"],
    type: String
  },
  refreshToken: {
    type: String
  },
  role: {
    type: String,
    default: "admin"
  }
}, {
  timestamps: true
});
adminSchema.pre("save", async function (next) {
  // need to check here
  if (!this.isModified("password")) return next();
  this.hashedPassword = await _bcrypt.default.hash(this.password, 10);
  this.password = this.hashedPassword;
  next();
});
adminSchema.methods.isPasswordCorrect = async function (password) {
  return await _bcrypt.default.compare(password, this.password);
};
adminSchema.methods.generateAccessToken = async function () {
  return await _jsonwebtoken.default.sign({
    _id: this._id,
    email: this.email,
    username: this.username
  }, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: process.env.ACCESS_TOKEN_EXPIRY
  });
};
adminSchema.methods.generateRefreshToken = async function () {
  return await _jsonwebtoken.default.sign({
    _id: this._id
  }, process.env.REFRESH_TOKEN_SECRET, {
    expiresIn: process.env.REFRESH_TOKEN_EXPIRY
  });
};
const Admin = exports.Admin = (0, _mongoose.model)("Admin", adminSchema);