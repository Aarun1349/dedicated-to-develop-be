import { Router } from "express";
import { verifyJWT } from "../middleware/auth.middleware.js";
import {
  addNewHabit,
  deleteHabit,
  getAllHabits,
  togglePause,
  updateHabit,
  getHabit,
  toggleComplete,
} from "../controllers/habits.controller.js";

const habitRouter = Router();

habitRouter.use(verifyJWT);

habitRouter.route("/create-habit").post(addNewHabit);
habitRouter.route("/pause-habit/:habitId").put(togglePause);
habitRouter.route("/update/:habitId").put(updateHabit);
habitRouter.route("/all-habits").get(getAllHabits);
habitRouter
  .route("/:habitId")
  .delete(deleteHabit)
  .get(getHabit)
  .put(toggleComplete);

export default habitRouter;
