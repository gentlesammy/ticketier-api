const { Schema, model } = require("mongoose");

const PasswordResetSchema = new Schema({
  email: {
    type: String,
    required: true,
    maxlength: 50,
  },
  pin : {
    type: Number,
    maxlength: 6,
    minlength : 6,
  },
  userip: {
    type: String,
    maxlength: 50,
  },
  addedAt: {
    type: Date,
    required: true,
    default: Date.now(),
  }
});

module.exports = model("PasswordReset", PasswordResetSchema);
