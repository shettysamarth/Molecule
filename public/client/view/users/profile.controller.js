"use strict";
(function() {
    angular
        .module("MoleculeApp")
        .controller("ProfileController", ProfileController);

    function  ProfileController($scope, $rootScope, UserService)
    {
        console.log("ProfileController in place");
        $scope.update=update;
        $scope.user.username= $rootScope.user.username;
        $scope.user.password= $rootScope.user.password;
        $scope.user.firstName= $rootScope.user.firstName;
        $scope.user.lastName= $rootScope.user.lastName;
        $scope.user.email = $rootScope.user.email;

        function update(user)
        {
            console.log("update");
            UserService.updateUser($rootScope.user["_id"], user, updateCallback);
        }

        function updateCallback(user)
        {
            if(user)
            {
                $rootScope.user = user;
            }
        }
    }



})();