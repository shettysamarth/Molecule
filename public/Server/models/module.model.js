"use strict";
var q = require("q");
module.exports = function(mongoose, courseOutcomeModel, learningOutcomeModel){

    var moduleSchema = require("./module.schema.js")(mongoose);
    var moduleModel = mongoose.model("moduleModel", moduleSchema);

    var api = {
        createModule : createModule,
        findModuleById : findModuleById,
        updateModule : updateModule,
        deleteModule : deleteModule,
        getCompleteModuleInfo:getCompleteModuleInfo,
        findAllModule: findAllModule
    }

    return api;

    function findAllModule()
    {
        var deferred = q.defer();
        moduleModel.find(function(err, modules){
            deferred.resolve(modules);
        });
        return deferred.promise;
    }

    function getCompleteModuleInfo(moduleIds)
    {
        //console.log("model.module.js :: getCompleteModuleInfo");
        var deferred = q.defer();
        getModuleInfoForObjectIds(moduleIds)
        .then(function(moduleRes){

            var listOfLearningOutcomesIds = getListOfLearningOutcomesIds(moduleRes);
            var listOfCourseOutcomesIds = getListOfCourseOutcomesIds(moduleRes);
            //console.log(listOfLearningOutcomesIds);
            //console.log(listOfCourseOutcomesIds);
            courseOutcomeModel.getCompleteCourseOutcomeInfo(listOfCourseOutcomesIds)
                .then(function(courseOutcomeResult){
                    console.log(courseOutcomeResult);
                    learningOutcomeModel.getCompleteLearningOutcomeInfo(listOfLearningOutcomesIds)
                    .then(function(learningOutcomeResults){
                        var modulesArray = createModuleDetailsFromLearningOutcomesAndCourseOutcomes(learningOutcomeResults,
                            courseOutcomeResult, moduleRes);
                        deferred.resolve(modulesArray);
                    });
                });
        }, function(err){
            deferred.reject(err);
        });
        return deferred.promise;
    }

    function  mapModuleToCourses(courseDetails, modulesArray)
    {
        console.log(modulesArray);
        for (var course in courseDetails)
        {
            var module = modulesArray.filter(function(module)
            {
                return JSON.stringify(module["_id"]) === JSON.stringify(courseDetails[course]["moduleObjectId"]);
            });
            courseDetails[course].moduleInfo = module;
        }
        return courseDetails
    }

    function createModuleDetailsFromLearningOutcomesAndCourseOutcomes(learningOutcomesResult, courseOutcomeResult,  moduleRes)
    {

        // Setup Individual modules in array
        for(var moduleDetail in moduleRes)
        {
            var moduleinfo = mapCourseOutcomeToModule(moduleRes[moduleDetail], courseOutcomeResult)
            moduleinfo = mapLearningOutcomeToModule(moduleRes[moduleDetail], learningOutcomesResult);
            moduleRes[moduleDetail] = moduleinfo;
        }
        return moduleRes;
    }



    function getModuleInfoForObjectIds(objectIds){
        var deferred = q.defer();
        moduleModel.find({"_id" : {$in: objectIds }}).lean().exec(function(err, moduleRes)
        {
            if(moduleRes){
                deferred.resolve(moduleRes);
            }
            else{
                deferred.reject(err);
            }
        });
        return deferred.promise;
    }

    function getListOfCourseOutcomesIds(listOfModulesDetails)
    {
        var listOfCourseOutcomeIds = [];
        for(var i = 0; i < listOfModulesDetails.length; i++)
        {
            var moduleDetails = listOfModulesDetails[i];
            var listOfCourseOutComefromTheCurrentModule = moduleDetails["courseOutcomeIds"];
            for(var j = 0; j < listOfCourseOutComefromTheCurrentModule.length; j++)
            {
                if(notInArray(listOfCourseOutcomeIds,listOfCourseOutComefromTheCurrentModule[j]))
                {
                    listOfCourseOutcomeIds.push(listOfCourseOutComefromTheCurrentModule[j])
                }
            }
        }
        return listOfCourseOutcomeIds;
    }


    function getListOfLearningOutcomesIds(listOfModulesDetails)
    {
        var listOfLearningOutcomeIds = [];
        for(var i = 0; i < listOfModulesDetails.length; i++)
        {
            var moduleDetails = listOfModulesDetails[i];
            var listOfLearningOutComefromTheCurrentModule = moduleDetails["learningOutcomeIds"];
            for(var j = 0; j < listOfLearningOutComefromTheCurrentModule.length; j++)
            {
                if(notInArray(listOfLearningOutcomeIds,listOfLearningOutComefromTheCurrentModule[j]))
                {
                    listOfLearningOutcomeIds.push(listOfLearningOutComefromTheCurrentModule[j])
                }
            }
        }
        return listOfLearningOutcomeIds;
    }

    function notInArray(array, value)
    {
        for (var i = 0; i < array.length; i++)
        {
            if (array[i] === value)
            {
                return false;
            }
        }
        return true;
    }





    function deleteModule(moduleId)
    {
        var deferred = q.defer();
        moduleModel.remove({_id: moduleId}, function(err, module){
            if(err) {
                deferred.reject(err);
            } else {
                deferred.resolve(module);
            }
        });
        return deferred.promise;
    }

    function updateModule (moduleId, module)
    {
        console.log("inside module.model.js updatemodule");
        var deferred = q.defer();
        console.log("update module module.model:"+ moduleId);
        moduleModel.update({_id: moduleId}, {$set: module}, function(err, module) {
            if(err) {
                console.log("Cud not find Usr!!");
                deferred.reject(err);
            } else {
                console.log("Update successful!");
                deferred.resolve(module);
            }
        });
        return deferred.promise;
    }


    function createModule(module)
    {
        var deferred = q.defer();
        console.log(module);
        moduleModel.create(module, function(err, module){
            if(err){
                deferred.reject(err);
            } else{
                deferred.resolve(module);
            }
        });
        return deferred.promise;
    }

    function  findModuleById (moduleId)
    {
        var deferred = q.defer();
        moduleId.findById(moduleId, function(err, module){

            if(err)
            {
                console.log("findmoduleByIdError")
                deferred.reject(err);
            }
            deferred.resolve(module);
        });
        return deferred.promise;
    }


    function mapCourseOutcomeToModule(moduleDetail, courseOutcomeDetails)
    {
        var courseOutcomeDetailsArray = []
        for(var courseOutcomeId in moduleDetail["courseOutcomeIds"])
        {
            var courseOutcome = courseOutcomeDetails.filter(function(course)
            {
                return JSON.stringify(course["_id"]) === JSON.stringify(moduleDetail["courseOutcomeIds"][courseOutcomeId]);
            });
            courseOutcomeDetailsArray.push(courseOutcome);
        }
        moduleDetail.courseOutcome = courseOutcomeDetailsArray;
        return moduleDetail;
    }

    function mapLearningOutcomeToModule(moduleDetail, learningOutcomeDetails)
    {
        var learningOutcomeDetailsArray = []
        for(var learningOutcomeId in moduleDetail["learningOutcomeIds"])
        {
            var learningOutcome = learningOutcomeDetails.filter(function(course)
            {
                return JSON.stringify(course["_id"]) === JSON.stringify(moduleDetail["learningOutcomeIds"][learningOutcomeId]);
            });
            learningOutcomeDetailsArray.push(learningOutcome);
        }
        moduleDetail.learningOutcomes = learningOutcomeDetailsArray;
        return moduleDetail;
    }
};
