const startupDebugger = require("debug")("app:startup");
const dbDebugger = require("debug")("app:db");
const morgan = require("morgan");
const config = require("config");
const helmet = require("helmet");
const Joi = require("joi");
const logger = require("./middleware/logger");
const authenticate = require("./middleware/authentication");
const express = require("express");
const courses = require("./routes/courses");
const home = require("./routes/home");
require("dotenv").config();

const app = express();

app.set("view engine", "pug");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(logger);
app.use(authenticate);
app.use(express.static("public"));
app.use(helmet());
app.use("/api/courses", courses);
app.use("/", home);

if (app.get("env") === "development") {
  app.use(morgan("tiny"));
  startupDebugger("Morgan enabled...");
}

const port = config.get("port") || 3001;
app.listen(port, () => {
  console.log(`listening on port ${port}...`);
});
