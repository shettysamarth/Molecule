module.exports = function (mongoose) {
    var moduleSchema = new mongoose.Schema({
        name : String,
        link: String,
        courseOutcomeIds:[],
        learningOutcomeIds:[]
    },{collection: "module"});

    return moduleSchema;
}