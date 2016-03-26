module.exports = function(mongoose){
  var learningOutcomeSchema = new mongoose.Schema({
        name: String,
        skills:[]
    },{collection: "learning_outcome"});
    return learningOutcomeSchema;
};