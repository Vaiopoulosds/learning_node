const Joi = require("joi");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    minlength: 3,
    maxlength: 255,
    required: true,
  },
  email: {
    type: String,
    unique: true,
    required: true,
    minlength: 3,
    maxlength: 255,
  },
  password: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 1024,
  },
});

userSchema.methods.generateAuthToken = function () {
  const token = jwt.sign({ _id: this._id }, process.env.JWT_PRIVATE_KEY);
  return token;
};

const UserModel = mongoose.model("user", userSchema);

function validateUser(UserModel) {
  const schema = Joi.object({
    name: Joi.string().required().min(3).max(255),
    email: Joi.string().required().min(3).max(255).email(),
    password: Joi.string().required().min(3).max(255),
  });
  return schema.validate(UserModel);
}

exports.UserModel = UserModel;
exports.validate = validateUser;
