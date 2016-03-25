"use strict";
(function() {
    angular
        .module("MoleculeApp")
        .controller("MainController", MainController);

    function  MainController($scope,$location) {
        $scope.$location=$location;
        $scope.$location.path("/login");
    }
})();