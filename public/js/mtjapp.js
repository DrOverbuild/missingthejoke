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

    // adding custom validator with directives
    mtjapp.directive("validemail", function() {
        return {
            require: 'ngModel',
            link: function (scope, element, attr, mCtrl) {
                function emailValidation(value) {
                    const test = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(value);

                    mCtrl.$setValidity('validemail', test);
                    return value;
                }
                mCtrl.$parsers.push(emailValidation);
            }
        };
    });

    mtjapp.directive("validstate", function() {
        return {
            require: 'ngModel',
            link: function (scope, element, attr, mCtrl) {
                function stateValidation(value) {
                    const states = ['AL', 'AK', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'FL', 'GA', 'HI', 'ID', 'IL', 'IN', 'IA', 'KS',
                        'KY', 'LA', 'ME', 'MD', 'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ', 'NM', 'NY', 'NC', 'ND',
                        'OH', 'OK', 'OR', 'PA', 'RI', 'SC', 'SD', 'TN', 'TX', 'UT', 'VT', 'VA', 'WA', 'WV', 'WI', 'WY'];

                    const test = states.includes(value);

                    mCtrl.$setValidity('validstate', test);
                    return value;
                }
                mCtrl.$parsers.push(stateValidation);
            }
        };
    });

    mtjapp.directive("validzip", function() {
        return {
            require: 'ngModel',
            link: function (scope, element, attr, mCtrl) {
                function zipValidation(value) {
                    const test = /^[0-9]{5}(?:-[0-9]{4})?$/.test(value);

                    mCtrl.$setValidity('validzip', test);
                    return value;
                }
                mCtrl.$parsers.push(zipValidation);
            }
        };
    });
})();