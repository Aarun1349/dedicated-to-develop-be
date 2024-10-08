"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.updateBullet = exports.markDone = exports.getTodaysBulletOfUser = exports.getBullet = exports.deleteBullet = exports.changeState = exports.changeDate = exports.addNewBullet = void 0;
var _AsyncHandler = require("../utils/AsyncHandler.js");
var _bulletsModel = require("../models/bullets.model.js");
var _ApiError = require("../utils/ApiError.js");
var _ApiResponse = require("../utils/ApiResponse.js");
const addNewBullet = exports.addNewBullet = (0, _AsyncHandler.asyncHandler)(async (req, res) => {
  var _req$user;
  const userId = (_req$user = req.user) === null || _req$user === void 0 ? void 0 : _req$user.id;
  const {
    bullet
  } = req.body;
  if (!userId) {
    throw new _ApiError.ApiError(404, "Please login first");
  }
  if (!bullet) {
    throw new _ApiError.ApiError(404, "Bullet name is requiredl");
  }
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  const existingBullet = await _bulletsModel.Bullet.findOne({
    dateField: {
      $gte: today,
      $lt: tomorrow
    }
  });
  if (existingBullet) {
    throw new _ApiError.ApiError(400, "Tasks already added for today", existingBullet);
  }
  const newBullet = await _bulletsModel.Bullet.create({
    user: userId,
    bullet
  });
  if (!newBullet) {
    throw new _ApiError.ApiError(400, "Someting went wrong");
  }
  res.status(200).json(new _ApiResponse.ApiResponse(200, newBullet, "success"));
});
const getTodaysBulletOfUser = exports.getTodaysBulletOfUser = (0, _AsyncHandler.asyncHandler)(async (req, res) => {
  var _req$user2;
  const userId = (_req$user2 = req.user) === null || _req$user2 === void 0 ? void 0 : _req$user2.id;
  if (!userId) {
    throw new _ApiError.ApiError(404, "Please login first");
  }
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const todaysBullet = await _bulletsModel.Bullet.find({
    user: userId,
    dateField: {
      $gte: today,
      $lt: new Date(today.getTime() + 86400000)
    }
  });
  console.log(todaysBullet.length);
  if (todaysBullet.length <= 0) {
    throw new _ApiError.ApiError(404, "No tasks found for today, Enjoy your 🍵");
  }
  res.status(200).json(new _ApiResponse.ApiResponse(200, todaysBullet, "success"));
});
const changeState = exports.changeState = (0, _AsyncHandler.asyncHandler)(async (req, res) => {
  var _req$user3;
  const userId = (_req$user3 = req.user) === null || _req$user3 === void 0 ? void 0 : _req$user3.id;
  const {
    state
  } = req.body;
  const {
    bulletId
  } = req.params;
  if (!userId) {
    throw new _ApiError.ApiError(404, "Please login first");
  }
  const updateBullet = await _bulletsModel.Bullet.findByIdAndUpdate({
    _id: bulletId,
    user: userId
  });
  if (!updateBullet) {
    throw new _ApiError.ApiError(404, "Requested bullet is not found");
  }
  updateBullet.state = state;
  await updateBullet.save({
    validateBeforeSave: false
  }, {
    new: true
  });
  res.status(200).json(new _ApiResponse.ApiResponse(200, updateBullet, "success"));
});
const markDone = exports.markDone = (0, _AsyncHandler.asyncHandler)(async (req, res) => {
  var _req$user4;
  const userId = (_req$user4 = req.user) === null || _req$user4 === void 0 ? void 0 : _req$user4.id;
  const {
    bulletId
  } = req.params;
  if (!userId) {
    throw new _ApiError.ApiError(404, "Please login first");
  }
  const markComplete = await _bulletsModel.Bullet.findByIdAndUpdate({
    _id: bulletId,
    user: userId
  });
  if (!markComplete) {
    throw new _ApiError.ApiError(404, "Requested bullet is not found");
  }
  markComplete.state = "Completed";
  await markComplete.save({
    validateBeforeSave: false
  }, {
    new: true
  });
  res.status(200).json(new _ApiResponse.ApiResponse(200, markComplete, "success"));
});
const getBullet = exports.getBullet = (0, _AsyncHandler.asyncHandler)(async (req, res) => {
  var _req$user5;
  const userId = (_req$user5 = req.user) === null || _req$user5 === void 0 ? void 0 : _req$user5.id;
  const {
    bulletId
  } = req.params;
  if (!userId) {
    throw new _ApiError.ApiError(404, "Please login first");
  }
  const bullet = await _bulletsModel.Bullet.findById({
    _id: bulletId,
    user: userId
  });
  if (!bullet) {
    throw new _ApiError.ApiError(404, "Requested bullet is not found");
  }
  res.status(200).json(new _ApiResponse.ApiResponse(200, bullet, "success"));
});
const deleteBullet = exports.deleteBullet = (0, _AsyncHandler.asyncHandler)(async (req, res) => {
  var _req$user6;
  const userId = (_req$user6 = req.user) === null || _req$user6 === void 0 ? void 0 : _req$user6.id;
  const {
    bulletId
  } = req.params;
  if (!userId) {
    throw new _ApiError.ApiError(404, "Please login first");
  }
  const bullet = await _bulletsModel.Bullet.findById({
    _id: bulletId,
    user: userId
  });
  if (!bullet) {
    throw new _ApiError.ApiError(404, "Requested bullet is not found");
  }
  await _bulletsModel.Bullet.findByIdAndDelete({
    _id: bulletId,
    user: userId
  });
  res.status(200).json(new _ApiResponse.ApiResponse(200, "success"));
});
const changeDate = exports.changeDate = (0, _AsyncHandler.asyncHandler)(async (req, res) => {
  var _req$user7;
  const userId = (_req$user7 = req.user) === null || _req$user7 === void 0 ? void 0 : _req$user7.id;
  const {
    dateField
  } = req.body;
  const {
    bulletId
  } = req.params;
  if (!userId) {
    throw new _ApiError.ApiError(404, "Please login first");
  }
  const updateBulletDate = await _bulletsModel.Bullet.findByIdAndUpdate({
    _id: bulletId,
    user: userId
  });
  if (!updateBulletDate) {
    throw new _ApiError.ApiError(404, "Requested bullet is not found");
  }
  updateBulletDate.dateField = dateField;
  updateBulletDate.state = "ReScheduled";
  await updateBulletDate.save({
    validateBeforeSave: false,
    new: true
  });
  res.status(200).json(new _ApiResponse.ApiResponse(200, updateBulletDate, "success"));
});
const updateBullet = exports.updateBullet = (0, _AsyncHandler.asyncHandler)(async (req, res) => {
  var _req$user8;
  const userId = (_req$user8 = req.user) === null || _req$user8 === void 0 ? void 0 : _req$user8.id;
  const {
    bullet,
    priority,
    alligned_to
  } = req.body;
  const {
    bulletId
  } = req.params;
  if (!userId) {
    throw new _ApiError.ApiError(404, "Please login first");
  }
  const updateBullet = await _bulletsModel.Bullet.findByIdAndUpdate({
    _id: bulletId,
    user: userId,
    bullet,
    priority,
    alligned_to
  });
  if (!updateBullet) {
    throw new _ApiError.ApiError(404, "Requested bullet is not found");
  }
  updateBullet.bullet = bullet;
  priority ? updateBullet.priority = priority : updateBullet.priority;
  alligned_to ? alligned_to.alligned_to = alligned_to : updateBullet.alligned_to;
  updateBullet.bullet = bullet;
  await updateBullet.save({
    validateBeforeSave: false
  }, {
    new: true
  });
  res.status(200).json(new _ApiResponse.ApiResponse(200, updateBullet, "success"));
});