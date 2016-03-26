"use strict";
module.exports = function(){

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

    function getCompleteModuleInfo(moduleId)
    {

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
};
