import { Router } from "express";
import {
  userSignUp,
  userSignIn,
  logoutUser,
  changeCurrentPassword,
  updateUserDetails,
  getCurrentUser,
} from "../controllers/user.controller.js";
import { upload } from "../middleware/multer.middleware.js";
import { verifyJWT } from "../middleware/auth.middleware.js";
const userRouter = Router();

userRouter.route("/login").post(userSignIn);
userRouter.route("/:id").post(verifyJWT, getCurrentUser);
userRouter.route("/logout").post(verifyJWT, logoutUser);
userRouter.route("/password").put(verifyJWT, changeCurrentPassword);
userRouter.route("/update").patch(verifyJWT, updateUserDetails);
userRouter.route("/signup").post(
  upload.fields([
    { name: "avatar", maxCount: 1 },
    {
      name: "coverImage",
      maxCount: 1,
    },
  ]),
  userSignUp
);

export default userRouter;
