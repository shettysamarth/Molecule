"use strict";
module.exports = function(){

    var courseOutcomeSchema = require("./course.outcome.schema.js")(mongoose);
    var courseOutcomeModel = mongoose.model("courseOutcomeModel", courseOutcomeSchema);

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
        courseOutcomeModel.find(function(err, courseOutcomes){
            deferred.resolve(courseOutcomes);
        });
        return deferred.promise;
    }

    function getCompleteCourseOutcomeInfo(courseOutcomeId)
    {

    }

    function deleteCourseOutcome(courseOutcomeId)
    {
        var deferred = q.defer();
        courseOutcomeModel.remove({_id: courseOutcomeId}, function(err, courseOutcome){
            if(err) {
                deferred.reject(err);
            } else {
                deferred.resolve(courseOutcome);
            }
        });
        return deferred.promise;
    }

    function updateCourseOutcome (courseOutcomeId, courseOutcome)
    {
        console.log("inside courseOutcome.model.js updatecourseOutcome");
        var deferred = q.defer();
        console.log("update courseOutcome courseOutcome.model:"+ courseOutcomeId);
        courseOutcomeModel.update({_id: courseOutcomeId}, {$set: courseOutcome}, function(err, courseOutcome) {
            if(err) {
                console.log("Cud not find Usr!!");
                deferred.reject(err);
            } else {
                console.log("Update successful!");
                deferred.resolve(courseOutcome);
            }
        });
        return deferred.promise;
    }


    function createCourseOutcome(courseOutcome)
    {
        var deferred = q.defer();
        console.log(courseOutcome);
        courseOutcomeModel.create(courseOutcome, function(err, courseOutcome){
            if(err){
                deferred.reject(err);
            } else{
                deferred.resolve(courseOutcome);
            }
        });
        return deferred.promise;
    }

    function  findCourseOutcomeById (courseOutcomeId)
    {
        var deferred = q.defer();
        courseOutcomeId.findById(courseOutcomeId, function(err, courseOutcome){

            if(err)
            {
                console.log("findcourseOutcomeByIdError")
                deferred.reject(err);
            }
            deferred.resolve(courseOutcome);
        });
        return deferred.promise;
    }
};
