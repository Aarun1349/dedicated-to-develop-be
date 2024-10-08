"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.FutureLog = void 0;
var _mongoose = require("mongoose");
var _mongooseAggregatePaginateV = _interopRequireDefault(require("mongoose-aggregate-paginate-v2"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
const futureLogs = new _mongoose.Schema({
  aims: {
    unique: true,
    required: true,
    type: String,
    index: true
  },
  period: {
    type: String,
    enum: ["THIS YEAR", "NEXT 3 YEARS", "NEXT 5 YEARS", "NEXT 10 YEARS"],
    default: "THIS YEAR"
  },
  startYear: {
    type: String
  },
  endYear: {
    type: String
  },
  user: {
    required: true,
    type: _mongoose.Schema.Types.ObjectId,
    ref: "User"
  },
  dateField: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});
futureLogs.plugin(_mongooseAggregatePaginateV.default);
const FutureLog = exports.FutureLog = (0, _mongoose.model)("FutureLog", futureLogs);