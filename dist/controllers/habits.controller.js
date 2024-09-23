"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.updateHabit = exports.trackHabits = exports.togglePause = exports.toggleComplete = exports.getHabit = exports.getAllHabits = exports.deleteHabit = exports.addNewHabit = void 0;
var _AsyncHandler = require("../utils/AsyncHandler.js");
var _habitsModel = require("../models/habits.model.js");
var _habitEntryModel = require("../models/habitEntry.model.js");
var _ApiError = require("../utils/ApiError.js");
var _ApiResponse = require("../utils/ApiResponse.js");
const addNewHabit = exports.addNewHabit = (0, _AsyncHandler.asyncHandler)(async (req, res) => {
  var _req$user;
  const userId = (_req$user = req.user) === null || _req$user === void 0 ? void 0 : _req$user.id;
  const {
    habit,
    why
  } = req.body;
  if (!userId) {
    throw new _ApiError.ApiError(404, "Please login first");
  }
  if (!habit || !why) {
    throw new _ApiError.ApiError(400, "Habit and why is required");
  }
  const existingHabit = await _habitsModel.Habit.findOne({
    habit: habit,
    user: userId
  });
  if (existingHabit) {
    throw new _ApiError.ApiError(400, "Habit is already present");
  }
  const newHabit = await _habitsModel.Habit.create({
    habit: habit,
    user: userId,
    why
  });
  res.status(200).json(new _ApiResponse.ApiResponse(200, newHabit, "success"));
});
const togglePause = exports.togglePause = (0, _AsyncHandler.asyncHandler)(async (req, res) => {
  var _req$user2;
  const userId = (_req$user2 = req.user) === null || _req$user2 === void 0 ? void 0 : _req$user2.id;
  const {
    habitId
  } = req.params;
  if (!userId) {
    throw new _ApiError.ApiError(404, "Please login first");
  }
  const checkHabit = await _habitsModel.Habit.findById({
    habit: habitId,
    user: userId
  });
  console.log(checkHabit);
  if (!checkHabit) {
    throw new _ApiError.ApiError(400, "habit not found");
  }
  const togglePause = await _habitsModel.Habit.findOneAndUpdate({
    habit: habitId,
    user: userId
  });
  togglePause.state = !togglePause.state;
  await togglePause.save({
    validateBeforeSave: false,
    new: true
  });
  res.status(200).json(new _ApiResponse.ApiResponse(200, togglePause, "success"));
});
const getAllHabits = exports.getAllHabits = (0, _AsyncHandler.asyncHandler)(async (req, res) => {
  var _req$user3;
  const userId = (_req$user3 = req.user) === null || _req$user3 === void 0 ? void 0 : _req$user3.id;
  if (!userId) {
    throw new _ApiError.ApiError(404, "Please login first");
  }
  const allhabits = await _habitsModel.Habit.find({
    user: userId
  });
  if (allhabits.length <= 0) {
    throw new _ApiError.ApiError(404, "No habit found");
  }
  res.status(200).json(new _ApiResponse.ApiResponse(200, {
    count: allhabits.length,
    allhabits
  }, "success"));
});
const getHabit = exports.getHabit = (0, _AsyncHandler.asyncHandler)(async (req, res) => {
  var _req$user4;
  const userId = (_req$user4 = req.user) === null || _req$user4 === void 0 ? void 0 : _req$user4.id;
  const {
    habitId
  } = req.params;
  if (!userId) {
    throw new _ApiError.ApiError(404, "Please login first");
  }
  const habit = await _habitsModel.Habit.findById({
    _id: habitId,
    user: userId
  });
  if (!habit) {
    throw new _ApiError.ApiError(404, "No habit found");
  }
  res.status(200).json(new _ApiResponse.ApiResponse(200, habit, "success"));
});
const trackHabits = exports.trackHabits = (0, _AsyncHandler.asyncHandler)(async (req, res) => {
  var _req$user5;
  const userId = (_req$user5 = req.user) === null || _req$user5 === void 0 ? void 0 : _req$user5.id;
  if (!userId) {
    throw new _ApiError.ApiError(404, "Please login first");
  }
});
const deleteHabit = exports.deleteHabit = (0, _AsyncHandler.asyncHandler)(async (req, res) => {
  var _req$user6;
  const userId = (_req$user6 = req.user) === null || _req$user6 === void 0 ? void 0 : _req$user6.id;
  const {
    habitId
  } = req.params;
  if (!userId) {
    throw new _ApiError.ApiError(404, "Please login first");
  }
  const habit = await _habitsModel.Habit.findByIdAndDelete({
    _id: habitId,
    user: userId
  });
  if (!habit) {
    throw new _ApiError.ApiError(404, "No habit found");
  }
  res.status(200).json(new _ApiResponse.ApiResponse(200, habit, "success"));
});
const updateHabit = exports.updateHabit = (0, _AsyncHandler.asyncHandler)(async (req, res) => {
  var _req$user7;
  const userId = (_req$user7 = req.user) === null || _req$user7 === void 0 ? void 0 : _req$user7.id;
  const {
    habitId
  } = req.params;
  const {
    habit,
    why
  } = req.body;
  if (!userId) {
    throw new _ApiError.ApiError(404, "Please login first");
  }
  if (!habit || !why) {
    throw new _ApiError.ApiError(400, "Habit and why is required");
  }
  const updateHabit = await _habitsModel.Habit.findByIdAndUpdate({
    _id: habitId,
    user: userId
  });
  if (!updateHabit) {
    throw new _ApiError.ApiError(404, "No habit found");
  }
  updateHabit.habit = habit;
  updateHabit.why = why;
  await updateHabit.save({
    validateBefore: false,
    new: true
  });
  res.status(200).json(new _ApiResponse.ApiResponse(200, updateHabit, "success"));
});
const toggleComplete = exports.toggleComplete = (0, _AsyncHandler.asyncHandler)(async (req, res) => {
  var _req$user8;
  const userId = (_req$user8 = req.user) === null || _req$user8 === void 0 ? void 0 : _req$user8.id;
  const {
    calendarDate
  } = req.body;
  const {
    habitId
  } = req.params;
  if (!userId) {
    throw new _ApiError.ApiError(404, "Please login first");
  }
  const checkHabit = await _habitEntryModel.HabitEntry.findOne({
    habit: habitId,
    date: calendarDate,
    user: userId,
    completed: true
  });
  if (checkHabit) {
    throw new _ApiError.ApiError(400, "habit is already marked for completion");
  }
  const toggleComplete = await _habitEntryModel.HabitEntry.create({
    habit: habitId,
    date: calendarDate,
    user: userId,
    completed: true
  });
  const incrementFrequency = await _habitsModel.Habit.findByIdAndUpdate({
    user: userId,
    _id: habitId
  });
  incrementFrequency.frequency = incrementFrequency.frequency + 1;
  await incrementFrequency.save({
    validateBeforeSave: false,
    new: true
  });
  console.log("__________", toggleComplete, incrementFrequency);

  //   await toggleComplete.save({ validateBeforeSave: false, new: true });
  res.status(200).json(new _ApiResponse.ApiResponse(200, toggleComplete, "success"));
});