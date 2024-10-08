"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.uploadOnCloudinary = void 0;
var _cloudinary = require("cloudinary");
var _fs = _interopRequireDefault(require("fs"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
_cloudinary.v2.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});
const uploadOnCloudinary = async localFilePath => {
  try {
    if (!localFilePath) return null;
    //upload
    // const response = await cloudinary.v2.uploader.upload(localFilePath, {
    //   resource_type: "auto",
    // });

    const response = await _cloudinary.v2.uploader.upload(localFilePath, {
      resource_type: "auto"
    });
    //file has been uploaded
    console.log("uploaded", response.url);
    _fs.default.unlinkSync(localFilePath);
    return response;
  } catch (error) {
    _fs.default.unlinkSync(localFilePath); // remove the locally saved temporary file as the upload operation failed
    console.log(error);
    return null;
  }
};
exports.uploadOnCloudinary = uploadOnCloudinary;