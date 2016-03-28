//  OpenShift sample Node application
 var express = require('express');
 var app = express();
 var fs      = require('fs');
 var bodyParser    = require('body-parser');
 var multer        = require('multer');
 var passport = require('passport');
 var localStrategy = require('passport-local').Strategy;
 var cookieParser = require('cookie-parser');
 var session = require('express-session');
 var mongoose = require('mongoose');
 var ipaddress 	= process.env.OPENSHIFT_NODEJS_IP || '127.0.0.1';
 var port 		= process.env.OPENSHIFT_NODEJS_PORT || 3000;
 var  url = process.env.OPENSHIFT_MONGODB_DB_URL || 'mongodb://localhost/molecule';
 if (process.env.OPENSHIFT_MONGODB_DB_PASSWORD) {
     url = process.env.OPENSHIFT_MONGODB_DB_USERNAME + ":" +
         process.env.OPENSHIFT_MONGODB_DB_PASSWORD + "@" +
         process.env.OPENSHIFT_MONGODB_DB_HOST + ':' +
         process.env.OPENSHIFT_MONGODB_DB_PORT + '/' +
         process.env.OPENSHIFT_APP_NAME;
 }
 mongoose.connect(url);
 app.use(bodyParser.json()); // for parsing application/json
 app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
 app.use(multer()); //for parsing multipart/form-data
 var secretKey = process.env.MOLECULESESSIONSECRETKEY || "secondaryKey";
 app.use(session({secret :secretKey }));
 app.use(cookieParser());
 app.use(passport.initialize());
 app.use(passport.session());
 app.use(express.static(__dirname + '/public'));//host the static content in public directory
 app.use(function (req, res, next) {
     res.header("Access-Control-Allow-Origin", "*");
     res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
     next();
     // Pass to next layer of middleware
 });
require("./public/Server/app.js")(app, mongoose);
 app.listen(port, ipaddress, function() {
     console.log('%s: Node server started on %s:%d ...',
         Date(Date.now() ), ipaddress, port);
 });


