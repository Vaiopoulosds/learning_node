const Joi = require("joi");
const mongoose = require("mongoose");
const {genreSchema} = require("./genre")

const MovieModel = mongoose.model(
  "movie",
  new mongoose.Schema({
    title: {
      type: String,
      required: true,
      trim: true,
      minlength: 3,
      maxlength: 50,
    },
    genre: {
      type: genreSchema,
      required:true
    },
    numberInStock:{
      type:Number,
      required: true, 
      min: 0,
      max:255
    },
    dailyRentalRate:{
      type:Number,
      required: true, 
      min: 0,
      max:255
    },
  })
);

function validateMovies(MovieModel) {
  const schema = Joi.object({
    title: Joi.string().min(3).max(50).required(),
    genreId: Joi.string().required(),
    numberInStock: Joi.number().min(0).required(),
    dailyRentalRate: Joi.number().min(0).required(),
  });
  return schema.validate(MovieModel);
}

exports.MovieModel = MovieModel;
exports.validate = validateMovies;
