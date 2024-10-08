"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.updateLog = exports.getLogsByPeriod = exports.getLog = exports.getAllLogs = exports.deleteLog = exports.addFutureLog = void 0;
var _AsyncHandler = require("../utils/AsyncHandler.js");
var _futureLogModel = require("../models/futureLog.model.js");
var _ApiError = require("../utils/ApiError.js");
var _ApiResponse = require("../utils/ApiResponse.js");
var _futureLogRoute = _interopRequireDefault(require("../routes/futureLog.route.js"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
const addFutureLog = exports.addFutureLog = (0, _AsyncHandler.asyncHandler)(async (req, res) => {
  var _req$user;
  const userId = (_req$user = req.user) === null || _req$user === void 0 ? void 0 : _req$user.id;
  const {
    aims,
    period
  } = req.body;
  let range = period;
  if (!userId) {
    throw new _ApiError.ApiError(404, "Please login first");
  }
  if (!aims) {
    throw new _ApiError.ApiError(404, "Text value is required");
  }
  if (!range) {
    range = "THIS YEAR";
  }
  const checkExistingAim = await _futureLogModel.FutureLog.findOne({
    aims: aims,
    user: userId,
    period: range
  });
  if (checkExistingAim) {
    throw new _ApiError.ApiError(404, "Aim for this period is already added");
  }
  //current year
  const startYear = new Date().getFullYear();
  let endYear = null;
  switch (range) {
    case "THIS YEAR":
      endYear = startYear;
      break;
    case "NEXT 3 YEARS":
      endYear = startYear + 2;
      break;
    case "NEXT 5 YEARS":
      endYear = startYear + 4;
      break;
    case "NEXT 10 YEARS":
      endYear = startYear + 9;
      break;
    default:
      endYear = startYear;
      break;
  }
  const addNewAim = await _futureLogModel.FutureLog.create({
    aims,
    period: range,
    startYear,
    endYear,
    user: userId
  });
  if (!addNewAim) {
    throw new _ApiError.ApiError(400, "Something went wrong");
  }
  res.status(200).json(new _ApiResponse.ApiResponse(200, addNewAim, "success"));
});
const getLog = exports.getLog = (0, _AsyncHandler.asyncHandler)(async (req, res) => {
  var _req$user2;
  const userId = (_req$user2 = req.user) === null || _req$user2 === void 0 ? void 0 : _req$user2.id;
  const {
    id
  } = req.params;
  if (!userId) {
    throw new _ApiError.ApiError(404, "Please login first");
  }
  //   const aim = await FutureLog.findById({
  //     _id: aimId,
  //     user: userId,
  //   });
  let aim = null;
  try {
    aim = await _futureLogModel.FutureLog.findById({
      _id: id,
      user: userId
    });
    console.log(aim);
  } catch (error) {
    console.error(error);
  }
  if (!aim) {
    throw new _ApiError.ApiError(404, "Reqested aim is not found");
  }
  res.status(200).json(new _ApiResponse.ApiResponse(200, aim, "success"));
});
const deleteLog = exports.deleteLog = (0, _AsyncHandler.asyncHandler)(async (req, res) => {
  var _req$user3;
  const userId = (_req$user3 = req.user) === null || _req$user3 === void 0 ? void 0 : _req$user3.id;
  const {
    id
  } = req.params;
  if (!userId) {
    throw new _ApiError.ApiError(404, "Please login first");
  }
  const aim = await _futureLogModel.FutureLog.findByIdAndDelete({
    _id: id,
    user: userId
  });
  if (!aim) {
    throw new _ApiError.ApiError(404, "Reqested aim is not found");
  }
  res.status(200).json(new _ApiResponse.ApiResponse(200, aim, "success"));
});
const updateLog = exports.updateLog = (0, _AsyncHandler.asyncHandler)(async (req, res) => {
  var _req$user4;
  const userId = (_req$user4 = req.user) === null || _req$user4 === void 0 ? void 0 : _req$user4.id;
  const {
    id
  } = req.params;
  const {
    aims,
    period
  } = req.body;
  if (!userId) {
    throw new _ApiError.ApiError(404, "Please login first");
  }
  const aim = await _futureLogModel.FutureLog.findByIdAndUpdate({
    _id: id,
    user: userId
  });
  if (!aim) {
    throw new _ApiError.ApiError(404, "Reqested aim is not found");
  }
  if (period) {
    aim.period = period;
    switch (period) {
      case "THIS YEAR":
        aim.endYear = parseInt(aim.startYear);
        break;
      case "NEXT 3 YEARS":
        aim.endYear = parseInt(aim.startYear) + 2;
        break;
      case "NEXT 5 YEARS":
        aim.endYear = parseInt(aim.startYear) + 4;
        break;
      case "NEXT 10 YEARS":
        aim.endYear = parseInt(aim.startYear) + 9;
        break;
      default:
        aim.endYear = parseInt(aim.startYear);
        break;
    }
  } else {
    aim.period = aim.period;
  }
  aim.aims = aims;
  await aim.save({
    validateBeforeSave: false
  }, {
    new: true
  });
  res.status(200).json(new _ApiResponse.ApiResponse(200, aim, "success"));
});
const getLogsByPeriod = exports.getLogsByPeriod = (0, _AsyncHandler.asyncHandler)(async (req, res) => {
  var _req$user5;
  const userId = (_req$user5 = req.user) === null || _req$user5 === void 0 ? void 0 : _req$user5.id;
  const {
    period
  } = req.body;
  if (!userId) {
    throw new _ApiError.ApiError(404, "Please login first");
  }
  const aims = await _futureLogModel.FutureLog.find({
    period: period ? period : "THIS YEAR",
    user: userId
  });
  res.status(200).json(new _ApiResponse.ApiResponse(200, aims, "success"));
});
const getAllLogs = exports.getAllLogs = (0, _AsyncHandler.asyncHandler)(async (req, res) => {
  var _req$user6;
  const userId = (_req$user6 = req.user) === null || _req$user6 === void 0 ? void 0 : _req$user6.id;
  if (!userId) {
    throw new _ApiError.ApiError(404, "Please login first");
  }
  const aims = await _futureLogModel.FutureLog.find({
    user: userId
  });
  if (!aims) {
    throw new _ApiError.ApiError(404, "No aim is not found");
  }
  res.status(200).json(new _ApiResponse.ApiResponse(200, {
    count: aims.length,
    aims
  }, "success"));
});