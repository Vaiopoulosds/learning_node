const mongoose = require("mongoose");

mongoose
  .connect("mongodb://localhost/playground4")
  .then(() => console.log("Connected to MongoDB..."))
  .catch((err) => console.error("Could not connect to MongoDB...", err));

const authorSchema = new mongoose.Schema({
  name: String,
  bio: String,
  website: String,
});

const Author = mongoose.model("Author", authorSchema);

const Course = mongoose.model(
  "Course",
  new mongoose.Schema({
    name: String,

    // Array of sub-documents

    authors: [authorSchema],
  })
);

async function createCourse(name, authors) {
  const course = new Course({
    name,
    authors,
  });

  const result = await course.save();
  console.log(result);
}

async function listCourses() {
  const courses = await Course.find();
  console.log(courses);
}

//Adding a new author at the array

// async function addAuthor(courseId, author) {
//   const course = await Course.findById(courseId);
//   course.authors.push(author);
//   course.save();
// }

// addAuthor("662b77fe30cdbf4d30849bab", new Author({ name: "Amy" }));

//Removing an author

async function removeAuthor(courseId, authorId) {
  const course = await Course.findById(courseId);
  const author = course.authors.find(({_id}) => _id == authorId)
  const index = course.authors.indexOf(author)
  course.authors.splice(index,1)
  course.save();
}

removeAuthor("662b77fe30cdbf4d30849bab", "662b789a7e1cf2fa348143f3")

//creating a course with 2 authors (array)

// createCourse('Node Course', [
//   new Author({name:'Mosh'}),
//   new Author({name:'Stavros'})
// ]);
