(function() {
    var mtjapp = angular.module('mtjapp');

    mtjapp.controller('addressController', function ($scope, $routeParams, $location) {
        $scope.price = 2.50;

        $scope.address = {
            name: "",
            email: "",
            street1: "",
            street2: "",
            city: "",
            state: "",
            zip: ""
        };

        if ($routeParams.stickerSelection == "both") {
            $scope.price = 3.50;
        }

        $scope.submit = function() {
            console.log($scope.address);
        }
    });
})();