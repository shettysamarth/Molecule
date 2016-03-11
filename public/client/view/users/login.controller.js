"use strict";
(function() {
    angular
        .module("MoleculeApp")
        .controller("LoginController", LoginController);

    function  LoginController($scope, $rootScope, UserService)
    {
        console.log("LoginController in place");
        $scope.login = login;

        function login(user) {
            if(user)
            {
                UserService.findUserByCredentials(user.username, user.password)
                    .then(loginSuccessCallback, loginErrorCallback);
            }
        }

        function  loginSuccessCallback(user) {
            $rootScope.user = user;
            $scope.$location.path("/profile");
            console.log(user);
        }

        function loginErrorCallback(res) {
            console.log(res);
        }
    }

})();