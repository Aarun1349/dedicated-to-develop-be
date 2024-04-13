import { asyncHandler } from "../utils/AsyncHandler.js";
import { Suggestion } from "../models/suggestions.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const addNewSuggestion = asyncHandler(async (req, res) => {
  const userId = req.user?.id;
  const { suggestion } = req.body;
  if (!userId) {
    throw new ApiError(404, "Please login first");
  }
  if (!suggestion) {
    throw new ApiError(404, "suggestion text is requiredl");
  }

  const existingSuggestion = await Suggestion.findOne({
    suggestion,
  });
  if (existingSuggestion) {
    throw new ApiError(400, "Suggestion is already present");
  }
  const newSuggestion = await Suggestion.create({
    user: userId,
    suggestion,
  });
  if (!newSuggestion) {
    throw new ApiError(400, "Someting went wrong");
  }

  res.status(200).json(new ApiResponse(200, newSuggestion, "success"));
});

const getAllSuggestions = asyncHandler(async (req, res) => {
  const userId = req.user?.id;
  if (!userId) {
    throw new ApiError(404, "Please login first");
  }
  const allSuggestions = await Suggestion.find({ user: userId });
  if (getAllSuggestions.length <= 0) {
    throw new ApiError(404, "No Suggestion is available for you");
  }
  res.status(200).json(new ApiResponse(200, allSuggestions, "success"));
});

const updateSuggestion = asyncHandler(async (req, res) => {
  const userId = req.user?.id;
  const { suggestionId } = req.params;
  const { suggestion } = req.body;
  if (!userId) {
    throw new ApiError(404, "Please login first");
  }
  const existingSuggestion = await Suggestion.findById({
    _id: suggestionId,
    user: userId,
  });
  if (!existingSuggestion) {
    throw new ApiError(404, "Suggestion is not present");
  }

  const updateSuggestion = await Suggestion.findByIdAndUpdate({
    _id: suggestionId,
    user: userId,
    suggestion: suggestion,
  });
  updateSuggestion.suggestion=suggestion;
  updateSuggestion.save({valiateBeforeSave:false,new:true})
  if (!updateSuggestion) {
    throw new ApiError(400, "Something went wrong");
  }
  res.status(200).json(new ApiResponse(200, updateSuggestion, "success"));
});

const toggleImportant = asyncHandler(async (req, res) => {
  const userId = req.user?.id;
  const { suggestionId } = req.params;

  if (!userId) {
    throw new ApiError(404, "Please login first");
  }
  const existingSuggestion = await Suggestion.findByIdAndUpdate({
    _id: suggestionId,
    user: userId,
  });
  if (!existingSuggestion) {
    throw new ApiError(404, "Suggestion is not present");
  }
  const toggle = await Suggestion.findByIdAndUpdate({
    _id: suggestionId,
  });
  toggle.important = !toggle.important;
  await toggle.save({ valiateBeforeSave: false, new: true });
  res.status(200).json(new ApiResponse(200, toggle, "success"));
});

const getSuggestion = asyncHandler(async (req, res) => {
  const userId = req.user?.id;
  const { suggestionId } = req.params;
  if (!userId) {
    throw new ApiError(404, "Please login first");
  }
  let existingSuggestion = null;

  try {
    existingSuggestion = await Suggestion.findById({
      _id: suggestionId,
      user: userId,
    });
    console.log(existingSuggestion);
  } catch (error) {
    console.error(error);
  }
  if (!existingSuggestion) {
    throw new ApiError(404, "Suggestion is not present");
  }
  res.status(200).json(new ApiResponse(200, existingSuggestion, "success"));
});

const deleteSuggestion = asyncHandler(async (req, res) => {
  const userId = req.user?.id;
  const { suggestionId } = req.params;
  if (!userId) {
    throw new ApiError(404, "Please login first");
  }
  const existingSuggestion = await Suggestion.findById({
    _id: suggestionId,
    user: userId,
  });
  if (!existingSuggestion) {
    throw new ApiError(404, "Suggestion is not present");
  }
  await Suggestion.findByIdAndDelete({
    _id: suggestionId,
  });
  res.status(200).json(new ApiResponse(200, existingSuggestion, "success"));
});

export {
  addNewSuggestion,
  getAllSuggestions,
  getSuggestion,
  updateSuggestion,
  toggleImportant,
  deleteSuggestion,
};
