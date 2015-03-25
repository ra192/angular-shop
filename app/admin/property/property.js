'use strict';

angular.module('myAdminApp.property', ['ngRoute', 'myApp.settings', 'myApp.user'])
    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider.when('/property/create', {
            templateUrl: 'property/property.html',
            controller: 'CreatePropertyCtrl'
        }).when('/property/update', {
            templateUrl: 'property/property.html',
            controller: 'UpdatePropertyCtrl'
        });
    }])
    .controller('CreatePropertyCtrl', ['$scope', '$routeParams', '$http', 'settings', 'User', function ($scope, $routeParams, $http, settings, User) {

        $scope.isCreate=true;

        User.getLoginStatus(function (user) {
            if (user.isLoggedIn) {
                $scope.property={propertyValues:[{},{}]};
                $scope.save = function () {
                    $http.post(settings.apiUrl + '/properties', $scope.property).success(function (result) {
                        $scope.message = result;
                    });
                };
                $scope.addPropertyValue=function(){$scope.property.propertyValues.push({})};
            }
        });
    }])
    .controller('UpdatePropertyCtrl', ['$scope', '$routeParams', '$http', 'settings', 'User', function ($scope, $routeParams, $http, settings, User) {

        $scope.isCreate=false;

        User.getLoginStatus(function (user) {
            if (user.isLoggedIn) {
                var name=$routeParams.name;
                $http.get(settings.apiUrl+'/properties/'+name).success(function(result){
                    $scope.property = {name: name,displayName:result.displayName};

                    $scope.save = function () {
                        $http.put(settings.apiUrl + '/properties', $scope.property).success(function (result) {
                            $scope.message = result;
                        });
                    };
                });
            }
        });
    }]);
