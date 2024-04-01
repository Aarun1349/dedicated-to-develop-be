import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import { asyncHandler } from "../utils/AsyncHandler.js";
import {User} from "../models/user.model.js";
const generateAccessAndRefreshToken = async (userId) => {
  try {
    const user = await User.findById(userId);
    const accessToken = await user.generateAccessToken();
    const refreshToken = await user.generateRefreshToken();
    user.refreshToken = refreshToken;
    user.accessToken = accessToken;
    await user.save({ validateBeforeSave: false });
    return {
      accessToken,
      refreshToken,
    };
  } catch (error) {
    throw new ApiError(500, "Something went wrong");
  }
};

const userSignUp = asyncHandler(async (req, res) => {
  //Step 1: get user details from frontend
  const { username, fullname, email, password } = req.body;

  //Step2: validation
  if (
    [fullname, username, email, password].some((field) => field?.trim() === "")
  ) {
    throw new ApiError(400, "All fields are required");
  }

  //Step3: if user already exist
  const existedUser = await User.findOne({ $or: [{ email }, { username }] });
  if (existedUser) {
    throw new ApiError(400, "user already existed");
  }

  //Step4: if image files exist or not and for avatar

  // if (Object.getPrototypeOf(req.files) === null) {
  //   throw new ApiError(400, "Avatar file is required");
  // }
  const avatarLocalPath = req.files?.avatar[0]?.path;
  console.log(avatarLocalPath);

  if (!avatarLocalPath) {
    throw new ApiError(400, "Avatar file is required");
  }
  //Step5: upload them to cloudinary,check avatar
  const avatar = await uploadOnCloudinary(avatarLocalPath);

  if (!avatar) {
    throw new ApiError(400, "Avatar file is required");
  }

  //Step6: create entry in db
  const newUser = await User.create({
    fullname,
    username: username.toLowerCase(),
    email,
    password,
    avatar: avatar.url,
  });

  //Step7: check for user creation
  const user = await User.findById(newUser._id).select(
    "-password -refreshToken"
  );
  if (user) {
    return res.status(201).json(new ApiResponse(200, user));
  } else {
    throw new ApiError(500, "Something went wrong");
  }

  //Step8: return responsee to user, except password and refresh token

  //   const { accessToken, refreshToken } = await generateAccessAndRefreshToken(
  //     user._id
  //   );
  //   return res
  //     .status(200)
  //     .cookie("accessToken", accessToken, options)
  //     .cookie("refreshToken", refreshToken, options)
  //     .json(
  //       new ApiResponse(200, {
  //         user: user,
  //         accessToken,
  //         refreshToken,
  //       })
  //     );
});

const userSignIn = asyncHandler(async (req, res) => {
  //Step: 1 get user details from database
  const { username, email, password } = req.body;

  if ((!username || !email) && !password) {
    throw new ApiError(400, "username or email is required");
  }
  //Step2: validation
  if ([username, email, password].some((field) => field?.trim() === "")) {
    throw new ApiError(400, "All fields are required");
  }

  //Step: 2 check user if exist or not
  const getUser = await User.findOne({ $or: [{ username }, { email }] });
  if (!getUser) {
    throw new ApiError(404, "User does not exist");
  }

  //Step: 3 check password is correct or not

  const isPasswordMatch = await getUser.isPasswordCorrect(password);

  if (!isPasswordMatch) {
    throw new ApiError(402, "Password does not match");
  }
  const { accessToken, refreshToken } = await generateAccessAndRefreshToken(
    getUser._id
  );

  const loggedInUser = await User.findById(getUser._id).select(
    "-password -refreshToken"
  );
  const options = { httpOnly: true, secure: true };
  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new ApiResponse(200, {
        user: loggedInUser,
        accessToken,
        refreshToken,
      })
    );
});

const logoutUser = asyncHandler(async (req, res) => {
    await User.findOneAndUpdate(
      req.user._id,
      {
        $unset: { refreshToken: 1 }, // this removes the field from document
      },
      { new: true }
    );
    const options = {
      httpOnly: true,
      secure: true,
    };
    return res
      .status(200)
      .clearCookie("accessToken", options)
      .clearCookie("refreshToken", options)
      .json(new ApiResponse(200, {}, "User logged Out"));
  });

export { userSignIn, userSignUp,logoutUser };
