import { Schema, model } from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";
const suggsestionSchema = new Schema(
  {
    suggestion: {
      unique: true,
      required: true,
      type: String,
      index: true,
    },

    important: {
      type: Boolean,
      default: false,
    },
    user: {
      required: true,
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    dateField: { type: Date, default: Date.now },
  },
  { timestamps: true }
);
suggsestionSchema.plugin(mongooseAggregatePaginate);
const Suggestion = model("Suggestion", suggsestionSchema);
export { Suggestion };
