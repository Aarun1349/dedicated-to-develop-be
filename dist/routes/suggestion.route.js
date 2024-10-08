"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _express = require("express");
var _authMiddleware = require("../middleware/auth.middleware.js");
var _suggestionsController = require("../controllers/suggestions.controller.js");
const suggestionRouter = (0, _express.Router)();
suggestionRouter.use(_authMiddleware.verifyJWT);

//routes
suggestionRouter.route("/addSuggestion").post(_suggestionsController.addNewSuggestion);
suggestionRouter.route("/suggestions").get(_suggestionsController.getAllSuggestions);
suggestionRouter.route("/:suggestionId").put(_suggestionsController.updateSuggestion).delete(_suggestionsController.deleteSuggestion).get(_suggestionsController.getSuggestion);
suggestionRouter.route("/mark-important/:suggestionId").put(_suggestionsController.toggleImportant);
var _default = exports.default = suggestionRouter;