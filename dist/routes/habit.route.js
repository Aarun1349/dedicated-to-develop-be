"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _express = require("express");
var _authMiddleware = require("../middleware/auth.middleware.js");
var _habitsController = require("../controllers/habits.controller.js");
const habitRouter = (0, _express.Router)();
habitRouter.use(_authMiddleware.verifyJWT);
habitRouter.route("/create-habit").post(_habitsController.addNewHabit);
habitRouter.route("/pause-habit/:habitId").put(_habitsController.togglePause);
habitRouter.route("/update/:habitId").put(_habitsController.updateHabit);
habitRouter.route("/all-habits").get(_habitsController.getAllHabits);
habitRouter.route("/:habitId").delete(_habitsController.deleteHabit).get(_habitsController.getHabit).put(_habitsController.toggleComplete);
var _default = exports.default = habitRouter;