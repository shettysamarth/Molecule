"use strict";
var q = require("q");
module.exports = function(mongoose, skillModel){

    var learningOutcomeSchema = require("./learning.outcome.schema.js")(mongoose);
    var learningOutcomeModel = mongoose.model("learningOutcomeModel", learningOutcomeSchema);

    var api = {
        createLearningOutcome : createLearningOutcome,
        findLearningOutcomeById : findLearningOutcomeById,
        updateLearningOutcome : updateLearningOutcome,
        deleteLearningOutcome : deleteLearningOutcome,
        getCompleteLearningOutcomeInfo : getCompleteLearningOutcomeInfo,
        findAllLearningOutcome : findAllLearningOutcome
    }

    return api;

    function findAllLearningOutcome()
    {
        var deferred = q.defer();
        learningOutcomeModel.find(function(err, learningOutcomes){
            deferred.resolve(learningOutcomes);
        });
        return deferred.promise;
    }

    function getCompleteLearningOutcomeInfo(learningOutcomeIds)
    {
        console.log(getCompleteLearningOutcomeInfo);
        var deferred = q.defer();
        learningOutcomeModel.find({"_id" : {$in : learningOutcomeIds }}).lean().exec(function(err, learninOutcomeRes)
        {
            if(learninOutcomeRes)
            {
                var listOfSkillIds = extractSkillIdsFromLearningOutcome(learninOutcomeRes);
                skillModel.getCompleteSkillInfo(listOfSkillIds)
                .then(function (skillResult) {
                    var learningOutComeExtendedinfoJson = populateAssociatedSkillsForLearningOutcomes(learninOutcomeRes, skillResult);

                    deferred.resolve(learningOutComeExtendedinfoJson)
                }, function (err) {
                    deferred.reject(err);
                });
            }
            else{
                deferred.reject(err);
            }
        });
        return deferred.promise;
    }
    


    function deleteLearningOutcome(learningOutcomeId)
    {
        var deferred = q.defer();
        learningOutcomeModel.remove({_id: learningOutcomeId}, function(err, learningOutcome){
            if(err) {
                deferred.reject(err);
            } else {
                deferred.resolve(learningOutcome);
            }
        });
        return deferred.promise;
    }

    function updateLearningOutcome (learningOutcomeId, learningOutcome)
    {
        console.log("inside learningOutcome.model.js updatelearningOutcome");
        var deferred = q.defer();
        console.log("update learningOutcome learningOutcome.model:"+ learningOutcomeId);
        learningOutcomeModel.update({_id: learningOutcomeId}, {$set: learningOutcome}, function(err, learningOutcome) {
            if(err) {
                deferred.reject(err);
            } else {
                console.log("Update successful!");
                deferred.resolve(learningOutcome);
            }
        });
        return deferred.promise;
    }

    function createLearningOutcome(learningOutcome)
    {
        var deferred = q.defer();
        console.log(learningOutcome);
        learningOutcomeModel.create(learningOutcome, function(err, learningOutcome){
            if(err){
                deferred.reject(err);
            } else{
                deferred.resolve(learningOutcome);
            }
        });
        return deferred.promise;
    }

    function  findLearningOutcomeById (learningOutcomeId)
    {
        var deferred = q.defer();
        learningOutcomeId.findById(learningOutcomeId, function(err, learningOutcome){

            if(err)
            {
                console.log("findlearningOutcomeByIdError")
                deferred.reject(err);
            }
            deferred.resolve(learningOutcome);
        });
        return deferred.promise;
    }

    //Helpers

    function populateAssociatedSkillsForLearningOutcomes(learninOutcomeRes, skillRes)
    {
        console.log("learningOutcomeJson");

        var learningOutcomeJson = [];
        for (var learningOutcomeIndex in learninOutcomeRes)
        {
            var learningOutComeObject = learninOutcomeRes[learningOutcomeIndex];
            var arrayOfSkillDetails = [];

            var listOfSkillIdsOflearningOutComeObject = learningOutComeObject["skills"];
            for (var skillObjectId in listOfSkillIdsOflearningOutComeObject)
            {
                var skillDetail = getJsonObject( listOfSkillIdsOflearningOutComeObject[skillObjectId] ,skillRes)
                arrayOfSkillDetails = arrayOfSkillDetails.concat(skillDetail)
            }
            learningOutComeObject.skillDetails = arrayOfSkillDetails;
            learningOutcomeJson.push(learningOutComeObject);
        }
        return learningOutcomeJson;
    }


    function getJsonObject(id, collection)
    {
        var a =  collection.filter(function(x)
        {
            return (JSON.stringify(x["_id"]) === JSON.stringify(id))
        });
        return a;
    }

    function extractSkillIdsFromLearningOutcome(learninOutcomeRes){
        var listOfSkillIds = [];
        for (var learningOutcome in learninOutcomeRes)
        {
            listOfSkillIds = listOfSkillIds.concat(learninOutcomeRes[learningOutcome]["skills"]);
        }
        return listOfSkillIds;
    }


    function getSkillInfo(skillIds)
    {
        skillModel.getSkillInfo(skillIds).then()
    }
};
