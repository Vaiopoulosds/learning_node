const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/playground3')
  .then(() => console.log('Connected to MongoDB...'))
  .catch(err => console.error('Could not connect to MongoDB...', err));

const authorSchema = new mongoose.Schema({
  name: String,
  bio: String,
  website: String
});

const Author = mongoose.model('Author', authorSchema);

const Course = mongoose.model('Course', new mongoose.Schema({
  name: String,
  author: authorSchema

  //if you want a sub-document to be required 
  // author: {
  //   type:authorSchema,
  //   required:true
  // }
}));

async function createCourse(name, author) {
  const course = new Course({
    name, 
    author
  }); 
  
  const result = await course.save();
  console.log(result);
}

async function listCourses() { 
  const courses = await Course.find();
  console.log(courses);
}

async function updateAuthor(courseId) {
  //query and update sub-document
  // const course = await Course.findById(courseId)
  // course.author.name = 'Mosh Hamedani'
  // course.save()

  //without query update sub-document
  // const course = await Course.updateOne({_id:courseId},{
  //   $set:{
  //     'author.name':'John Smith'
  //   }
  // })

  //removing a sub-document
  const course = await Course.updateOne({_id:courseId},{
    $unset:{
      'author':''
    }
  })
}
// createCourse('Node Course', new Author({ name: 'Mosh' }));
updateAuthor('662b749f92bba499ace95b48')