

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
     //    console.log('%s: Node server stopped.', Date(Date.now()) );
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


         self.app.use(express.static(__dirname+'/public'));
         self.app.get('/', function(req, res){
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

         self.app.get('/rest/course', function(req, res)
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
     }

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


