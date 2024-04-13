import { Router } from "express";
import { verifyJWT } from "../middleware/auth.middleware.js";
import {
  addNewNote,
  deleteNote,
  getAllNotes,
  getNote,
  updateNote,
} from "../controllers/notes.controller.js";

const noteRouter = Router();

noteRouter.use(verifyJWT);

//routes
noteRouter.route("/add-note").post(addNewNote);
noteRouter.route("/all-notes").get(getAllNotes);
noteRouter.route("/:noteId").put(updateNote).delete(deleteNote).get(getNote);

export default noteRouter;
