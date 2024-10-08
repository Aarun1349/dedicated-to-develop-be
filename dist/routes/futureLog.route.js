"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _express = require("express");
var _authMiddleware = require("../middleware/auth.middleware.js");
var _futureLogController = require("../controllers/futureLog.controller.js");
var _userController = require("../controllers/user.controller.js");
const futureRouter = (0, _express.Router)();
futureRouter.use(_authMiddleware.verifyJWT);

//routes
futureRouter.route("/add").post(_futureLogController.addFutureLog);
futureRouter.route("/future-log").get(_futureLogController.getAllLogs);
futureRouter.route("/period").get(_futureLogController.getLogsByPeriod);
futureRouter.route("/:id").put(_futureLogController.updateLog).delete(_futureLogController.deleteLog).get(_futureLogController.getLog);
var _default = exports.default = futureRouter;