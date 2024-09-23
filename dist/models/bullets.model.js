"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Bullet = void 0;
var _mongoose = require("mongoose");
var _mongooseAggregatePaginateV = _interopRequireDefault(require("mongoose-aggregate-paginate-v2"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
const bulletsSchema = new _mongoose.Schema({
  bullet: {
    unique: true,
    required: true,
    type: String,
    index: true
  },
  type: {
    type: String,
    enum: ["TASK", "EVENT", "MEETING", "HABBIT", "ERRAND", "WORK"],
    default: "TASK"
  },
  state: {
    type: String,
    enum: ["Pending", "ReScheduled", "Cancelled", "Completed", "Delegated"],
    default: "Pending"
  },
  priority: {
    type: String,
    enum: ["PRIORITY 1", "PRIORITY 2 ", "PRIORITY 3", "PRIORITY 4"],
    default: "PRIORITY 1"
  },
  alligned_to: {
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
bulletsSchema.plugin(_mongooseAggregatePaginateV.default);
const Bullet = exports.Bullet = (0, _mongoose.model)("Bullet", bulletsSchema);