// Get all the published backend courses,
// sort them by their name,
//pick only their name and author,
//and display them.

const mongoose = require("mongoose");

mongoose
  .connect("mongodb://localhost/mongo-exercises")
  .then(() => console.log("connected to mongo-exercises"))
  .catch((err) => console.log(err.message));

const courseSchema = new mongoose.Schema({
  name: String,
  tags: [String],
  date: { type: Date, default: Date.now },
  author: String,
  isPublished: Boolean,
  price: Number,
});

const Course = mongoose.model("Course", courseSchema);

const getCourses = async () => {
  return await Course.find({
    tags: "backend",
    isPublished: true,
  })
    .sort({ name: 1 })
    .select({ name: 1, author: 1 });
};

const run = async () => {
  const courses = await getCourses();
  console.log(courses);
};
run();
