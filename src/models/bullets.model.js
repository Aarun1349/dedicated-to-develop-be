import { Schema, model } from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";
const bulletsSchema = new Schema(
  {
    bullet: {
      unique: true,
      required: true,
      type: String,
      index: true,
    },
    type: {
      type: String,
      enum: ["TASK", "EVENT", "MEETING", "HABBIT", "ERRAND", "WORK"],
      default: "TASK",
    },
    state:{
        type:String,
        enum:["Pending","ReScheduled","Cancelled","Completed","Delegated"],
        default:"Pending"
    },
    priority: {
      type: String,
      enum: ["PRIORITY 1", "PRIORITY 2 ", "PRIORITY 3", "PRIORITY 4"],
      default: "PRIORITY 1",
    },
    alligned_to: {
      type: String,
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
bulletsSchema.plugin(mongooseAggregatePaginate);
const Bullet = model("Bullet", bulletsSchema);
export { Bullet };
