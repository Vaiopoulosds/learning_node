const Joi = require("joi");
const mongoose = require("mongoose");

const CustomerModel = mongoose.model(
  "customer",
  new mongoose.Schema({
    name: {
      type: String,
      required: true,
      minlength: 3,
      maxlength: 50,
    },
    isGold: { type: Boolean, required: true },
    phone: { type: String, required: true, minlength: 10, maxlength: 10 },
  })
);

function validateCustomers(CustomerModel) {
  const schema = Joi.object({
    name: Joi.string().min(3).required(),
    isGold: Joi.boolean().required(),
    phone: Joi.string()
      .regex(/^[0-9]{10}$/)
      .messages({ "string.pattern.base": `Phone number must have 10 digits.` })
      .required(),
  });
  return schema.validate(CustomerModel);
}

exports.CustomerModel = CustomerModel
exports.validate = validateCustomers