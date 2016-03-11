(function()
{
    angular
        .module("MoleculeApp")
        .config(function ($routeProvider) {
           $routeProvider
               .when("/", {
                   templateUrl : "view/home/home.view.html"
               })
               .when("/home", {
                   templateUrl : "view/home/home.view.html",
                   controller : "HomeController"
               })
               .when("/profile", {
                   templateUrl : "view/profile/profile.view.html",
                   controller : "ProfileController"
               })

               .when("/login", {
                   templateUrl : "view/users/login.view.html",
                   controller : "LoginController"

               })
               .when("/profile", {
                   templateUrl : "view/users/profile.view.html",
                   controller : "ProfileController"
               })

               .when("/register", {
                   templateUrl : "view/users/register.view.html",
                   controller : "RegisterController"
               });
        });
})();