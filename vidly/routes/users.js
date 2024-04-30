const express = require("express");
const bcrypt = require('bcrypt');
const passwordComplexity = require("joi-password-complexity");
const { UserModel, validate } = require("../models/user");
const debug = require("debug")("app:debug-users");
const router = express.Router();
require("dotenv").config();

router.get("/", async (req, res) => {
  const users = await UserModel.find().sort("name");
  res.status(200).send(users);
});

router.post("/", async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const psError = passwordComplexity(undefined,'password').validate(req.body.password).error;
  if (psError) return res.status(400).send(psError.details[0].message);

  let user = await UserModel.findOne({ email: req.body.email });

  if (user) return res.status(400).send("User already registered.");

  user = new UserModel({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
  });
  const salt = await bcrypt.genSalt(10)
  user.password = await bcrypt.hash(user.password,salt)

  try {
    const result = await user.save();
    const token = user.generateAuthToken();
    debug(result);
    res.header('x-auth-token', token).status(201).send({ name: req.body.name, email: req.body.email })
  } catch (err) {
    res.status(400).send("Failed to save");
    debug(err.message);
  }
});

module.exports = router;
