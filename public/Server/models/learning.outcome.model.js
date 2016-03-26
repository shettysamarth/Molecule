"use strict";
module.exports = function(){

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

    function getCompleteLearningOutcomeInfo(learningOutcomeId)
    {

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
                console.log("Cud not find Usr!!");
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
};
