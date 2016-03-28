module.exports = function(app, mongoose) {

    var userModel = require("./models/user.model.js") (mongoose);
    require("./services/user.server.service.js")(app, userModel);

    var skillModel =  require("./models/skill.model.js")(mongoose);
    var learningOutcomeModel = require("./models/learning.outcome.model.js")(mongoose, skillModel);
    var courseOutcomeModel = require("./models/course.outcome.model.js")(mongoose);
    var moduleModel = require("./models/module.model.js")(mongoose, courseOutcomeModel, learningOutcomeModel);
    var courseModel = require("./models/course.model.js") (mongoose, moduleModel);
    require("./services/course.service.server.js")(app, courseModel);


};