import { Schema, model } from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";
const habitSchema = new Schema(
  {
    habit: {
      unique: true,
      required: true,
      type: String,
      index: true,
    },
    state: {
      type: Boolean,
      default: true,
    },
    why: {
      required: true,
      type: String,
    },
    frequency: {
      type: Number,
      default: 0, // Represents daily frequency by default
    },
    alligned_to: {
      type: String,
    },
    user: {
      required: true,
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    startDate: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);
habitSchema.plugin(mongooseAggregatePaginate);
const Habit = model("Habit", habitSchema);
export { Habit };
