const mongoose = require("mongoose");
const { Schema } = mongoose;
const { format } = require("date-fns");

const messageSchema = new Schema({
  title: {
    type: String,
    required: true,
    trim: true,
    minlength: 3,
    maxlength: 24,
  },
  timestamp: {
    type: Date,
    default: new Date(),
  },
  body: {
    type: String,
    required: true,
    trim: true,
    minlength: 1,
    maxlength: 500,
  },
  author: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
});

messageSchema.virtual("url").get(function () {
  return `/message/${this._id}`;
});

messageSchema.virtual("date").get(function () {
  return format(this.timestamp, "H:mmbb, dd/MM/yyyy");
});

module.exports = mongoose.model("Message", messageSchema);
