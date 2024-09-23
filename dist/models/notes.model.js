"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Note = void 0;
var _mongoose = require("mongoose");
var _mongooseAggregatePaginateV = _interopRequireDefault(require("mongoose-aggregate-paginate-v2"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
const notesSchema = new _mongoose.Schema({
  title: {
    unique: true,
    required: true,
    type: String,
    index: true
  },
  content: {
    unique: true,
    required: true,
    type: String,
    lowercase: true,
    trim: true
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
notesSchema.plugin(_mongooseAggregatePaginateV.default);
const Note = exports.Note = (0, _mongoose.model)("Note", notesSchema);