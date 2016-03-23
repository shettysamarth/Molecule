"use strict";
(function() {
    angular
        .module("MoleculeApp")
        .controller("HomeController", HomeController);

    function  HomeController($scope, $location) {
        $scope.$location = $location;
        $scope.buttonClick = buttonClick;
        $scope.getStyle = getStyle;

        console.log($location);

        var array1 = ["h", "i", "j", "k", "l","m", "sfdd", "p","q", "r", "s"];
        var array2 = ["a", "b", "c", "d", "f", "g"];

        $scope.unacquiredSkills = array1;

        $scope.acquiredSkills = array2;

        function buttonClick(skill)
        {
            array2.splice(0,0,skill);
            array1.splice(array1.indexOf(skill),1);
            console.log(skill);
        }

        function getStyle(user)
        {

        }
    }
})();

