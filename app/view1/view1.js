'use strict';

angular.module('myApp.view1', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/view1', {
    templateUrl: 'view1/view1.html',
    controller: 'View1Ctrl'
  });
}])

.controller('View1Ctrl', ['$scope','$http',function($scope,$http) {
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