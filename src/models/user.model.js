import { Schema, model } from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
const userSchema = new Schema(
  {
    username: {
      unique: true,
      required: true,
      type: String,
      lowercase: true,
      trim: true,
      index: true,
    },
    fullname: {
      unique: true,
      required: true,
      type: String,
      index: true,
    },
    email: {
      unique: true,
      required: true,
      type: String,
      lowercase: true,
      trim: true,
    },
    password: {
      unique: true,
      required: [true, "Password is required"],
      type: String,
    },
    avatar: {
      type: String, //Cloudinary
      // required: true,
    },

    refreshToken: {
      type: String,
    },
    premium: {
      type: Boolean,
    },
  },
  { timestamps: true }
);

userSchema.pre("save", async function (next) {
  // need to check here
  if (!this.isModified("password")) return next();
  this.hashedPassword = await bcrypt.hash(this.password, 10);
  this.password = this.hashedPassword;
  next();
});

userSchema.methods.isPasswordCorrect = async function (password) {
  return await bcrypt.compare(password, this.password);
};

userSchema.methods.generateAccessToken = async function () {
  return await jwt.sign(
    {
      _id: this._id,
      email: this.email,
      username: this.username,
      fullname: this.fullname,
    },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: process.env.ACCESS_TOKEN_EXPIRY }
  );
};
userSchema.methods.generateRefreshToken = async function () {
  return await jwt.sign(
    {
      _id: this._id,
    },
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: process.env.REFRESH_TOKEN_EXPIRY }
  );
};

const User = model("User", userSchema);
export { User };
