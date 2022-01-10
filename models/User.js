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
    maxlength: 60,
  },
  password: {
    type: String,
    required: true,
    minlength: 12,
  },
  memberStatus: {
    required: true,
    type: Boolean,
    default: false,
  },
  messages: [
    {
      type: Schema.Types.ObjectId,
      ref: "Message",
    },
  ],
});

userSchema.virtual("url").get(function () {
  return `/user/${this._id}`;
});

userSchema.virtual("fullName").get(function () {
  return this.firstName + this.lastName;
});

module.exports = mongoose.model("User", userSchema);
