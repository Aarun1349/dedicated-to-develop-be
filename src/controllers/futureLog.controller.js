import { asyncHandler } from "../utils/AsyncHandler.js";
import { FutureLog } from "../models/futureLog.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import futureRouter from "../routes/futureLog.route.js";

const addFutureLog = asyncHandler(async (req, res) => {
  const userId = req.user?.id;
  const { aims, period } = req.body;
  let range = period;
  if (!userId) {
    throw new ApiError(404, "Please login first");
  }
  if (!aims) {
    throw new ApiError(404, "Text value is required");
  }
  if (!range) {
    range = "THIS YEAR";
  }
  const checkExistingAim = await FutureLog.findOne({
    aims: aims,
    user: userId,
    period: range,
  });
  if (checkExistingAim) {
    throw new ApiError(404, "Aim for this period is already added");
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
  const addNewAim = await FutureLog.create({
    aims,
    period: range,
    startYear,
    endYear,
    user: userId,
  });
  if (!addNewAim) {
    throw new ApiError(400, "Something went wrong");
  }

  res.status(200).json(new ApiResponse(200, addNewAim, "success"));
});

const getLog = asyncHandler(async (req, res) => {
  const userId = req.user?.id;
  const { id } = req.params;
  console.log("aimid_______", id, userId);
  if (!userId) {
    throw new ApiError(404, "Please login first");
  }
  //   const aim = await FutureLog.findById({
  //     _id: aimId,
  //     user: userId,
  //   });
  let aim = null;

  try {
    aim = await FutureLog.findById({
      _id: id,
      user: userId,
    });
    console.log(aim);
  } catch (error) {
    console.error(error);
  }
  if (!aim) {
    throw new ApiError(404, "Reqested aim is not found");
  }
  res.status(200).json(new ApiResponse(200, aim, "success"));
});

const deleteLog = asyncHandler(async (req, res) => {
  const userId = req.user?.id;
  const {id} = req.params;
  if (!userId) {
    throw new ApiError(404, "Please login first");
  }
  const aim = await FutureLog.findByIdAndDelete({
    _id: id,
    user: userId,
  });
  if (!aim) {
    throw new ApiError(404, "Reqested aim is not found");
  }
  res.status(200).json(new ApiResponse(200, aim, "success"));
});

const updateLog = asyncHandler(async (req, res) => {
  const userId = req.user?.id;
  const { id } = req.params;
  const { aims, period } = req.body;

  if (!userId) {
    throw new ApiError(404, "Please login first");
  }

  const aim = await FutureLog.findByIdAndUpdate({
    _id: id,
    user: userId,
  });
  if (!aim) {
    throw new ApiError(404, "Reqested aim is not found");
  }
  if (period) {
    aim.period = period;
    switch (period) {
      case "THIS YEAR":
        aim.endYear = parseInt(aim.startYear);
        break;
      case "NEXT 3 YEARS":
        aim.endYear =parseInt(aim.startYear) + 2;
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
  await aim.save({ validateBeforeSave: false }, { new: true });
  res.status(200).json(new ApiResponse(200, aim, "success"));
});

const getLogsByPeriod = asyncHandler(async (req, res) => {
  const userId = req.user?.id;

  const { period } = req.body;

  if (!userId) {
    throw new ApiError(404, "Please login first");
  }

  const aims = await FutureLog.find({
    period: period ? period : "THIS YEAR",
    user: userId,
  });
  res.status(200).json(new ApiResponse(200, aims, "success"));
});

const getAllLogs = asyncHandler(async (req, res) => {
  const userId = req.user?.id;

  if (!userId) {
    throw new ApiError(404, "Please login first");
  }
  const aims = await FutureLog.find({
    user: userId,
  });
  if (!aims) {
    throw new ApiError(404, "No aim is not found");
  }
  res
    .status(200)
    .json(new ApiResponse(200, { count: aims.length, aims }, "success"));
});

export {
  addFutureLog,
  getLog,
  deleteLog,
  updateLog,
  getLogsByPeriod,
  getAllLogs,
};
