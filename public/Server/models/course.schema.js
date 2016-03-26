model.exports = function (mongoose) {
    var coursesSchema = new mongoose.Schema({
        course_id : String,
        name: String,
        modules:[]
    },{collection: "courses"});

    return courseSchema;
}();