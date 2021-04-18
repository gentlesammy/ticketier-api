const { Schema, model } = require("mongoose");

const userSchema = new Schema({
  name: {
    type: String,
    required: true,
    maxlength: 50,
  },
  company: {
    type: String,
    required: true,
    maxlength: 50,
  },
  address: {
    type: String,
    maxlength: 100,
  },
  phone: {
    type: Number,
    maxlength: 13,
  },
  email: {
    type: String,
    required: true,
    maxlength: 50,
  },
  password: {
    type: String,
    minlength: 8,
    required: true,
    maxlength: 50,
  },

  userip: {
    type: String,
    maxlength: 50,
  },
});

module.exports = model("User", userSchema);
