module.exports = function(mongoose){
    var courseOutcomeSchema = new mongoose.Schema({
        outcome: String,
        learning_outcome_id:[]
    },{collection: "course_outcome"});
    return courseOutcomeSchema;
};