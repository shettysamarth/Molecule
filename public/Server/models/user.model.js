var q = require("q");

module.exports = function(mongoose){
    var userSchema = require("./user.schema.js")(mongoose);
    var usersModel = mongoose.model("usersModel", userSchema);

    var api = {
        findUserById : findUserById,
        findUserByCredentials : findUserByCredentials,
        findAllUsers : findAllUsers,
        deleteUser : deleteUser,
        addNewUser : addNewUser,
        updateUser : updateUser
    };

    return api;

    function findUserById(userId) {
        console.log("inside user.model.js findUserById!!!!!");
        var deferred = q.defer();
        usersModel.findById(userId, function(err, user){
            deferred.resolve(user);
        });
        return deferred.promise;
    }

    function findUserByCredentials(credentials) {
        console.log("inside user.model.js findUserByCredentials");
        var deferred = q.defer();
        //console.log(credentials);
        //console.log(credentials.username + " " + credentials.password);
        usersModel.find({email: credentials.username,
            password: credentials.password}, function(err, user){
            console.log("Model output")
            console.log(err);
            console.log(user);
            if(user.length>0)
            {
                console.log("user length" + user.length);
                deferred.resolve(user);
            }
            else
            {
                deferred.reject(err);
            }

        });
        return deferred.promise;
    }

    function findAllUsers() {
        console.log("inside user.model.js findAll");
        var deferred = q.defer();
        usersModel.find(function(err, users){
            deferred.resolve(users);
        });
        return deferred.promise;
    }

    function deleteUser(userId) {
        console.log("inside user.model.js deleteUser");
        var deferred = q.defer();
        usersModel.remove({_id: userId}, function(err, user){
            if(err) {
                deferred.reject(err);
            } else {
                deferred.resolve(user);
            }
        });
        return deferred.promise;
    }

    function addNewUser(newUser) {
        console.log("inside user.model.js addNewUser Divya project");
        var deferred = q.defer();
        console.log(newUser);
        usersModel.create(newUser, function(err, doc){
            if(err){
                console.log("EROORRRRR no new user " + err);
                deferred.reject(err);
            } else{
                console.log("New User created: " + doc);
                deferred.resolve(doc);
            }
        });
        return deferred.promise;
    }


    function updateUser(userId, userObj) {
        console.log("inside user.model.js updateUser");
        var deferred = q.defer();
        console.log("update user userId: "+ userId);
        usersModel.update({_id: userId}, {$set: userObj}, function(err, user) {
            if(err) {
                console.log("Cud not find Usr!!");
                deferred.reject(err);
            } else {
                console.log("Update successful!");
                usersModel.findById(userId, function(err,usr) {
                    console.log(usr);
                    deferred.resolve(usr);
                });
            }
        });
        return deferred.promise;
    }
};