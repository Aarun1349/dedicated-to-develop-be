import { Schema, model } from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";
const futureLogs = new Schema(
  {
      aims: {
          unique: true,
          required: true,
          type: String,
          index: true,
        },
        period: {
            type: String,
            enum : ["THIS YEAR","NEXT 3 YEARS","NEXT 5 YEARS","NEXT 10 YEARS"],
            default:"THIS YEAR"
           
        },
        startYear:{
            type: String,
        },
        endYear:{
            type: String,
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
futureLogs.plugin(mongooseAggregatePaginate);
const FutureLog = model("FutureLog", futureLogs);
export { FutureLog };
