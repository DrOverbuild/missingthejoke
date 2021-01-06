(function() {
    var mtjapp = angular.module('mtjapp', ['ngRoute']);
    mtjapp.config(function ($routeProvider) {
        $routeProvider
            .when("/shop", {
                templateUrl: "template/shop.html",
                controller: "shopController"
            })
            .when("/addressform/:stickerSelection", {
                templateUrl: "template/address.html",
                controller: "addressController"
            })
            .otherwise({
                templateUrl: "template/home.html"
            });
    });
})();