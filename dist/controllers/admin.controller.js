"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.refreshAccessToken = exports.logoutAdmin = exports.login = exports.getAdmin = exports.createAdmin = exports.changeCurrentPassword = void 0;
var _AsyncHandler = require("../utils/AsyncHandler.js");
var _adminModel = require("../models/admin.model.js");
var _ApiError = require("../utils/ApiError.js");
var _ApiResponse = require("../utils/ApiResponse.js");
const generateAccessAndRefreshToken = async userId => {
  try {
    const user = await _adminModel.Admin.findById(userId);
    const accessToken = await user.generateAccessToken();
    const refreshToken = await user.generateRefreshToken();
    user.refreshToken = refreshToken;
    user.accessToken = accessToken;
    await user.save({
      validateBeforeSave: false
    });
    return {
      accessToken,
      refreshToken
    };
  } catch (error) {
    console.log(error);
    throw new _ApiError.ApiError(500, "Something went wrong");
  }
};
const createAdmin = exports.createAdmin = (0, _AsyncHandler.asyncHandler)(async (req, res) => {
  //Step 1: get user details from frontend
  const {
    username,
    email,
    password
  } = req.body;
  console.log("body", req.body);
  //Step2: validation
  if ([username, email, password].some(field => (field === null || field === void 0 ? void 0 : field.trim()) === "")) {
    throw new _ApiError.ApiError(400, "All fields are required");
  }

  //Step3: if user already exist
  const existedUser = await _adminModel.Admin.findOne({
    $or: [{
      email
    }, {
      username
    }]
  });
  if (existedUser) {
    throw new _ApiError.ApiError(400, "user already existed");
  }

  //Step6: create entry in db
  const newUser = await _adminModel.Admin.create({
    username: username.toLowerCase(),
    email,
    password
  });

  //Step7: check for user creation
  const user = await _adminModel.Admin.findById(newUser._id).select("-password -refreshToken");
  //Step8: return response to user, except password and refresh token
  if (user) {
    const {
      accessToken,
      refreshToken
    } = await generateAccessAndRefreshToken(user._id);
    const options = {
      httpOnly: true,
      secure: true
    };
    return res.status(201).cookie("accessToken", accessToken, options).cookie("refreshToken", refreshToken, options).json(new _ApiResponse.ApiResponse(200, {
      user: user
      // accessToken,
      // refreshToken,
    }));
  } else {
    throw new _ApiError.ApiError(500, "Something went wrong");
  }
});
const login = exports.login = (0, _AsyncHandler.asyncHandler)(async (req, res) => {
  //Step: 1 get user details from database
  const {
    username,
    email,
    password
  } = req.body;
  if ((!username || !email) && !password) {
    throw new _ApiError.ApiError(400, "username or email is required");
  }
  //Step2: validation
  if ([username, email, password].some(field => (field === null || field === void 0 ? void 0 : field.trim()) === "")) {
    throw new _ApiError.ApiError(400, "All fields are required");
  }

  //Step: 2 check user if exist or not
  const getUser = await _adminModel.Admin.findOne({
    $or: [{
      username
    }, {
      email
    }],
    role: "admin"
  });
  if (!getUser) {
    throw new _ApiError.ApiError(404, "User does not exist");
  }

  //Step: 3 check password is correct or not

  const isPasswordMatch = await getUser.isPasswordCorrect(password);
  if (!isPasswordMatch) {
    throw new _ApiError.ApiError(402, "Password does not match");
  }
  const {
    accessToken,
    refreshToken
  } = await generateAccessAndRefreshToken(getUser._id);
  const loggedInUser = await _adminModel.Admin.findById(getUser._id).select("-password -refreshToken");
  const options = {
    httpOnly: true,
    secure: true
  };
  return res.status(200).cookie("accessToken", accessToken, options).cookie("refreshToken", refreshToken, options).json(new _ApiResponse.ApiResponse(200, {
    user: loggedInUser,
    accessToken,
    refreshToken
  }));
});
const logoutAdmin = exports.logoutAdmin = (0, _AsyncHandler.asyncHandler)(async (req, res) => {
  await _adminModel.Admin.findOneAndUpdate(req.user._id, {
    $unset: {
      refreshToken: 1
    } // this removes the field from document
  }, {
    new: true
  });
  const options = {
    httpOnly: true,
    secure: true
  };
  return res.status(200).clearCookie("accessToken", options).clearCookie("refreshToken", options).json(new _ApiResponse.ApiResponse(200, {}, "Admin logged Out"));
});
const refreshAccessToken = exports.refreshAccessToken = (0, _AsyncHandler.asyncHandler)(async (req, res) => {
  const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken;
  if (!incomingRefreshToken) {
    throw new _ApiError.ApiError(401, "Uauthorized request. Please login again");
  }
  const verifyToken = jwt.verify(incomingRefreshToken, process.env.REFRESH_TOKEN_SECRET);
  if (!verifyToken) {
    throw new _ApiError.ApiError(401, "Please login again");
  }
  const userId = verifyToken._id;
  const user = await _adminModel.Admin.findById(userId);
  if (!user) {
    throw new _ApiError.ApiError(404, "User not found. Please create your account");
  }
  if (incomingRefreshToken !== user.refreshToken) {
    throw new _ApiError.ApiError(401, "Refresh Token is Invalid or expired");
  }
  const options = {
    httpOnly: true,
    secure: true
  };
  const {
    accessToken,
    refreshToken
  } = await generateAccessAndRefreshToken(user._id);
  return res.status(200).cookie("accessToken", accessToken, options).cookie("refreshToken", refreshToken, options).json(new _ApiResponse.ApiResponse(200, {
    user: user,
    accessToken,
    refreshToken: "Access token refereshed"
  }));
});
const changeCurrentPassword = exports.changeCurrentPassword = (0, _AsyncHandler.asyncHandler)(async (req, res) => {
  var _req$user;
  const {
    oldPassword,
    newPassword
  } = req.body;
  if (!oldPassword || !newPassword) {
    throw new _ApiError.ApiError(400, "Please provide required details");
  }
  const user = await _adminModel.Admin.findById((_req$user = req.user) === null || _req$user === void 0 ? void 0 : _req$user._id).select(" -refreshToken");
  if (!user) {
    throw new _ApiError.ApiError(404, "User not found");
  }
  const isPasswordCorrect = await user.isPasswordCorrect(oldPassword);
  if (!isPasswordCorrect) {
    throw new _ApiError.ApiError(401, "Password not matched");
  }
  user.password = newPassword;
  await user.save({
    validateBeforeSave: false
  }, {
    new: true
  });
  return res.status(200).json(new _ApiResponse.ApiResponse(200, user, "Password Updated Successfully!"));
});
const getAdmin = exports.getAdmin = (0, _AsyncHandler.asyncHandler)(async (req, res) => {
  var _req$user2;
  const user = await _adminModel.Admin.findById((_req$user2 = req.user) === null || _req$user2 === void 0 ? void 0 : _req$user2._id).select("-password");
  if (!user) {
    throw new _ApiError.ApiError(404, "User not found");
  }
  return res.status(200).json(new _ApiResponse.ApiResponse(200, user));
});