const mongoose = require("mongoose");
const { Schema } = mongoose;

const userSchema = new Schema({
  firstName: {
    type: String,
    required: true,
    trim: true,
    minlength: 3,
    maxlength: 24,
  },
  lastName: {
    type: String,
    required: true,
    trim: true,
    minlength: 3,
    maxlength: 24,
  },
  userName: {
    type: String,
    required: true,
    trim: true,
    minlength: 7,
    maxlength: 40,
  },
  password: {
    type: String,
    required: true,
    minlength: 12,
    maxlength: 50,
  },
  memberStatus: {
    type: Boolean,
    default: false,
  },
});

userSchema.virtual("url").get(function () {
  return `/user/${this._id}`;
});

module.exports = mongoose.model("User", userSchema);
