import { Router } from "express";
import { verifyAdminJWT, verifyJWT } from "../middleware/auth.middleware.js";
import { login, createAdmin,logoutAdmin } from "../controllers/admin.controller.js";

const adminRouter = Router();

adminRouter.use(verifyAdminJWT);

adminRouter.route("/admin").get(login);
adminRouter.route("/create").post(createAdmin);
adminRouter.route("/logout").put(logoutAdmin);

export default adminRouter;
