'use strict';

angular.module('myAdminApp.category', ['ngRoute', 'myApp.settings', 'myApp.user'])
    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider.when('/category/create', {
            templateUrl: 'category/category.html',
            controller: 'CreateCategoryCtrl'
        }).when('/category/update', {
            templateUrl: 'category/category.html',
            controller: 'UpdateCategoryCtrl'
        });
    }])
    .controller('CreateCategoryCtrl', ['$scope', '$routeParams', '$http', 'settings', 'User', function ($scope, $routeParams, $http, settings, User) {

        $scope.isCreate=true;

        User.getLoginStatus(function (user) {
            if (user.isLoggedIn) {
                $scope.category = {parent: $routeParams.parent};

                $http.get(settings.apiUrl + '/properties').success(function (result) {
                    $scope.properties = result.data;
                });

                $scope.save = function () {
                    $http.post(settings.apiUrl + '/categories', $scope.category).success(function (result) {
                        $scope.message = result;
                    });
                };
            }
        });
    }])
    .controller('UpdateCategoryCtrl', ['$scope', '$routeParams', '$http', 'settings', 'User', function ($scope, $routeParams, $http, settings, User) {

        $scope.isCreate=false;

        User.getLoginStatus(function (user) {
            if (user.isLoggedIn) {
                var name=$routeParams.name;
                $http.get(settings.apiUrl+'/categories/'+name).success(function(result){
                    $scope.category = {name: name,displayName:result.displayName};

                    $scope.save = function () {
                        $http.put(settings.apiUrl + '/categories', $scope.category).success(function (result) {
                            $scope.message = result;
                        });
                    };
                });
            }
        });
    }]);
