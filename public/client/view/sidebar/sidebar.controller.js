"use strict";
(function() {
    angular
        .module("MoleculeApp")
        .controller("SidebarController", SidebarController);

    function  SidebarController($scope, $location, $rootScope) {
        var model = this;
        $scope.$location = $location;
        console.log($location);

        $scope.loginClicked = loginClicked;
        function loginClicked()
        {
            console.log("SidebarController::loginClicked");
            $location.path("/login");

            snapClose();
        }
    }
})();

