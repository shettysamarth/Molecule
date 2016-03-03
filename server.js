

 //  OpenShift sample Node application
 var express = require('express');
 var fs      = require('fs');


 /**
  *  Define the sample application.
  */
 var SampleApp = function() {

     //  Scope.
     var self = this;


     /*  ================================================================  */
     /*  Helper functions.                                                 */
     /*  ================================================================  */

     /**
      *  Set up server IP address and port # using env variables/defaults.
      */
     self.setupVariables = function() {
         //  Set the environment variables we need.
         self.ipaddress = process.env.OPENSHIFT_NODEJS_IP;
         self.port      = process.env.OPENSHIFT_NODEJS_PORT || 3000;

         if (typeof self.ipaddress === "undefined") {
             //  Log errors on OpenShift but continue w/ 127.0.0.1 - this
             //  allows us to run/test the app locally.
             console.warn('No OPENSHIFT_NODEJS_IP var, using 127.0.0.1');
             self.ipaddress = "127.0.0.1";
         };
     };


     /**
      *  Populate the cache.
      */
     //self.populateCache = function() {
     //    if (typeof self.zcache === "undefined") {
     //        self.zcache = { 'index.html': '' };
     //    }
     //
     //    //  Local cache for static content.
     //    self.zcache['index.html'] = fs.readFileSync('./index.html');
     //};
     //
     //
     ///**
     // *  Retrieve entry (content) from cache.
     // *  @param {string} key  Key identifying content to retrieve from cache.
     // */
     //self.cache_get = function(key) { return self.zcache[key]; };
     //
     //
     ///**
     // *  terminator === the termination handler
     // *  Terminate server on receipt of the specified signal.
     // *  @param {string} sig  Signal to terminate on.
     // */
     //self.terminator = function(sig){
     //    if (typeof sig === "string") {
     //       console.log('%s: Received %s - terminating sample app ...',
     //                   Date(Date.now()), sig);
     //       process.exit(1);
     //    }
     //};


     /**
      *  Setup termination handlers (for exit and a list of signals).
      */
     self.setupTerminationHandlers = function(){
         //  Process on exit and signals.
         process.on('exit', function() { self.terminator(); });

         // Removed 'SIGPIPE' from the list - bugz 852598.
         ['SIGHUP', 'SIGINT', 'SIGQUIT', 'SIGILL', 'SIGTRAP', 'SIGABRT',
          'SIGBUS', 'SIGFPE', 'SIGUSR1', 'SIGSEGV', 'SIGUSR2', 'SIGTERM'
         ].forEach(function(element, index, array) {
             process.on(element, function() { self.terminator(element); });
         });
     };


     /*  ================================================================  */
     /*  App server functions (main app logic here).                       */
     /*  ================================================================  */

     /**
      *  Create the routing table entries + handlers for the application.
      */
     //self.createRoutes = function() {
     //    self.routes = { };
     //
     //    self.routes['/asciimo'] = function(req, res) {
     //        var link = "http://i.imgur.com/kmbjB.png";
     //        res.send("<html><body><img src='" + link + "'></body></html>");
     //    };
     //
     //    self.routes['/'] = function(req, res) {
     //        res.setHeader('Content-Type', 'text/html');
     //        res.send(self.cache_get('index.html') );
     //    };
     //};


     /**
      *  Initialize the server (express) and create the routes and register
      *  the handlers.
      */
     self.initializeServer = function() {
         //self.createRoutes();
         self.app = express();

         //  Add handlers for the app (from the routes).
         //for (var r in self.routes) {
         //    self.app.get(r, self.routes[r]);
         //}
     };

     self.initializeDatabase = function() {

         var mongoose = require('mongoose');

         var  url = 'mongodb://localhost/molecule';
         if (process.env.OPENSHIFT_MONGODB_DB_URL)
         {
             url = process.env.OPENSHIFT_MONGODB_DB_URL +
                 process.env.OPENSHIFT_APP_NAME;
         }

         mongoose.connect(url);


         self.app.use(function (req, res, next) {

             // Website you wish to allow to connect
             res.setHeader('Access-Control-Allow-Origin', "*");

             // Request methods you wish to allow
             res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

             // Request headers you wisgto allow
             res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

             // Set to true if you need the website to include cookies in the requests sent
             // to the API (e.g. in case you use sessions)
             res.setHeader('Access-Control-Allow-Credentials', true);

             // Pass to next layer of middleware
             next();
         });
         self.app.use(express.static(__dirname+'/public'));
         self.app.get('/', function(req, res){
             res.send('hello world');
         });


         var coursesSchema = new mongoose.Schema({
             course_id : String,
             name: String,
             modules:[]
         },{collection: "courses"});

         var coursesCollection = mongoose.model("courses", coursesSchema);
		
		var ModuleSchema = new mongoose.Schema({
             name : String,
             link: String,
             courseOutcomeIds:[],
             learningOutcomeIds:[]
         },{collection: "module"});
         
    	var moduleCollection = mongoose.model("module", ModuleSchema);


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

// res/course
         self.app.get('/rest/course', function(req, res)
         {
             courseCollection.find({"_id" : "56bb8e4d5ae56c5057000002"}).lean().exec(function(err, results)
             {
                 var listOfOutcomes = results[0]["modules"];
                 getCourseOutcomeDetails(listOfOutcomes, function(courseOutcomeResult)
                 {
                     results[0].courseOutcomes = courseOutcomeResult;
                     //res.header("Access-Control-Allow-Origin", "*");
                     //res.header("Access-Control-Allow-Headers", "X-Requested-With");
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



         //Module Info
         self.app.get('/rest/module', function(req, res)
         {
             coursesCollection.find({"_id" : "56cf02d55ae56c248a00000f"}).lean().exec(function(err, results)
             {
                 var listOfModuleDetails = results[0]["modules"];

                 var moduleObjectIds = makeListOfRequiredModuleObjectsIdFromCourseInfo(listOfModuleDetails)

                 getModuleInfoFromObjectIds(moduleObjectIds, function(moduleInfoFromObjectIdResult)
                 {
                     var listOfLearningOutcomesIds = getListOfLearningOutcomesIds(moduleInfoFromObjectIdResult);
                     var listOfCourseOutcomesIds = getListOfCourseOutcomesIds(moduleInfoFromObjectIdResult);

                     getLearningOutcomeDetails(listOfLearningOutcomesIds, function(result)
                     {
                         var learningOutComeResult = result;
                         getCourseOutcome(listOfCourseOutcomesIds, function(result)
                         {
                             var courseResult = result;

                             //All resources available create requiredJSON
                             var modulesArray = createModuleDetailsFromLearningOutcomesAndCourseOutcomes(learningOutComeResult,
                             courseResult,listOfModuleDetails, moduleInfoFromObjectIdResult);

                             //console.log(modulesArray);

                             res.json(modulesArray);
                         });

                     });


                 });

             });
         });

         function createModuleDetailsFromLearningOutcomesAndCourseOutcomes(learningOutcomesResult, courseOutcomeResult, moduleDetails,
                                                                           moduleInfoFromObjectIdResult)
         {

             // Setup Individual modules in array
             for(moduleDetail in moduleInfoFromObjectIdResult)
             {
                 var moduleinfo = mapCourseOutcomeToModule(moduleInfoFromObjectIdResult[moduleDetail], courseOutcomeResult)
                 moduleinfo = mapLearningOutcomeToModule(moduleInfoFromObjectIdResult[moduleDetail], learningOutcomesResult);
                 moduleInfoFromObjectIdResult[moduleDetail] = moduleinfo;
             }

             // Map modules to course Info
             var finalModuleRep = mapModuleToCourses(moduleDetails, moduleInfoFromObjectIdResult);
             return finalModuleRep;
         }

         function  mapModuleToCourses(courseDetails, modulesArray)
         {
             console.log(modulesArray);
             for (course in courseDetails)
             {
                 var module = modulesArray.filter(function(module)
                 {
                     return JSON.stringify(module["_id"]) === JSON.stringify(courseDetails[course]["moduleObjectId"]);
                 });
                 courseDetails[course].moduleInfo = module;
             }
             return courseDetails
         }

         function mapLearningOutcomeToModule(moduleDetail, learningOutcomeDetails)
         {
             learningOutcomeDetailsArray = []
             for(learningOutcomeId in moduleDetail["learningOutcomeIds"])
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

         function mapCourseOutcomeToModule(moduleDetail, courseOutcomeDetails)
         {
             courseOutcomeDetailsArray = []
             for(courseOutcomeId in moduleDetail["courseOutcomeIds"])
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






         function getCourseOutcome(courseOutcomes, callback)
         {
             courseOutcomeCollection.find({"_id" : {$in: courseOutcomes }},{"_id": 1,"outcome": 1 }).lean().exec(function(err, courseOutcomeResult)
             {
                 callback(courseOutcomeResult);
             });
         }

         function getModuleInfoFromObjectIds(moduleObjectIds, callback)
         {
             moduleCollection.find({"_id" : {$in: moduleObjectIds }}).lean().exec(function(err, moduleRes)
             {
                 callback(moduleRes);
             });
         }

         //Creates the segregation list of learning outcome ids which are
         //part of the module response.
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

         function getModuleObjectForObjectId(objectid, listOfModuleObjects)
         {
             return listOfModuleObjects.filter(
                 function(moduleObject)
                 {
                     return (moduleObject["id"] == objectid)
                 });
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



         // Helper Functions
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

         function makeListOfRequiredModuleObjectsIdFromCourseInfo(listOfModuleDetailsFromCourse)
         {
             var moduleObjectIds = [];
             for(moduleInfo in listOfModuleDetailsFromCourse)
             {
                 moduleObjectIds.push(listOfModuleDetailsFromCourse[moduleInfo]["moduleObjectId"]);
             }
             return moduleObjectIds;
         }



         function getModuleObjectIdModuleDetailDictionary(listOfModulesObjectsId, callback)
         {

         }


         function getCourseDetails(listOfModuleIds, callback)
         {
             moduleCollection.find({"_id" : {$in: listOfModuleIds }}).lean().exec(function(err, moduleRes)
             {
                 var courseOutcomeJson = [];

                 var listOfLearningOutcomeid = [];
                 var listOfCourseOutcomeID = [];
                 for (var module in moduleRes)
                 {
                     listOfLearningOutcomeid = listOfLearningOutcomeid.concat(moduleRes[module]["learningOutcomeIds"]);
                     listOfCourseOutcomeID = listOfCourseOutcomeID.concat(moduleRes[module]["courseOutcomeIds"])
                 }

                 getLearningOutcomeDetails(listOfLearningOutcomeid, function(learningOutcomeDetails)
                 {
                     for (var courseOutcomeIndex in moduleRes)
                     {
                         var courseOutComeObject = moduleRes[courseOutcomeIndex];
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
     }
     

     
     
     
     /*************************/

     /**
      *  Initializes the sample application.
      */
     self.initialize = function() {
         self.setupVariables();
         //self.populateCache();
         //self.setupTerminationHandlers();

         // Create the express server and routes.
         self.initializeServer();
         self.initializeDatabase();
     };


     /**
      *  Start the server (starts up the sample application).
      */
     self.start = function() {
         //  Start the app on the specific interface (and port).
         self.app.listen(self.port, self.ipaddress, function() {
             console.log('%s: Node server started on %s:%d ...',
                         Date(Date.now() ), self.ipaddress, self.port);
         });
     };

 };   /*  Sample Application.  */



 /**
  *  main():  Main code.
  */
 var zapp = new SampleApp();
 zapp.initialize();
 zapp.start();


