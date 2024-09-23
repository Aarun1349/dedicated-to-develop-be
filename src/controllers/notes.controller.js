import { asyncHandler } from "../utils/AsyncHandler.js";
import { Note } from "../models/notes.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { mongoose } from "mongoose";
const addNewNote = asyncHandler(async (req, res) => {
  const userId = req.user?.id;
  const { content, title } = req.body;
  if (!userId) {
    throw new ApiError(404, "Please login first");
  }
  if (!content || !title) {
    throw new ApiError(404, "note title and content is required");
  }

  // const existingSuggestion = await Suggestion.findOne({
  //   suggestion,
  // });
  // if (existingSuggestion) {
  //   throw new ApiError(400, "Suggestion is already present");
  // }
  const newNote = await Note.create({
    user: userId,
    title,
    content,
  });
  console.log(newNote);
  if (!newNote) {
    throw new ApiError(400, "Someting went wrong");
  }

  res.status(200).json(new ApiResponse(200, newNote, "success"));
});

const getAllNotes = asyncHandler(async (req, res) => {
  const userId = req.user?.id;
  if (!userId) {
    throw new ApiError(404, "Please login first");
  }
  const allNotes = await Note.find({ user: userId }); 
  if (allNotes.length <= 0) {
    throw new ApiError(404, "No Notes is available for you");
  }
  res.status(200).json(new ApiResponse(200, allNotes, "success"));
});

const updateNote = asyncHandler(async (req, res) => {
  const userId = req.user?.id;
  const { noteId } = req.params;
  const { content, title } = req.body;
  if (!userId) {
    throw new ApiError(404, "Please login first");
  }
  const existingNote = await Note.findById({
    _id: noteId,
    user: userId,
  });
  if (!existingNote) {
    throw new ApiError(404, "Note is not present");
  }

  const updateNote = await Note.findByIdAndUpdate({
    _id: noteId,
    user: userId,
  });
  updateNote.title = title ? title : updateNote.title;
  updateNote.content = content ? content : updateNote.content;
  updateNote.save({ valiateBeforeSave: false, new: true });
  if (!updateNote) {
    throw new ApiError(400, "Something went wrong");
  }
  res.status(200).json(new ApiResponse(200, updateNote, "success"));
});

const getNote = asyncHandler(async (req, res) => {
  const userId = req.user?.id;
  const { noteId } = req.params;
  if (!userId) {
    throw new ApiError(404, "Please login first");
  }
  let existingNote = null;

  try {
    existingNote = await Note.findById({
      _id: noteId,
      user: userId,
    });
    console.log(existingNote);
  } catch (error) {
    console.error(error);
  }
  if (!existingNote) {
    throw new ApiError(404, "Requested Note is not present");
  }
  res.status(200).json(new ApiResponse(200, existingNote, "success"));
});

const deleteNote = asyncHandler(async (req, res) => {
  const userId = req.user?.id;
  console.log('parameter___',req.params)
  const { noteId } = req.params;
  if (!userId) {
    throw new ApiError(404, "Please login first");
  }
  if (!mongoose.Types.ObjectId.isValid(noteId)) {
    throw new ApiError(400, "Invalid note ID");
  }
  const existingNote = await Note.findOne({
    _id: noteId,
    user: userId,
  });
  if (!existingNote) {
    throw new ApiError(404, "Note is not present");
  }
  await Note.findByIdAndDelete({
    _id: noteId,
  });
  res.status(200).json(new ApiResponse(200, existingNote, "success"));
});

export { addNewNote, updateNote, deleteNote, getAllNotes, getNote };
