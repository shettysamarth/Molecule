(function()
{
    var appname = angular.module('Molecule', []);
    appname.controller('CourseController', ['$scope',
        function($scope) {
            $scope.Hello = 'Hello';
        }]);
})();

