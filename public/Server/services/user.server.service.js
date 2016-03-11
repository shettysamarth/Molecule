module.exports = function(app, userModel){
    app.post("/api/molecule/login", login);
    app.put("/api/project/updateUser/:id", updateUser);
    app.get("/api/project/loggedin", loggedin);
    app.post("/api/project/logout", logout);
    app.post("/api/molecule/register", register);
    app.get("/api/project/profile/:userId", profile);


    function login(req, res)
    {
        var username = req.body.username;
        var pwd = req.body.password;
        var credentials = {
            username: username,
            password: pwd
        };
        userModel
            .findUserByCredentials(credentials)
            .then(function(user){
                if(user)
                {
                    console.log(user);
                    req.session.currentUser = user;
                    res.send(user);
                }

            }, function(err) {

                    res.statusCode = 401;
                    res.send();
                }
            );
    }


    function updateUser(req, res) {
        console.log("Inside server side updateUser");
        var userId = req.params.id;
        var userObj = req.body;

        userModel
            .updateUser(userId, userObj)
            .then(function(user){
                console.log("Updated user: " + user);
                res.json(user);
            });
    }

    function register(req, res) {
        console.log("Inside server side addNewUser");
        var newUser = req.body;
        userModel
            .addNewUser(newUser)
            .then(function(user){
                console.log("New user server: "+ user);
                req.session.currentUser = user;
                res.json(user);
            });
    }


    function loggedin(req, res) {
        res.json(req.session.currentUser);
    }

    function logout(req, res) {
        req.session.destroy();
        res.send(200);
    }

    function profile(req, res){
        var userId = req.params.id;
        model
            .findUserById(userId)
            .then(function(user){
                res.json(user);
            });
    }


};

