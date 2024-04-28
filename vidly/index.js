const express = require("express");
const morgan = require("morgan");
const morganDebugger = require("debug")("app:morgan");
const genres = require("./routes/genres");
const customers = require("./routes/customers");
const movies = require("./routes/movies");
const rentals = require("./routes/rentals");
const portDebugger = require("debug")("app:port");
const dbDebugger = require("debug")("app:db");
const mongoose = require("mongoose");
require("dotenv").config();
const app = express();

if (process.env.ENV === "development") {
  app.use(morgan("dev"));
  morganDebugger("Morgan started ...");
}

mongoose
  .connect("mongodb://localhost/vidly")
  .then(dbDebugger("Connected to MongoDB"))
  .catch((err) => console.error("Could not connect to MongoDB .. ", err));

app.use(express.json());
app.use("/api/genres", genres);
app.use("/api/customers", customers);
app.use("/api/movies", movies);
app.use("/api/rentals", rentals);

const port = process.env.PORT || 3001;
app.listen(port, () => {
  portDebugger(`listening on port ${port}`);
});
