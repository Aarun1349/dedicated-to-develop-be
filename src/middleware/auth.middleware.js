import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/AsyncHandler.js";
import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";
import { Admin } from "../models/admin.model.js";

export const verifyJWT = asyncHandler(async (req, _, next) => {
  // can be found this code in production scenario
  console.log("the cookies____", req.cookies);
  try {
    const token =
      req.cookies?.accessToken ||
      req.header("Authorization")?.replace("Bearer ", "");
      console.log("token____",token)
    if (!token || token === undefined) {
      throw new ApiError(401, "Unauthorized User");
    }
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    const user = await User.findById(decoded?._id).select(
      "-password -refreshToken"
    );
    console.log("the user token____", decoded, user);
    if (!user) {
      //NEXT_VIDEO: discuss abput frontend
      throw new ApiError(401, "Invalid Access Token");
    }
    req.user = user;
    next();
  } catch (error) {
    throw new ApiError(500, "Something went wrong");
  }
});

export const verifyAdminJWT = asyncHandler(async (req, _, next) => {
  // can be found this code in production scenario

  try {
    const token =
      req.cookies?.accessToken ||
      req.header("Authorization")?.replace("Bearer ", "");
    if (!token || token === undefined) {
      throw new ApiError(401, "Unauthorized User");
    }
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    const user = await Admin.findById(decoded?._id).select(
      "-password -refreshToken"
    );

    if (!user) {
      //NEXT_VIDEO: discuss abput frontend
      throw new ApiError(401, "Invalid Access Token");
    }
    req.user = user;
    next();
  } catch (error) {
    throw new ApiError(500, "Something went wrong");
  }
});
