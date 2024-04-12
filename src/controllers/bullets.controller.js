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

export { addNewBullet };
