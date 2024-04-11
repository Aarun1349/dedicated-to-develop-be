import {Router} from "express"
import{userSignUp, userSignIn} from '../controllers/user.controller.js'
import { upload } from "../middleware/multer.middleware.js";
const userRouter = Router();

userRouter.route("/login").get(userSignIn)
userRouter.route("/signup").post(upload.fields([
    { name: "avatar", maxCount: 1 },
    {
      name: "coverImage",
      maxCount: 1,
    },
  ]),userSignUp)

export default userRouter;