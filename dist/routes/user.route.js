"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _express = require("express");
var _userController = require("../controllers/user.controller.js");
var _multerMiddleware = require("../middleware/multer.middleware.js");
var _authMiddleware = require("../middleware/auth.middleware.js");
const userRouter = (0, _express.Router)();
userRouter.route("/login").post(_userController.userSignIn);
userRouter.route("/logout").post(_authMiddleware.verifyJWT, _userController.logoutUser);
userRouter.route("/signup").post(_multerMiddleware.upload.fields([{
  name: "avatar",
  maxCount: 1
}, {
  name: "coverImage",
  maxCount: 1
}]), _userController.userSignUp);
var _default = exports.default = userRouter;