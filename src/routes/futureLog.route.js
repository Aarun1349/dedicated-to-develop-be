import { Router } from "express";
import { verifyJWT } from "../middleware/auth.middleware.js";
import {
  addFutureLog,
  deleteLog,
  getLog,
  getLogsByPeriod,
  getAllLogs,
  updateLog,
} from "../controllers/futureLog.controller.js";
import { updateAvatar } from "../controllers/user.controller.js";

const futureRouter = Router();

futureRouter.use(verifyJWT);

//routes
futureRouter.route("/add").post(addFutureLog);
futureRouter.route("/future-log").get(getAllLogs);
futureRouter.route("/period").get(getLogsByPeriod);
futureRouter.route("/:id").put(updateLog).delete(deleteLog).get(getLog);

export default futureRouter;
