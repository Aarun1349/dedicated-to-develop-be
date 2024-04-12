import { Router } from "express";
import { verifyJWT } from "../middleware/auth.middleware.js";
import {
  addNewBullet,
  getTodaysBulletOfUser,
  changeState,
  changeDate,
  deleteBullet,
  getBullet,
  updateBullet,
  markDone,
} from "../controllers/bullets.controller.js";

const bulletRouter = Router();

bulletRouter.use(verifyJWT);

bulletRouter.route("/newBullet").post(addNewBullet);
bulletRouter.route("/today").get(getTodaysBulletOfUser);
bulletRouter.route("/change-state/:bulletId").put(changeState);
bulletRouter.route("/change-date/:bulletId").put(changeDate);
bulletRouter
  .route("/:bulletId")
  .delete(deleteBullet)
  .get(getBullet)
  .put(updateBullet)
  .patch(markDone);
export default bulletRouter;
