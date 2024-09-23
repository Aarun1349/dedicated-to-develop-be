"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.updateSuggestion = exports.toggleImportant = exports.getSuggestion = exports.getAllSuggestions = exports.deleteSuggestion = exports.addNewSuggestion = void 0;
var _AsyncHandler = require("../utils/AsyncHandler.js");
var _suggestionsModel = require("../models/suggestions.model.js");
var _ApiError = require("../utils/ApiError.js");
var _ApiResponse = require("../utils/ApiResponse.js");
const addNewSuggestion = exports.addNewSuggestion = (0, _AsyncHandler.asyncHandler)(async (req, res) => {
  var _req$user;
  const userId = (_req$user = req.user) === null || _req$user === void 0 ? void 0 : _req$user.id;
  const {
    suggestion
  } = req.body;
  if (!userId) {
    throw new _ApiError.ApiError(404, "Please login first");
  }
  if (!suggestion) {
    throw new _ApiError.ApiError(404, "suggestion text is requiredl");
  }
  const existingSuggestion = await _suggestionsModel.Suggestion.findOne({
    suggestion
  });
  if (existingSuggestion) {
    throw new _ApiError.ApiError(400, "Suggestion is already present");
  }
  const newSuggestion = await _suggestionsModel.Suggestion.create({
    user: userId,
    suggestion
  });
  if (!newSuggestion) {
    throw new _ApiError.ApiError(400, "Someting went wrong");
  }
  res.status(200).json(new _ApiResponse.ApiResponse(200, newSuggestion, "success"));
});
const getAllSuggestions = exports.getAllSuggestions = (0, _AsyncHandler.asyncHandler)(async (req, res) => {
  var _req$user2;
  const userId = (_req$user2 = req.user) === null || _req$user2 === void 0 ? void 0 : _req$user2.id;
  if (!userId) {
    throw new _ApiError.ApiError(404, "Please login first");
  }
  const allSuggestions = await _suggestionsModel.Suggestion.find({
    user: userId
  });
  if (getAllSuggestions.length <= 0) {
    throw new _ApiError.ApiError(404, "No Suggestion is available for you");
  }
  res.status(200).json(new _ApiResponse.ApiResponse(200, allSuggestions, "success"));
});
const updateSuggestion = exports.updateSuggestion = (0, _AsyncHandler.asyncHandler)(async (req, res) => {
  var _req$user3;
  const userId = (_req$user3 = req.user) === null || _req$user3 === void 0 ? void 0 : _req$user3.id;
  const {
    suggestionId
  } = req.params;
  const {
    suggestion
  } = req.body;
  if (!userId) {
    throw new _ApiError.ApiError(404, "Please login first");
  }
  const existingSuggestion = await _suggestionsModel.Suggestion.findById({
    _id: suggestionId,
    user: userId
  });
  if (!existingSuggestion) {
    throw new _ApiError.ApiError(404, "Suggestion is not present");
  }
  const updateSuggestion = await _suggestionsModel.Suggestion.findByIdAndUpdate({
    _id: suggestionId,
    user: userId,
    suggestion: suggestion
  });
  updateSuggestion.suggestion = suggestion;
  updateSuggestion.save({
    valiateBeforeSave: false,
    new: true
  });
  if (!updateSuggestion) {
    throw new _ApiError.ApiError(400, "Something went wrong");
  }
  res.status(200).json(new _ApiResponse.ApiResponse(200, updateSuggestion, "success"));
});
const toggleImportant = exports.toggleImportant = (0, _AsyncHandler.asyncHandler)(async (req, res) => {
  var _req$user4;
  const userId = (_req$user4 = req.user) === null || _req$user4 === void 0 ? void 0 : _req$user4.id;
  const {
    suggestionId
  } = req.params;
  if (!userId) {
    throw new _ApiError.ApiError(404, "Please login first");
  }
  const existingSuggestion = await _suggestionsModel.Suggestion.findByIdAndUpdate({
    _id: suggestionId,
    user: userId
  });
  if (!existingSuggestion) {
    throw new _ApiError.ApiError(404, "Suggestion is not present");
  }
  const toggle = await _suggestionsModel.Suggestion.findByIdAndUpdate({
    _id: suggestionId
  });
  toggle.important = !toggle.important;
  await toggle.save({
    valiateBeforeSave: false,
    new: true
  });
  res.status(200).json(new _ApiResponse.ApiResponse(200, toggle, "success"));
});
const getSuggestion = exports.getSuggestion = (0, _AsyncHandler.asyncHandler)(async (req, res) => {
  var _req$user5;
  const userId = (_req$user5 = req.user) === null || _req$user5 === void 0 ? void 0 : _req$user5.id;
  const {
    suggestionId
  } = req.params;
  if (!userId) {
    throw new _ApiError.ApiError(404, "Please login first");
  }
  let existingSuggestion = null;
  try {
    existingSuggestion = await _suggestionsModel.Suggestion.findById({
      _id: suggestionId,
      user: userId
    });
    console.log(existingSuggestion);
  } catch (error) {
    console.error(error);
  }
  if (!existingSuggestion) {
    throw new _ApiError.ApiError(404, "Suggestion is not present");
  }
  res.status(200).json(new _ApiResponse.ApiResponse(200, existingSuggestion, "success"));
});
const deleteSuggestion = exports.deleteSuggestion = (0, _AsyncHandler.asyncHandler)(async (req, res) => {
  var _req$user6;
  const userId = (_req$user6 = req.user) === null || _req$user6 === void 0 ? void 0 : _req$user6.id;
  const {
    suggestionId
  } = req.params;
  if (!userId) {
    throw new _ApiError.ApiError(404, "Please login first");
  }
  const existingSuggestion = await _suggestionsModel.Suggestion.findById({
    _id: suggestionId,
    user: userId
  });
  if (!existingSuggestion) {
    throw new _ApiError.ApiError(404, "Suggestion is not present");
  }
  await _suggestionsModel.Suggestion.findByIdAndDelete({
    _id: suggestionId
  });
  res.status(200).json(new _ApiResponse.ApiResponse(200, existingSuggestion, "success"));
});