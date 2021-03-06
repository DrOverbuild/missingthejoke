(function() {
    var mtjapp = angular.module('mtjapp');

    mtjapp.controller('addressController', function ($scope, $routeParams, $location, $http) {
        const stripe = Stripe('pk_live_RabnnLeEnQ57X8tZQ6TuXaI100PvZmTS2H');

        $scope.error = "";

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

        $scope.loadingSession = false;
        $scope.productValid = $routeParams.stickerSelection === "both"
            || $routeParams.stickerSelection === "artwork"
            || $routeParams.stickerSelection === "derpface";

        if ($routeParams.stickerSelection == "both") {
            $scope.price = 3.50;
        }

        $scope.submit = function() {
            $scope.loadingSession = true;

            console.log($scope.address);
            const data = {
                address: $scope.address,
                product: $routeParams.stickerSelection,
                origin: location.origin
            }
            $http.post("https://us-central1-missingthejokecom.cloudfunctions.net/setupPayment", data)
                .then( function (response) {
                    $scope.goToStripe(response.data.id);
                }, function (error) {
                    if (error.status === -1 || error.status === 500) {
                        $scope.error = "An unknown internal server occurred.";
                    } else {
                        if (error.data) {
                            $scope.error = error.data;
                        } else {
                            $scope.error = `error code ${error.status}`;
                        }
                    }

                    console.log(error);
                });
        }

        $scope.goToStripe = function (sessionID) {
            stripe.redirectToCheckout({
                // Make the id field from the Checkout Session creation API response
                // available to this file, so you can provide it as parameter here
                // instead of the {{CHECKOUT_SESSION_ID}} placeholder.
                sessionId: sessionID
            });
        }
    });
})();