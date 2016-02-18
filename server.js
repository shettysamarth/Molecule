var express = require('express');
var app = express();

var mongoose = require('mongoose');

var  url = 'mongodb://localhost/molecule';
     if (process.env.OPENSHIFT_MONGODB_DB_URL)
     {
         url = process.env.OPENSHIFT_MONGODB_DB_URL +
             process.env.OPENSHIFT_APP_NAME;
     }

mongoose.connect(url);

var courseModel = courseModel();

app.use(express.static(__dirname+'/public'));
app.get('/', function(req, res){
  res.send('hello world');
});


var courseSchema = new mongoose.Schema({
     course_id : String,
     course_name: String,
     modules:[]
 },{collection: "course"});

var courseCollection = mongoose.model("course", courseSchema);

 var skillSchema = new mongoose.Schema({
     skill: String,
     assessment: String
 },{collection: "skill"});

 var skillCollection = mongoose.model("skill", skillSchema);

 var learningOutcomeSchema = new mongoose.Schema({
     name: String,
     skills:[]
 },{collection: "learning_outcome"});

var learningOutcomeCollection = mongoose.model("learningOutcomeSchema", learningOutcomeSchema);


var courseOutcomeSchema = new mongoose.Schema({
    outcome: String,
    learning_outcome_id:[]
},{collection: "course_outcome"});

var courseOutcomeCollection = mongoose.model("courseOutcomeSchema", courseOutcomeSchema);

app.get('/rest/course', function(req, res)
{
    courseCollection.find({"_id" : "56bb8e4d5ae56c5057000002"}).lean().exec(function(err, results)
    {
        var listOfOutcomes = results[0]["modules"];
        getCourseOutcomeDetails(listOfOutcomes, function(courseOutcomeResult)
        {
            console.log(courseOutcomeResult);
            results[0].courseOutcomes = courseOutcomeResult;
            res.json(results);
        });
    });
});

function getCourseOutcomeDetails(listOfCourseIds, callback)
{
    courseOutcomeCollection.find({"_id" : {$in: listOfCourseIds }}).lean().exec(function(err, outcomeRes)
    {
        var courseOutcomeJson = [];

        var listOfLearningOutcomeid = [];
        for (var courseOutcome in outcomeRes)
        {
            listOfLearningOutcomeid = listOfLearningOutcomeid.concat(outcomeRes[courseOutcome]["learning_outcome_id"]);
        }

        getLearningOutcomeDetails(listOfLearningOutcomeid, function(learningOutcomeDetails)
        {
            for (var courseOutcomeIndex in outcomeRes)
            {
                var courseOutComeObject = outcomeRes[courseOutcomeIndex];
                var arrayOfLearningObjectiveDetails = [];
                var listOflearningOutComesInCourseOutcomeObject = courseOutComeObject["learning_outcome_id"];
                for (var learningOutcomeId in listOflearningOutComesInCourseOutcomeObject)
                {
                    var learningOutcome = getJsonObject( listOflearningOutComesInCourseOutcomeObject[learningOutcomeId] ,learningOutcomeDetails)
                    arrayOfLearningObjectiveDetails = arrayOfLearningObjectiveDetails.concat(learningOutcome)
                }
                courseOutComeObject.learningOutcomeDetails = arrayOfLearningObjectiveDetails;
                courseOutcomeJson.push(courseOutComeObject);
            }
            callback(courseOutcomeJson);
        });

    });
}

function getLearningOutcomeDetails(listOfLearningOutcomeIds, callback)
{
    learningOutcomeCollection.find({"_id" : {$in: listOfLearningOutcomeIds }}).lean().exec(function(err, outcomeRes)
    {
        //var outcomeRes= outcomeRes1;
        var learningOutcomeJson = [];
        var listOfSkillId = [];
        for (var learningOutcome in outcomeRes)
        {
            listOfSkillId = listOfSkillId.concat(outcomeRes[learningOutcome]["skills"]);
        }
        getSkillDetails(listOfSkillId, function(listOfSkillDetails)
        {
            for (var learningOutcomeIndex in outcomeRes)
            {
                var learningOutComeObject = outcomeRes[learningOutcomeIndex];
                var arrayOfSkillDetails = [];
                var listOfSkillIdsOflearningOutComeObject = learningOutComeObject["skills"];
                for (var skillObjectId in listOfSkillIdsOflearningOutComeObject)
                {
                    var skillDetail = getJsonObject( listOfSkillIdsOflearningOutComeObject[skillObjectId] ,listOfSkillDetails)
                    arrayOfSkillDetails = arrayOfSkillDetails.concat(skillDetail)
                }
                learningOutComeObject.skillDetails = arrayOfSkillDetails;
                learningOutcomeJson.push(learningOutComeObject);
            }
            callback(learningOutcomeJson);
        });

    });
}

function getSkillDetails(listOfSkillId, callback)
{

    skillCollection.find({"_id" : {$in: listOfSkillId }},function(err, skillResult)
    {
        callback(skillResult);

    });
}


function getJsonObject(id, collection)
{
    var a =  collection.filter(function(x)
    {
        return (JSON.stringify(x["_id"]) === JSON.stringify(id))
    });
    return a;
}



function courseModel()
{
    var courseModel;
}
app.listen(process.env.OPENSHIFT_NODEJS_PORT||3000);