"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.HabitEntry = void 0;
var _mongoose = require("mongoose");
// Define the schema for the habit entry
const habitEntrySchema = new _mongoose.Schema({
  habit: {
    type: _mongoose.Schema.Types.ObjectId,
    ref: "Habit"
  },
  user: {
    type: _mongoose.Schema.Types.ObjectId,
    ref: "User"
  },
  date: {
    type: Date
  },
  completed: {
    type: Boolean,
    default: false
  }
});

// Define the model for the Habit Entry
const HabitEntry = exports.HabitEntry = (0, _mongoose.model)("HabitEntry", habitEntrySchema);