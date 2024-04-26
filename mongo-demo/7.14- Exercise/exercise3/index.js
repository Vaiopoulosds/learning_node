//Get all the published courses that are $15 or more,
// or have the word 'by' in their title.

const mongoose = require("mongoose");

mongoose
  .connect("mongodb://localhost/mongo-exercises")
  .then(console.log("connected to the mong db."))
  .catch((err) => console.log(err.message));

const courseSchema = new mongoose.Schema({
  name: String,
  author: String,
  tags: [String],
  price: Number,
  date: { type: Date, default: Date.now },
  isPublished: Boolean,
});

const Course = mongoose.model("Course", courseSchema);

const getCourses = async () => {
  return await Course.find({ isPublished: true }).or([
    { price: { $gte: 15 } },
    { name: /.*by*./i },
  ]);
};

const run = async () => {
  const courses = await getCourses();
  console.log(courses);
};

run();
