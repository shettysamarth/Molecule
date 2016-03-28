"use strict";
var q = require("q");
module.exports = function(mongoose){

    var courseOutcomeSchema = require("./course.outcome.schema.js")(mongoose);
    var courseOutcomeModel = mongoose.model("courseOutcomeModel", courseOutcomeSchema);

    var api = {
        createCourseOutcome : createCourseOutcome,
        findCourseOutcomeById : findCourseOutcomeById,
        updateCourseOutcome : updateCourseOutcome,
        deleteCourseOutcome : deleteCourseOutcome,
        getCompleteCourseOutcomeInfo : getCompleteCourseOutcomeInfo,
        findAllCourseOutcome : findAllCourseOutcome
    }

    return api;

    function findAllCourseOutcome()
    {
        var deferred = q.defer();
        courseOutcomeModel.find(function(err, courseOutcomes){
            deferred.resolve(courseOutcomes);
        });
        return deferred.promise;
    }

    function getCompleteCourseOutcomeInfo(courseOutcomeIds)
    {
        //console.log("courseOutcomeResult");

        var deferred = q.defer();
        courseOutcomeModel.find({"_id" : {$in: courseOutcomeIds }},{"_id": 1,"outcome": 1 }).lean().exec(function(err, courseOutcomeResult)
        {

            if(courseOutcomeResult){

                deferred.resolve(courseOutcomeResult);
            }
            else{
                deferred.reject(err);
            }
        });
        return deferred.promise;
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
