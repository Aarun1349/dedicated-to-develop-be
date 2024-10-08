"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.asyncHandler = void 0;
const asyncHandler = fn => async (req, res, next) => {
  try {
    await fn(req, res, next);
  } catch (error) {
    console.log("error", error);
    res.status(error.code || 500).json({
      success: false,
      message: error.message
    });
  }
};
exports.asyncHandler = asyncHandler;