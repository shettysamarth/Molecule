"use strict";
(function() {
    angular
        .module("MoleculeApp")
        .controller("SidebarController", SidebarController);

    function  SidebarController($scope, $location, $rootScope) {
        $scope.$location = $location;
        console.log($location);
    }
})();

