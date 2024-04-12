import { asyncHandler } from "../utils/AsyncHandler.js";
import { Bullet } from "../models/bullets.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const addNewBullet = asyncHandler(async (req, res) => {
  const userId = req.user?.id;
  const { bullet } = req.body;
  if (!userId) {
    throw new ApiError(404, "Please login first");
  }
  if (!bullet) {
    throw new ApiError(404, "Bullet name is requiredl");
  }
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  const existingBullet = await Bullet.findOne({
    dateField: { $gte: today, $lt: tomorrow },
  });
  if (existingBullet) {
    throw new ApiError(400, "Tasks already added for today", existingBullet);
  }
  const newBullet = await Bullet.create({
    user: userId,
    bullet,
  });
  if (!newBullet) {
    throw new ApiError(400, "Someting went wrong");
  }

  res.status(200).json(new ApiResponse(200, newBullet, "success"));
});

const getTodaysBulletOfUser = asyncHandler(async (req, res) => {
  const userId = req.user?.id;
  if (!userId) {
    throw new ApiError(404, "Please login first");
  }
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const todaysBullet = await Bullet.find({
    user: userId,
    dateField: { $gte: today, $lt: new Date(today.getTime() + 86400000) },
  });
  console.log(todaysBullet.length);
  if (todaysBullet.length <= 0) {
    throw new ApiError(404, "No tasks found for today, Enjoy your 🍵");
  }
  res.status(200).json(new ApiResponse(200, todaysBullet, "success"));
});

const changeState = asyncHandler(async (req, res) => {
  const userId = req.user?.id;
  const { state } = req.body;
  const { bulletId } = req.params;
  if (!userId) {
    throw new ApiError(404, "Please login first");
  }
  const updateBullet = await Bullet.findByIdAndUpdate({
    _id: bulletId,
    user: userId,
  });
  if (!updateBullet) {
    throw new ApiError(404, "Requested bullet is not found");
  }
  updateBullet.state = state;
  await updateBullet.save({ validateBeforeSave: false }, { new: true });
  res.status(200).json(new ApiResponse(200, updateBullet, "success"));
});

const markDone = asyncHandler(async (req, res) => {
  const userId = req.user?.id;
  const { bulletId } = req.params;
  if (!userId) {
    throw new ApiError(404, "Please login first");
  }
  const markComplete = await Bullet.findByIdAndUpdate({
    _id: bulletId,
    user: userId,
  });
  if (!markComplete) {
    throw new ApiError(404, "Requested bullet is not found");
  }

  markComplete.state = "Completed";
  await markComplete.save({ validateBeforeSave: false }, { new: true });
  res.status(200).json(new ApiResponse(200, markComplete, "success"));
});

const getBullet = asyncHandler(async (req, res) => {
  const userId = req.user?.id;

  const { bulletId } = req.params;
  if (!userId) {
    throw new ApiError(404, "Please login first");
  }
  const bullet = await Bullet.findById({
    _id: bulletId,
    user: userId,
  });
  if (!bullet) {
    throw new ApiError(404, "Requested bullet is not found");
  }
  res.status(200).json(new ApiResponse(200, bullet, "success"));
});

const deleteBullet = asyncHandler(async (req, res) => {
  const userId = req.user?.id;

  const { bulletId } = req.params;
  if (!userId) {
    throw new ApiError(404, "Please login first");
  }
  const bullet = await Bullet.findById({
    _id: bulletId,
    user: userId,
  });

  if (!bullet) {
    throw new ApiError(404, "Requested bullet is not found");
  }
   await Bullet.findByIdAndDelete({ _id: bulletId, user: userId });
  res.status(200).json(new ApiResponse(200, "success"));
});

const changeDate = asyncHandler(async (req, res) => {
  const userId = req.user?.id;
  const { dateField } = req.body;
  const { bulletId } = req.params;
  if (!userId) {
    throw new ApiError(404, "Please login first");
  }
  const updateBulletDate = await Bullet.findByIdAndUpdate({
    _id: bulletId,
    user: userId,
  });
  if (!updateBulletDate) {
    throw new ApiError(404, "Requested bullet is not found");
  }
  updateBulletDate.dateField=dateField
  updateBulletDate.state="ReScheduled"
  await updateBulletDate.save({validateBeforeSave:false,new:true})
  res.status(200).json(new ApiResponse(200, updateBulletDate, "success"));
});

const updateBullet = asyncHandler(async (req, res) => {
  const userId = req.user?.id;
  const { bullet, priority, alligned_to } = req.body;
  const { bulletId } = req.params;
  if (!userId) {
    throw new ApiError(404, "Please login first");
  }
  const updateBullet = await Bullet.findByIdAndUpdate({
    _id: bulletId,
    user: userId,
    bullet,
    priority,
    alligned_to,
  });
  if (!updateBullet) {
    throw new ApiError(404, "Requested bullet is not found");
  }
  updateBullet.bullet = bullet;
  priority ? (updateBullet.priority = priority) : updateBullet.priority;
  alligned_to
    ? (alligned_to.alligned_to = alligned_to)
    : updateBullet.alligned_to;
  updateBullet.bullet = bullet;
  await updateBullet.save({ validateBeforeSave: false }, { new: true });
  res.status(200).json(new ApiResponse(200, updateBullet, "success"));
});

export {
  addNewBullet,
  getTodaysBulletOfUser,
  changeState,
  getBullet,
  changeDate,
  deleteBullet,
  markDone,
  updateBullet,
};
