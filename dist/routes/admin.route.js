"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _express = require("express");
var _authMiddleware = require("../middleware/auth.middleware.js");
var _adminController = require("../controllers/admin.controller.js");
const adminRouter = (0, _express.Router)();
adminRouter.use(_authMiddleware.verifyAdminJWT);
adminRouter.route("/admin").get(_adminController.login);
adminRouter.route("/create").post(_adminController.createAdmin);
adminRouter.route("/logout").put(_adminController.logoutAdmin);
var _default = exports.default = adminRouter;