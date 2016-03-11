"use strict";
(function() {
    angular
        .module("MoleculeApp")
        .controller("HeaderController", HeaderController);

    function  HeaderController($scope, $location, $rootScope)
    {
        $scope.$location = $location;
        $scope.logout = logout;
        //$scope.user = $rootScope.user;

        function logout()
        {
            $rootScope.user = null;
            //$scope.user = null;
            $scope.$location.path("/home");
        }
    }


})();