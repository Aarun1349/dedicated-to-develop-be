"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.userSignUp = exports.userSignIn = exports.updateUserDetails = exports.updateAvatar = exports.refreshAccessToken = exports.logoutUser = exports.getCurrentUser = exports.changeCurrentPassword = void 0;
var _AsyncHandler = require("../utils/AsyncHandler.js");
var _userModel = require("../models/user.model.js");
var _ApiError = require("../utils/ApiError.js");
var _ApiResponse = require("../utils/ApiResponse.js");
var _Cloudinary = require("../utils/Cloudinary.js");
const generateAccessAndRefreshToken = async userId => {
  try {
    const user = await _userModel.User.findById(userId);
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
    throw new _ApiError.ApiError(500, "Something went wrong");
  }
};
const userSignUp = exports.userSignUp = (0, _AsyncHandler.asyncHandler)(async (req, res) => {
  //Step 1: get user details from frontend
  const {
    fullname,
    email,
    password
  } = req.body;
  console.log("body", req.body, req.files);
  let {
    username
  } = req.body;
  if (!username) username = fullname;
  //Step2: validation
  if ([fullname, username, email, password].some(field => (field === null || field === void 0 ? void 0 : field.trim()) === "")) {
    throw new _ApiError.ApiError(400, "All fields are required");
  }

  //Step3: if user already exist
  const existedUser = await _userModel.User.findOne({
    $or: [{
      email
    }, {
      username
    }]
  });
  if (existedUser) {
    throw new _ApiError.ApiError(400, "user already existed");
  }

  //Step4: if image files exist or not and for avatar

  // if (Object.getPrototypeOf(req.files) === null) {
  //   throw new ApiError(400, "Avatar file is required");
  // }
  // const avatarLocalPath = req.files?.avatar[0]?.path;

  // console.log("avatar", avatarLocalPath);

  // if (!avatarLocalPath) {
  //   avatarLocalPath =`public\photos\defaultAvatar.png`
  //   console.log("avatar", avatarLocalPath);
  //   // throw new ApiError(400, "Avatar file is required");
  // }
  // // Step5: upload them to cloudinary,check avatar
  // const avatar = await uploadOnCloudinary(avatarLocalPath);

  // if (!avatar) {
  //   throw new ApiError(400, "Avatar file is required");
  // }

  //Step6: create entry in db
  const newUser = await _userModel.User.create({
    fullname,
    username: username.toLowerCase(),
    email,
    password
    // avatar: avatar.url ,
  });

  //Step7: check for user creation
  const user = await _userModel.User.findById(newUser._id).select("-password -refreshToken");
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
const userSignIn = exports.userSignIn = (0, _AsyncHandler.asyncHandler)(async (req, res) => {
  //Step: 1 get user details from database
  const {
    username,
    email,
    password
  } = req.body;
  // console.log("user", req.body);
  if ((!username || !email) && !password) {
    throw new _ApiError.ApiError(400, "username or email is required");
  }

  //Step2: validation
  if ([username, email, password].some(field => (field === null || field === void 0 ? void 0 : field.trim()) === "")) {
    throw new _ApiError.ApiError(400, "All fields are required");
  }

  //Step: 2 check user if exist or not
  const getUser = await _userModel.User.findOne({
    $or: [{
      username
    }, {
      email
    }]
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
  const loggedInUser = await _userModel.User.findById(getUser._id).select("-password -refreshToken");
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
const logoutUser = exports.logoutUser = (0, _AsyncHandler.asyncHandler)(async (req, res) => {
  await _userModel.User.findOneAndUpdate(req.user._id, {
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
  return res.status(200).clearCookie("accessToken", options).clearCookie("refreshToken", options).json(new _ApiResponse.ApiResponse(200, {}, "User logged Out"));
});
const updateAvatar = exports.updateAvatar = (0, _AsyncHandler.asyncHandler)(async (req, res) => {
  var _req$files;
  const avatarLocalPath = req === null || req === void 0 || (_req$files = req.files) === null || _req$files === void 0 || (_req$files = _req$files.avatar[0]) === null || _req$files === void 0 ? void 0 : _req$files.path;
  if (!avatarLocalPath) {
    throw new _ApiError.ApiError(400, "Avatar file is required");
  }
  // Step5: upload them to cloudinary,check avatar
  const avatar = await (0, _Cloudinary.uploadOnCloudinary)(avatarLocalPath);
  if (!avatar) {
    throw new _ApiError.ApiError(400, "Avatar file is required");
  }
  if (!avatar.url) {
    throw new _ApiError.ApiError(400, "Error while uploading Avatar");
  }
  const user = await _userModel.User.findByIdAndUpdate(req.user._id, {
    $set: {
      avatar: avatar.url
    }
  }, {
    new: true
  }).select("-password");
  return res.status(200).json(new _ApiResponse.ApiResponse(200, user, "Avatar Updated Successfully"));
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
  const user = await _userModel.User.findById(userId);
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
  const user = await _userModel.User.findById((_req$user = req.user) === null || _req$user === void 0 ? void 0 : _req$user._id).select(" -refreshToken");
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
const getCurrentUser = exports.getCurrentUser = (0, _AsyncHandler.asyncHandler)(async (req, res) => {
  var _req$user2;
  const user = await _userModel.User.findById((_req$user2 = req.user) === null || _req$user2 === void 0 ? void 0 : _req$user2._id).select("-password");
  if (!user) {
    throw new _ApiError.ApiError(404, "User not found");
  }
  return res.status(200).json(new _ApiResponse.ApiResponse(200, user));
});
const updateUserDetails = exports.updateUserDetails = (0, _AsyncHandler.asyncHandler)(async (req, res) => {
  var _req$user3;
  const {
    fullname
  } = req.body;
  if (!fullname) {
    throw new _ApiError.ApiError(400, "Please provide required details");
  }
  const user = await _userModel.User.findByIdAndUpdate((_req$user3 = req.user) === null || _req$user3 === void 0 ? void 0 : _req$user3._id, {
    $set: {
      fullname: fullname
    }
  }, {
    new: true
  }).select("-password");
  if (!user) {
    throw new _ApiError.ApiError(404, "User not found");
  }
  return res.status(200).json(new _ApiResponse.ApiResponse(200, user, "User Details Updated Successfully!"));
});