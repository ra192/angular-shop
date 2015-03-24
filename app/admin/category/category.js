'use strict';

angular.module('myAdminApp.category',['ngRoute','myApp.settings','myApp.user'])
    .config(['$routeProvider', function($routeProvider) {
        $routeProvider.when('/category/create',{
            templateUrl:'category/category.html',
            controller:'CreateCategoryCtrl'
        })
    }])
    .controller('CreateCategoryCtrl',['$scope','$http','$location','settings','User', function($scope,$http,$location,settings,User){
        User.getLoginStatus(function(user){
            if(user.isLoggedIn) {
                var parentName=$location.search().parentName;
                $scope.category={parent:parentName};
                $http.get(settings.apiUrl+'/properties').success(function(result){
                   $scope.properties=result.data;
                });
                $scope.save=function(category) {
                    $http.post(settings.apiUrl+'/categories',category,{
                        headers: {accessToken:user.accessToken}
                    }).success(function(result){
                        $scope.result=result;
                    });
                };
            }
        });
    }]);
