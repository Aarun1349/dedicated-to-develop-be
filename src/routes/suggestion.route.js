import { Router } from "express";
import { verifyJWT } from "../middleware/auth.middleware.js";
import {
  addNewSuggestion,
  deleteSuggestion,
  getAllSuggestions,
  getSuggestion,
  toggleImportant,
  updateSuggestion,
} from "../controllers/suggestions.controller.js";

const suggestionRouter = Router();

suggestionRouter.use(verifyJWT);

//routes
suggestionRouter.route("/addSuggestion").post(addNewSuggestion);
suggestionRouter.route("/suggestions").get(getAllSuggestions);
suggestionRouter
  .route("/:suggestionId")
  .put(updateSuggestion)
  .delete(deleteSuggestion)
  .get(getSuggestion);
suggestionRouter.route("/mark-important/:suggestionId").put(toggleImportant);

export default suggestionRouter;
