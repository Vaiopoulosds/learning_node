const express = require("express");
const {CustomerModel, validate} = require("../models/customer")
const mongoose = require("mongoose");
const debug = require("debug")("app:debug-customer");
const router = express.Router();
require("dotenv").config();

router.get("/", async (req, res) => {
  const customer = await CustomerModel.find().sort("name");
  res.status(200).send(customer);
});

router.post("/", async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const customer = new CustomerModel({
    name: req.body.name,
    isGold: req.body.isGold,
    phone: req.body.phone,
  });

  const customerName = await CustomerModel.find({ name: req.body.name });
  if (customerName[0])
    return res.status(400).send(`${customerName[0].name} already exists!!`);

  try {
    const result = await customer.save();
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

  const customer = await CustomerModel.findOne({ name: req.params.name });
  if (!customer) return res.status(404).send(`Customer not found!`);

  customer.name = req.body.name;

  try {
    const result = await customer.save();
    res.status(200).send(result);
    debug(result);
  } catch (err) {
    res.status(400).send("Failed to save");
    debug(err.message);
  }
});

router.delete("/:name", async (req, res) => {
  const customer = await CustomerModel.findOne({ name: req.params.name });
  if (!customer) return res.status(404).send(`Customer not found!`);

  try {
    const deleted = await CustomerModel.deleteOne({ name: req.params.name });
    res.status(202).send(customer);
    debug(deleted, customer);
  } catch (err) {
    res.status(400).send("Failed to delete");
    debug(err.message);
  }
});

router.get("/:name", async (req, res) => {
  const customer = await CustomerModel.findOne({ name: req.params.name });
  if (!customer) return res.status(404).send(`Customer not found!`);

  res.status(200).send(customer);
});

module.exports = router;
