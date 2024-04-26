// Get all the published frontend and backend courses,
// sort them by their price in a descending order,
//pick only their name and author,
//and display them.

const mongoose = require("mongoose");

mongoose
  .connect("mongodb://localhost/mongo-exercises")
  .then(console.log("connected to mongo-exercises"))
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
  return await Course.find({ isPublished: true })
    .or([
      {
        tags: "frontend",
      },
      { tags: "backend" },
    ])
    .sort({ price: -1 })
    .select({ name: 1, author: 1 });
};

const run = async () => {
  const courses = await getCourses();
  console.log(courses);
};
run();
