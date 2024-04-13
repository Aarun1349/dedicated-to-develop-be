import { Schema, model } from "mongoose";


// Define the schema for the habit entry
const habitEntrySchema = new Schema({
  habit: {
    type: Schema.Types.ObjectId,
    ref: "Habit",
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  date: {
    type: Date,
  },
  completed: {
    type: Boolean,
    default: false,
  },
  
});

// Define the model for the Habit Entry
const HabitEntry = model("HabitEntry", habitEntrySchema);

export { HabitEntry };
