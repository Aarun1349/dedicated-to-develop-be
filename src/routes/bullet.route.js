import { Router } from "express";
import { verifyJWT } from "../middleware/auth.middleware.js";
import { addNewBullet } from "../controllers/bullets.controller.js";

const bulletRouter = Router();

bulletRouter.use(verifyJWT);

bulletRouter.route("/newBullet").post(addNewBullet);
export default bulletRouter;
