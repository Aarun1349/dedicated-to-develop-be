import { Schema, model } from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";
const suggestionSchema = new Schema(
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
suggestionSchema.plugin(mongooseAggregatePaginate);
const Suggestion = model("Suggestion", suggestionSchema);
export { Suggestion };
