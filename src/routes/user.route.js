import {Router} from "express"
import{userSignUp, userSignIn} from '../controllers/user.controller.js'

const userRouter = Router();

userRouter.route("/login").get(userSignIn)
userRouter.route("/signup").post(userSignUp)

export default userRouter;