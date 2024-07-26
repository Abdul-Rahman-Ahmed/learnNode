const mongoose = require("mongoose");
const validator = require("validator");

const usersControllers = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    validate: [validator.isEmail, "filed must be a vaild email address"],
  },
  password: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("Users", usersControllers);
