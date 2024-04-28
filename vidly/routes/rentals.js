const express = require("express");
const { MongoClient } = require("mongodb");
const { RentalModel, validate } = require("../models/rental");
const { CustomerModel } = require("../models/customer");
const { MovieModel } = require("../models/movie");
const mongoose = require("mongoose");
const debug = require("debug")("app:debug-rentals");
const router = express.Router();
require("dotenv").config();

const uri = "mongodb://localhost/vidly";

const client = new MongoClient(uri);

router.get("/", async (req, res) => {
  const rentals = await RentalModel.find().sort("-rentalDate");
  res.status(200).send(rentals);
});

router.post("/", async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const movie = await MovieModel.findById(req.body.movieId);
  if (!movie) return res.status(400).send("Invalid movie.");

  const customer = await CustomerModel.findById(req.body.customerId);
  if (!customer) return res.status(400).send("Invalid customer.");

  if (movie.numberInStock === 0)
    return res.status(400).send("Movie not in stock.");

  const rental = new RentalModel({
    movie: {
      _id: movie._id,
      title: movie.title,
      dailyRentalRate: movie.dailyRentalRate,
    },
    customer: {
      _id: customer._id,
      name: customer.name,
      phone: customer.phone,
    },
  });

  const session = client.startSession();

  try {
    await session.withTransaction(async () => {
      const result = await rental.save();

      movie.numberInStock--;
      movie.save();

      debug(result);
      res.status(201).send(result);
    });
  } catch (err) {
    res.status(400).send("Failed to save");
    debug(err.message);
  }
});

module.exports = router;
