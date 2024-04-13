import { asyncHandler } from "../utils/AsyncHandler.js";
import { Habit } from "../models/habits.model.js";
import { HabitEntry } from "../models/habitEntry.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const addNewHabit = asyncHandler(async (req, res) => {
  const userId = req.user?.id;
  const { habit, why } = req.body;
  if (!userId) {
    throw new ApiError(404, "Please login first");
  }
  if (!habit || !why) {
    throw new ApiError(400, "Habit and why is required");
  }
  const existingHabit = await Habit.findOne({
    habit: habit,
    user: userId,
  });
  if (existingHabit) {
    throw new ApiError(400, "Habit is already present");
  }
  const newHabit = await Habit.create({
    habit: habit,
    user: userId,
    why,
  });
  res.status(200).json(new ApiResponse(200, newHabit, "success"));
});

const togglePause = asyncHandler(async (req, res) => {
  const userId = req.user?.id;
  const { habitId } = req.params;
  if (!userId) {
    throw new ApiError(404, "Please login first");
  }
  const checkHabit = await Habit.findById({
    habit: habitId,
    user: userId,
  });
  console.log(checkHabit);
  if (!checkHabit) {
    throw new ApiError(400, "habit not found");
  }
  const togglePause = await Habit.findOneAndUpdate({
    habit: habitId,
    user: userId,
  });
  togglePause.state = !togglePause.state;

  await togglePause.save({ validateBeforeSave: false, new: true });
  res.status(200).json(new ApiResponse(200, togglePause, "success"));
});

const getAllHabits = asyncHandler(async (req, res) => {
  const userId = req.user?.id;
  if (!userId) {
    throw new ApiError(404, "Please login first");
  }
  const allhabits = await Habit.find({
    user: userId,
  });
  if (allhabits.length <= 0) {
    throw new ApiError(404, "No habit found");
  }
  res
    .status(200)
    .json(
      new ApiResponse(200, { count: allhabits.length, allhabits }, "success")
    );
});

const getHabit = asyncHandler(async (req, res) => {
  const userId = req.user?.id;
  const { habitId } = req.params;
  if (!userId) {
    throw new ApiError(404, "Please login first");
  }
  const habit = await Habit.findById({
    _id: habitId,
    user: userId,
  });
  if (!habit) {
    throw new ApiError(404, "No habit found");
  }
  res.status(200).json(new ApiResponse(200, habit, "success"));
});

const trackHabits = asyncHandler(async (req, res) => {
  const userId = req.user?.id;
  if (!userId) {
    throw new ApiError(404, "Please login first");
  }
});

const deleteHabit = asyncHandler(async (req, res) => {
  const userId = req.user?.id;
  const { habitId } = req.params;
  if (!userId) {
    throw new ApiError(404, "Please login first");
  }
  const habit = await Habit.findByIdAndDelete({
    _id: habitId,
    user: userId,
  });
  if (!habit) {
    throw new ApiError(404, "No habit found");
  }
  res.status(200).json(new ApiResponse(200, habit, "success"));
});

const updateHabit = asyncHandler(async (req, res) => {
  const userId = req.user?.id;
  const { habitId } = req.params;
  const { habit, why } = req.body;
  if (!userId) {
    throw new ApiError(404, "Please login first");
  }
  if (!habit || !why) {
    throw new ApiError(400, "Habit and why is required");
  }
  const updateHabit = await Habit.findByIdAndUpdate({
    _id: habitId,
    user: userId,
  });
  if (!updateHabit) {
    throw new ApiError(404, "No habit found");
  }
  updateHabit.habit = habit;
  updateHabit.why = why;
  await updateHabit.save({ validateBefore: false, new: true });
  res.status(200).json(new ApiResponse(200, updateHabit, "success"));
});

const toggleComplete = asyncHandler(async (req, res) => {
  const userId = req.user?.id;
  const { calendarDate } = req.body;
  const { habitId } = req.params;

  if (!userId) {
    throw new ApiError(404, "Please login first");
  }
  const checkHabit = await HabitEntry.findOne({
    habit: habitId,
    date: calendarDate,
    user: userId,
    completed: true,
  });
  if (checkHabit) {
    throw new ApiError(400, "habit is already marked for completion");
  }
  const toggleComplete = await HabitEntry.create({
    habit: habitId,
    date: calendarDate,
    user: userId,
    completed: true,
  });
  const incrementFrequency = await Habit.findByIdAndUpdate({
    user:userId,
    _id:habitId
  })

  incrementFrequency.frequency = incrementFrequency.frequency +1;
  await incrementFrequency.save({ validateBeforeSave: false, new: true });
  console.log("__________", toggleComplete,incrementFrequency);

  //   await toggleComplete.save({ validateBeforeSave: false, new: true });
  res.status(200).json(new ApiResponse(200, toggleComplete, "success"));
});

export {
  addNewHabit,
  togglePause,
  getAllHabits,
  trackHabits,
  deleteHabit,
  updateHabit,
  getHabit,
  toggleComplete,
};
