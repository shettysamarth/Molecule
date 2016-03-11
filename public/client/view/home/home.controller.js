"use strict";
(function() {
    angular
        .module("MoleculeApp")
        .controller("HomeController", HomeController);

    function  HomeController($scope, $location) {
        $scope.$location = $location;
        console.log($location);
    }
})();

