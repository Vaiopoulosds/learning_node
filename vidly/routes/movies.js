const express = require("express");
const { MovieModel, validate } = require("../models/movie");
const { GenreModel } = require("../models/genre");
const debug = require("debug")("app:debug-movies");
const router = express.Router();
require("dotenv").config();

router.get("/", async (req, res) => {
  const movies = await MovieModel.find().sort("title");
  res.status(200).send(movies);
});

router.post("/", async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const genre = await GenreModel.findById(req.body.genreId);
  if (!genre) return res.status(400).send("Invalid genre.");

  const movieTitle = await MovieModel.find({ title: req.body.title });
  if (movieTitle[0])
    return res.status(400).send(`${movieTitle[0].title} already exists!!`);

  const movie = new MovieModel({
    title: req.body.title,
    genre: {
      _id: genre._id,
      name: genre.name,
    },
    numberInStock: req.body.numberInStock,
    dailyRentalRate: req.body.dailyRentalRate,
  });

  try {
    const result = await movie.save();
    debug(result);
    res.status(201).send(result);
  } catch (err) {
    res.status(400).send("Failed to save");
    debug(err.message);
  }
});

router.put("/:title", async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const genre = await GenreModel.findById(req.body.genreId)
  if (!genre) return res.status(400).send("Invalid genre.");

  const movie = await MovieModel.findOne({ title: req.params.title });
  if (!movie) return res.status(404).send(`Movie not found!`);

  movie.title = req.body.title;
  movie.genre._id = genre._id;
  movie.genre.name = genre.name;
  movie.numberInStock = req.body.numberInStock;
  movie.dailyRentalRate = req.body.dailyRentalRate;

  try {
    const result = await movie.save();
    res.status(200).send(result);
    debug(result);
  } catch (err) {
    res.status(400).send("Failed to save");
    debug(err.message);
  }
});

router.delete("/:title", async (req, res) => {
  const movie = await MovieModel.findOne({ title: req.params.title });
  if (!movie) return res.status(404).send(`Movie not found!`);

  try {
    const deleted = await MovieModel.deleteOne({ title: req.params.title });
    res.status(202).send(movie);
    debug(deleted, movie);
  } catch (err) {
    res.status(400).send("Failed to delete");
    debug(err.message);
  }
});

router.get("/:title", async (req, res) => {
  const movie = await MovieModel.findOne({ title: req.params.title });
  if (!movie) return res.status(404).send(`Movie not found!`);

  res.status(200).send(movie);
});

module.exports = router;
