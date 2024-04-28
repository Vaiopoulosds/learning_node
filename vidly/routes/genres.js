const express = require("express");
const { GenreModel, validate } = require("../models/genre");
const debug = require("debug")("app:debug-genre");
const router = express.Router();
require("dotenv").config();

router.get("/", async (req, res) => {
  const genres = await GenreModel.find().sort("name");
  res.status(200).send(genres);
});

router.post("/", async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const genre = new GenreModel({
    name: req.body.name,
  });

  const genreName = await GenreModel.find({ name: req.body.name });
  if (genreName[0])
    return res.status(400).send(`${genreName[0].name} already exists!!`);

  try {
    const result = await genre.save();
    debug(result);
    res.status(201).send(result);
  } catch (err) {
    res.status(400).send("Failed to save");
    debug(err.message);
  }
});

router.put("/:name", async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const genre = await GenreModel.findOne({ name: req.params.name });
  if (!genre) return res.status(404).send(`Genre not found!`);

  genre.name = req.body.name;

  try {
    const result = await genre.save();
    res.status(200).send(result);
    debug(result);
  } catch (err) {
    res.status(400).send("Failed to save");
    debug(err.message);
  }
});

router.delete("/:name", async (req, res) => {
  const genre = await GenreModel.findOne({ name: req.params.name });
  if (!genre) return res.status(404).send(`Genre not found!`);

  try {
    const deleted = await GenreModel.deleteOne({ name: req.params.name });
    res.status(202).send(genre);
    debug(deleted, genre);
  } catch (err) {
    res.status(400).send("Failed to delete");
    debug(err.message);
  }
});

router.get("/:name", async (req, res) => {
  const genre = await GenreModel.findOne({ name: req.params.name });
  if (!genre) return res.status(404).send(`Genre not found!`);

  res.status(200).send(genre);
});

module.exports = router;
