const Joi = require("joi");
const mongoose = require("mongoose");

const RentalModel = mongoose.model(
  "rental",
  new mongoose.Schema({
    movie: {
      type: new mongoose.Schema({
        title: {
          type: String,
          required: true,
          trim: true,
          minlength: 3,
          maxlength: 50,
        },
        dailyRentalRate: {
          type: Number,
          required: true,
          min: 0,
          max: 255,
        },
      }),
      required: true,
    },
    customer: {
      type: new mongoose.Schema({
        name: {
          type: String,
          required: true,
          minlength: 3,
          maxlength: 50,
        },
        isGold: { type: Boolean, required: true ,default : false },
        phone: { type: String, required: true, minlength: 10, maxlength: 10 },
      }),
      required: true,
    },
    rentalDate: {
      type: Date,
      required: true,
      default: Date.now,
    },
    dateReturned: {
      type: Date,
    },
    rentalFee: {
      type: Number,
      min: 0,
    },
  })
);

function validateRental(RentalModel) {
  const schema = Joi.object({
    customerId: Joi.string().required(),
    movieId: Joi.string().required(),
  });
  return schema.validate(RentalModel);
}

exports.RentalModel = RentalModel;
exports.validate = validateRental;
