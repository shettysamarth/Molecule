"use strict";
var q = require("q");
module.exports = function(mongoose, moduleModel){

    var courseSchema = require("./course.schema.js")(mongoose);
    var courseModel = mongoose.model("courseModel", courseSchema);

    var api = {
        createCourse : createCourse,
        findCourseById : findCourseById,
        updateCourse : updateCourse,
        deleteCourse : deleteCourse,
        getCompleteCourseInfo:getCompleteCourseInfo,
        findAllCourse: findAllCourse
    }

    return api;
    var listOfModules;

    function findAllCourse()
    {
        var deferred = q.defer();
        courseModel.find(function(err, courses){
            deferred.resolve(courses);
        });
        return deferred.promise;
    }

    function getCompleteCourseInfo(courseId)
    {

        var deferred = q.defer();
        console.log(courseId)

        courseModel.find({"_id" : courseId}).lean().exec(function(err, results)
        {
            if(results)
            {
                console.log(results);
                listOfModules = results[0]["modules"];
                var moduleObjectIds = makeListOfRequiredModuleObjectsIdFromCourseInfo(listOfModules)

                moduleModel.getCompleteModuleInfo(moduleObjectIds)
                    .then(function (moduleResult) {
                        console.log("moduleResult");

                        var finalModuleRep = mapModuleToCourses(listOfModules, moduleResult);
                        console.log("6");
                        deferred.resolve(finalModuleRep);
                    })
            }
            else
            {
               deferred.reject(err);
            }
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



    function makeListOfRequiredModuleObjectsIdFromCourseInfo(listOfModuleDetailsFromCourse)
    {
        var moduleObjectIds = [];
        for(var moduleInfo in listOfModuleDetailsFromCourse)
        {
            moduleObjectIds.push(listOfModuleDetailsFromCourse[moduleInfo]["moduleObjectId"]);
        }
        return moduleObjectIds;
    }




    function deleteCourse(courseId)
    {
        var deferred = q.defer();
        courseModel.remove({_id: courseId}, function(err, course){
            if(err) {
                deferred.reject(err);
            } else {
                deferred.resolve(course);
            }
        });
        return deferred.promise;
    }

    function updateCourse (courseId, course)
    {
        console.log("inside course.model.js updateCourse");
        var deferred = q.defer();
        console.log("update course course.model:"+ courseId);
        courseModel.update({_id: courseId}, {$set: course}, function(err, course) {
            if(err) {
                console.log("Cud not find Usr!!");
                deferred.reject(err);
            } else {
                console.log("Update successful!");

                    deferred.resolve(course);
            }
        });
        return deferred.promise;
    }


    function createCourse(course)
    {
        var deferred = q.defer();
        console.log(course);
        courseModel.create(course, function(err, course){
            if(err){
                deferred.reject(err);
            } else{
                deferred.resolve(course);
            }
        });
        return deferred.promise;
    }

    function  findCourseById (courseId)
    {
        var deferred = q.defer();
        courseId.findById(courseId, function(err, course){

            if(err)
            {
                console.log("findCourseByIdError")
                deferred.reject(err);
            }
                deferred.resolve(course);
        });
        return deferred.promise;
    }
};
