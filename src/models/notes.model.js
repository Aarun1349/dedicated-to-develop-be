import { Schema, model } from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";
const notesSchema = new Schema(
  {
      title: {
          unique: true,
          required: true,
          type: String,
          index: true,
        },
        content: {
            unique: true,
            required: true,
            type: String,
            lowercase: true,
            trim: true,
        },
        user: {
          required: true,
          type: Schema.Types.ObjectId,
          ref: "User",
        },
        dateField: { type: Date, default: Date.now }
  },
  { timestamps: true }
);
notesSchema.plugin(mongooseAggregatePaginate);
const Note = model("Note", notesSchema);
export { Note };
