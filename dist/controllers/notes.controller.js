"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.updateNote = exports.getNote = exports.getAllNotes = exports.deleteNote = exports.addNewNote = void 0;
var _AsyncHandler = require("../utils/AsyncHandler.js");
var _notesModel = require("../models/notes.model.js");
var _ApiError = require("../utils/ApiError.js");
var _ApiResponse = require("../utils/ApiResponse.js");
const addNewNote = exports.addNewNote = (0, _AsyncHandler.asyncHandler)(async (req, res) => {
  var _req$user;
  const userId = (_req$user = req.user) === null || _req$user === void 0 ? void 0 : _req$user.id;
  const {
    content,
    title
  } = req.body;
  if (!userId) {
    throw new _ApiError.ApiError(404, "Please login first");
  }
  if (!content || !title) {
    throw new _ApiError.ApiError(404, "note title and content is required");
  }

  // const existingSuggestion = await Suggestion.findOne({
  //   suggestion,
  // });
  // if (existingSuggestion) {
  //   throw new ApiError(400, "Suggestion is already present");
  // }
  const newNote = await _notesModel.Note.create({
    user: userId,
    title,
    content
  });
  console.log(newNote);
  if (!newNote) {
    throw new _ApiError.ApiError(400, "Someting went wrong");
  }
  res.status(200).json(new _ApiResponse.ApiResponse(200, newNote, "success"));
});
const getAllNotes = exports.getAllNotes = (0, _AsyncHandler.asyncHandler)(async (req, res) => {
  var _req$user2;
  const userId = (_req$user2 = req.user) === null || _req$user2 === void 0 ? void 0 : _req$user2.id;
  if (!userId) {
    throw new _ApiError.ApiError(404, "Please login first");
  }
  const allNotes = await _notesModel.Note.find({
    user: userId
  });
  if (allNotes.length <= 0) {
    throw new _ApiError.ApiError(404, "No Notes is available for you");
  }
  res.status(200).json(new _ApiResponse.ApiResponse(200, allNotes, "success"));
});
const updateNote = exports.updateNote = (0, _AsyncHandler.asyncHandler)(async (req, res) => {
  var _req$user3;
  const userId = (_req$user3 = req.user) === null || _req$user3 === void 0 ? void 0 : _req$user3.id;
  const {
    noteId
  } = req.params;
  const {
    content,
    title
  } = req.body;
  if (!userId) {
    throw new _ApiError.ApiError(404, "Please login first");
  }
  const existingNote = await _notesModel.Note.findById({
    _id: noteId,
    user: userId
  });
  if (!existingNote) {
    throw new _ApiError.ApiError(404, "Note is not present");
  }
  const updateNote = await _notesModel.Note.findByIdAndUpdate({
    _id: noteId,
    user: userId
  });
  updateNote.title = title ? title : updateNote.title;
  updateNote.content = content ? content : updateNote.content;
  updateNote.save({
    valiateBeforeSave: false,
    new: true
  });
  if (!updateNote) {
    throw new _ApiError.ApiError(400, "Something went wrong");
  }
  res.status(200).json(new _ApiResponse.ApiResponse(200, updateNote, "success"));
});
const getNote = exports.getNote = (0, _AsyncHandler.asyncHandler)(async (req, res) => {
  var _req$user4;
  const userId = (_req$user4 = req.user) === null || _req$user4 === void 0 ? void 0 : _req$user4.id;
  const {
    noteId
  } = req.params;
  if (!userId) {
    throw new _ApiError.ApiError(404, "Please login first");
  }
  let existingNote = null;
  try {
    existingNote = await _notesModel.Note.findById({
      _id: noteId,
      user: userId
    });
    console.log(existingNote);
  } catch (error) {
    console.error(error);
  }
  if (!existingNote) {
    throw new _ApiError.ApiError(404, "Requested Note is not present");
  }
  res.status(200).json(new _ApiResponse.ApiResponse(200, existingNote, "success"));
});
const deleteNote = exports.deleteNote = (0, _AsyncHandler.asyncHandler)(async (req, res) => {
  var _req$user5;
  const userId = (_req$user5 = req.user) === null || _req$user5 === void 0 ? void 0 : _req$user5.id;
  const {
    noteId
  } = req.params;
  if (!userId) {
    throw new _ApiError.ApiError(404, "Please login first");
  }
  const existingNote = await _notesModel.Note.findById({
    _id: noteId,
    user: userId
  });
  if (!existingNote) {
    throw new _ApiError.ApiError(404, "Note is not present");
  }
  await _notesModel.Note.findByIdAndDelete({
    _id: noteId
  });
  res.status(200).json(new _ApiResponse.ApiResponse(200, existingNote, "success"));
});