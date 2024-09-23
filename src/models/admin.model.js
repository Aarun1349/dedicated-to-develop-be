import { Schema, model } from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
const adminSchema = new Schema(
  {
    username: {
      unique: true,
      required: true,
      type: String,
      lowercase: true,
      trim: true,
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

    refreshToken: {
      type: String,
    },
    role: {
      type: String,
      default: "admin",
    },
  },
  { timestamps: true }
);

adminSchema.pre("save", async function (next) {
  // need to check here
  if (!this.isModified("password")) return next();
  this.hashedPassword = await bcrypt.hash(this.password, 10);
  this.password = this.hashedPassword;
  next();
});

adminSchema.methods.isPasswordCorrect = async function (password) {
  return await bcrypt.compare(password, this.password);
};

adminSchema.methods.generateAccessToken = async function () {
  return await jwt.sign(
    {
      _id: this._id,
      email: this.email,
      username: this.username,
    },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: process.env.ACCESS_TOKEN_EXPIRY }
  );
};
adminSchema.methods.generateRefreshToken = async function () {
  return await jwt.sign(
    {
      _id: this._id,
    },
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: process.env.REFRESH_TOKEN_EXPIRY }
  );
};

const Admin = model("Admin", adminSchema);
export { Admin };
