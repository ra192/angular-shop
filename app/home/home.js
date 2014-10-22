'use strict';

angular.module('myApp.home', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/home', {
    templateUrl: 'home/home.html',
    controller: 'HomeCtrl'
  });
}])

.controller('HomeCtrl', ['$scope','$http',function($scope,$http) {
    $http.get('http://localhost:8081/categories.json').success(function(data){
        $scope.categories=data.data;
    });
    $http.get('http://localhost:8081/products/lenovo_phones.json').success(function(data){
       $scope.products=data.data;
    });
    $scope.showProducts=function(categoryName) {
        $http.get('http://localhost:8081/products/'+categoryName+'.json').success(function(data){
            $scope.products=data.data;
        });
    };
}]);