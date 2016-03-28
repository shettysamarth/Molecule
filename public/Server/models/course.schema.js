module.exports = function (mongoose) {
    var courseSchema = new mongoose.Schema({
        course_id : String,
        name: String,
        modules:[]
    },{collection: "courses"});

    return courseSchema;
};