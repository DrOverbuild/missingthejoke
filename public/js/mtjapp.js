(function() {
    var mtjapp = angular.module('mtjapp', ['ngRoute']);
    console.log("app: ");
    console.log(mtjapp);
    mtjapp.config(function ($routeProvider) {
        $routeProvider
            .when("/shop", {
                templateUrl: "template/shop.html"
            })
            .otherwise({
                templateUrl: "template/home.html"
            });
    });
})();