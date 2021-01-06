(function() {
    var mtjapp = angular.module('mtjapp');

    mtjapp.controller('shopController', function ($scope, $location) {
        $scope.stickerSelection = "artwork";
        $scope.stickerSelected = function() {
            $location.path(`/addressform/${$scope.stickerSelection}`);
        }
    });
})();