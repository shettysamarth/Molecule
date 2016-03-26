"use strict";
module.exports = function(){

    var skillSchema = require("./skill.schema.js")(mongoose);
    var skillModel = mongoose.model("skillModel", skillSchema);

    var api = {
        createSkill : createSkill,
        findSkillById : findSkillById,
        updateSkill : updateSkill,
        deleteSkill : deleteSkill,
        getCompleteSkillInfo:getCompleteSkillInfo,
        findAllSkill: findAllSkill
    }

    return api;

    function findAllSkill()
    {
        var deferred = q.defer();
        skillModel.find(function(err, skills){
            deferred.resolve(skills);
        });
        return deferred.promise;
    }

    function getCompleteCourseInfo(skillId)
    {

    }

    function deleteSkill(skillId)
    {
        var deferred = q.defer();
        skillModel.remove({_id: skillId}, function(err, skill){
            if(err) {
                deferred.reject(err);
            } else {
                deferred.resolve(skill);
            }
        });
        return deferred.promise;
    }

    function updateSkill (skillId, skill)
    {
        console.log("inside skill.model.js updateCourse");
        var deferred = q.defer();
        console.log("update skill skill.model:"+ skillId);
        skillModel.update({_id: skillId}, {$set: skill}, function(err, skill) {
            if(err) {
                console.log("Cud not find Usr!!");
                deferred.reject(err);
            } else {
                console.log("Update successful!");

                deferred.resolve(skill);
            }
        });
        return deferred.promise;
    }


    function createSkill(skill)
    {
        var deferred = q.defer();
        console.log(skill);
        skillModel.create(skill, function(err, skill){
            if(err){
                deferred.reject(err);
            } else{
                deferred.resolve(skill);
            }
        });
        return deferred.promise;
    }

    function  findSkillById (skillId)
    {
        var deferred = q.defer();
        skillId.findById(skillId, function(err, skill){

            if(err)
            {
                console.log("findCourseByIdError")
                deferred.reject(err);
            }
            deferred.resolve(skill);
        });
        return deferred.promise;
    }
};
