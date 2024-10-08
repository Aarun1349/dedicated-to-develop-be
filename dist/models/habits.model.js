"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Habit = void 0;
var _mongoose = require("mongoose");
var _mongooseAggregatePaginateV = _interopRequireDefault(require("mongoose-aggregate-paginate-v2"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
const habitSchema = new _mongoose.Schema({
  habit: {
    unique: true,
    required: true,
    type: String,
    index: true
  },
  state: {
    type: Boolean,
    default: true
  },
  why: {
    required: true,
    type: String
  },
  frequency: {
    type: Number,
    default: 0 // Represents daily frequency by default
  },
  alligned_to: {
    type: String
  },
  user: {
    required: true,
    type: _mongoose.Schema.Types.ObjectId,
    ref: "User"
  },
  startDate: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});
habitSchema.plugin(_mongooseAggregatePaginateV.default);
const Habit = exports.Habit = (0, _mongoose.model)("Habit", habitSchema);