module.exports = function(app, mongoose) {

    var userModel = require("./models/user.model.js") (mongoose);
    require("./services/user.server.service.js")(app, userModel);


};