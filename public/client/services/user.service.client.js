"use strict";
(function()
{
    angular
        .module("MoleculeApp")
        .factory("UserService",UserService);

    function UserService($http, $q)
    {
        var UserService = {
            findUserByCredentials : findUserByCredentials,
            //findAllUsers : findAllUsers,
            createUser : createUser,
            //deleteUserById : deleteUserById,
            //updateUser : updateUser
        }

        return UserService;

        function findUserByCredentials(username, password){
            var user = {
                username : username,
                password : password
            };

            var req = {
                method: 'POST',
                url: '/api/molecule/login',

                data: { user: user }
            }
            var deferred = $q.defer();
            $http(req)
                .then(function(user12){
                    console.log("inside client side" + user12);
                    deferred.resolve(user12);
                }, function failure(err)
                {
                    deferred.reject(err);
                });

            return deferred.promise;
        }



        function  createUser(user, callback){


            var deferred = $q.defer();
            $http.post("/api/project/user/", userObj)
                .then(function successCallBack(users){
                    deferred.resolve(users);
                }, function errorCallBack(err){
                    deferred.reject(err);
                });
            return deferred.promise;
        }

        function  deleteUserById(userId, callback){
            for(var index=0; index< users.length; index++){
                if((users[index]["username"] === username) && (users[index]["password"]===password )){
                    users.splice(index, 1);
                }
            }
            callback(users);
        }

        //function updateUser(userId, user, callback)
        //{
        //    for(var index=0; index< users.length; index++){
        //        if(users[index]["_id"] === userId)
        //        {
        //            users[index] = user;
        //            callback(users[index]);
        //            return;
        //        }
        //    }
        //    callback(null);
        //}
    }
})();