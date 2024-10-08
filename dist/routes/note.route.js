"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _express = require("express");
var _authMiddleware = require("../middleware/auth.middleware.js");
var _notesController = require("../controllers/notes.controller.js");
const noteRouter = (0, _express.Router)();
noteRouter.use(_authMiddleware.verifyJWT);

//routes
noteRouter.route("/add-note").post(_notesController.addNewNote);
noteRouter.route("/all-notes").get(_notesController.getAllNotes);
noteRouter.route("/:noteId").put(_notesController.updateNote).delete(_notesController.deleteNote).get(_notesController.getNote);
var _default = exports.default = noteRouter;