(function() {
    var mtjapp = angular.module('mtjapp', ['ngRoute']);
    mtjapp.config(function ($routeProvider) {
        $routeProvider
            .when("/shop", {
                templateUrl: "template/shop.html",
                controller: "shopController"
            })
            .otherwise({
                templateUrl: "template/home.html"
            });
    });
})();