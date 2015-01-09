'use strict';

angular.module('myAdminApp.category', ['ngRoute', 'myApp.settings', 'myApp.user'])
    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider.when('/category/create', {
            templateUrl: 'category/category.html',
            controller: 'CreateCategoryCtrl'
        });
    }])
    .controller('CreateCategoryCtrl', ['$scope', '$routeParams', '$http', 'settings', 'User', function ($scope, $routeParams, $http, settings, User) {

        User.getLoginStatus(function (user) {
            if (user.isLoggedIn) {
                $scope.category={parent:$routeParams.parent};

                $http.get(settings.apiUrl + '/properties.json').success(function (result) {
                    $scope.properties = result.data;
                });

                $scope.save=function(category) {
                    $http.post(settings.apiUrl+'/categories/create.json',$scope.category).success(function(result) {
                        $scope.message=result;
                    });
                };
            }
        });
    }]);
