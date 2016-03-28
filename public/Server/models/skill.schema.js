module.exports = function (mongoose) {
    var skillSchema = new mongoose.Schema({
        skill: String,
        assessment: String
    },{collection: "skill"});
    return skillSchema;
};