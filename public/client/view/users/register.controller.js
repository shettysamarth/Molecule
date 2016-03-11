"use strict";
(function() {
    angular
        .module("MoleculeApp")
        .controller("RegisterController", RegisterController);

    function  RegisterController($scope, $rootScope, UserService) {
        $scope.register=register;
        console.log("registerController in place");

        function register(user) {
            console.log("registerClicked");
            UserService.createUser(user, serviceCallBack);
        }

        function serviceCallBack(user){
            if(user)
            {
                $rootScope.user = user;
                $scope.$location.path("/profile");
                console.log("user Created :");
                console.log(user);
            }
        }
    }




})();