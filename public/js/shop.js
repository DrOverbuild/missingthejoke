(function() {
    var mtjapp = angular.module('mtjapp');

    mtjapp.controller('shopController', function ($scope) {
        $scope.stickerSelection = "artwork";
        $scope.stickerSelected = function() {
            console.log($scope.stickerSelection);
        }
    });
})();