const Joi = require("joi");
const mongoose = require("mongoose");

const genreSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 3,
    maxlength: 50,
  },
});

const GenreModel = mongoose.model("genre", genreSchema);

function validateGenres(genreModel) {
  const schema = Joi.object({
    name: Joi.string().min(3).required(),
  });
  return schema.validate(genreModel);
}

exports.genreSchema = genreSchema;
exports.GenreModel = GenreModel;
exports.validate = validateGenres;
