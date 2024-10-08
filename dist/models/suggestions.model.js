"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Suggestion = void 0;
var _mongoose = require("mongoose");
var _mongooseAggregatePaginateV = _interopRequireDefault(require("mongoose-aggregate-paginate-v2"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
const suggestionSchema = new _mongoose.Schema({
  suggestion: {
    unique: true,
    required: true,
    type: String,
    index: true
  },
  important: {
    type: Boolean,
    default: false
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
suggestionSchema.plugin(_mongooseAggregatePaginateV.default);
const Suggestion = exports.Suggestion = (0, _mongoose.model)("Suggestion", suggestionSchema);