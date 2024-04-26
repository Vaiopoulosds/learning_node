const mongoose = require("mongoose");

mongoose
  .connect("mongodb://localhost/playground")
  .then(() => console.log("Connected to MongoDB.."))
  .catch((err) => console.error("Could not connect to MongoDB..", err));

const courseSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 255,
    //match : /pattern/
  },
  category: {
    type: String,
    required: true,
    enum: ["web", "mobile", "network"],
    lowercase: true,
    // uppercase:true,
    trim: true,
  },
  author: String,
  tags: {
    type: Array,
    validate: {
      //async custom validator
      validator: async function (v) {
        return new Promise((resolve, reject) => {
          setTimeout(() => {
            //Do some async work
            const result = v && v.length > 0;
            //and resolve
            resolve(result);
          }, 1000);
        });
      },
      message: "A course should have at least 1 tag.",
    },
  },
  date: { type: Date, default: Date.now },
  isPublished: Boolean,
  price: {
    type: Number,
    required: function () {
      return this.isPublished;
    },
    min: 10,
    max: 200,
    //rounding a number with custom setter and getter
    //get is called when we read the value from db
    get: (v) => Math.round(v),
    //set is called when we store the value
    set: (v) => Math.round(v),
  },
});

const Course = mongoose.model("Course", courseSchema);

const createCourse = async () => {
  const course = new Course({
    name: "React Course",
    category: "Web",
    author: "Mosh",
    tags: ["react", "frontend"],
    // tags: [],
    // tags: null,
    isPublished: true,
    price: 16.8,
  });

  try {
    // course.validate( (err) =>{
    //   if (err) {}
    // })
    const result = await course.save();
    console.log(result);
  } catch (err) {
    //error messages for each error separately
    for (field in err.errors) console.log(err.errors[field].message);
  }
};

const getCourses = async () => {
  //eq (equal)
  //ne(not equal)
  //gt (greater than)
  //gte (greater than or equal to )
  //lt (less than)
  //lte (less than or equal to )
  //in
  //nin (not in )

  //or
  //and
  // const pageNumber = 2;
  // const pageSize = 10;

  const courses = await Course.find({ _id: "662ac2dfc44ad5d44ee7d13e"})
    // .find({ price: { $gte: 10, $lte: 20 } })
    // .find({ price: { $in: [10, 15, 20] } })
    // .find()
    // .or([{author:'Mosh'}, {isPublished:true}])
    // .and([{author:'Mosh'}, {isPublished:true}])

    // Starts with Mosh
    // .find({ author: /^Mosh/ })/

    //Ends with Hamedani
    // .find({ author: /Hamedani$/i })

    //Contains Mosh
    // .find({ author: /.*Mosh.*/i })
    // .skip((pageNumber - 1) * pageSize)
    // .limit(pageSize)
    .sort({ name: 1 })
    // .select({ name: 1, tags: 1 });
    // .count();
  console.log(courses[0].price);
};

//update with find first

// const updateCourse = async (id)=>{
//   const course = await Course.findById(id);
//   if(!course) return
//   course.isPublished=true;
//   course.author = 'Another author'
//   // course.set({
//   //   isPublished:true,
//   //   author: "another Author"
//   // })
//   const result = await course.save()
//   console.log(result)
// }

//Update first

//mongo db update operators
// const updateCourse = async (id) =>{
//   const result = await Course.findOneAndUpdate({_id:id}, {
//     $set: {
//       author:'Mosh',
//       isPublished:false
//     }
//   })
//   console.log(result)
// }
//OR
const updateCourse = async (id) => {
  const result = await Course.findByIdAndUpdate(
    id,
    {
      $set: {
        author: "Jason",
        isPublished: false,
      },
    },
    { new: true }
  );
  console.log(result);
};

const removeCourse = async (id) => {
  // const result = await Course.deleteOne({_id:id})

  // retrieve the doc when removing
  const course = await Course.findByIdAndDelete(id);
  console.log(course);
};

// removeCourse('662a1b5adb80989d047d3c6a');
getCourses();
