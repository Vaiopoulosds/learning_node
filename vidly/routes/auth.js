const express = require("express");
const bcrypt = require("bcrypt");
const { UserModel } = require("../models/user");
const Joi = require("joi");
const debug = require("debug")("app:debug-auth");
const router = express.Router();
require("dotenv").config();

router.post("/", async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let user = await UserModel.findOne({ email: req.body.email });
  if (!user) return res.status(400).send("Invalid email or password.");

  const validPassword = await bcrypt.compare(req.body.password, user.password);
  if (!validPassword) return res.status(400).send("Invalid email or password.");

  const token = user.generateAuthToken();
  debug(token)
  res.send(token);
});

function validate(req) {
  const schema = Joi.object({
    email: Joi.string().required().min(3).max(255).email(),
    password: Joi.string().required().min(3).max(255),
  });
  return schema.validate(req.body);
}

module.exports = router;
