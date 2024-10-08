import { Router } from "express";
import {
  userSignUp,
  userSignIn,
  logoutUser,
  changeCurrentPassword,
  updateUserDetails,
  refreshAccessToken,
  getCurrentUser
} from "../controllers/user.controller.js";
import { upload } from "../middleware/multer.middleware.js";
import { verifyJWT } from "../middleware/auth.middleware.js";
const userRouter = Router();

userRouter.route("/login").post(userSignIn);
userRouter.route("/logout").post(verifyJWT, logoutUser);
userRouter.route("/:user_id").get(verifyJWT, getCurrentUser);
userRouter.route("/update/:user_id").patch(verifyJWT, updateUserDetails);
userRouter.route("/changePassword/:user_id").patch(verifyJWT, changeCurrentPassword);
userRouter.route("/refresh/:user_id").patch (verifyJWT, refreshAccessToken);
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
