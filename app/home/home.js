'use strict';

angular.module('myApp.home', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/home', {
    templateUrl: 'home/home.html',
    controller: 'HomeCtrl'
  });
}])

.controller('HomeCtrl', ['$scope','$http',function($scope,$http) {

    var findCategoryByName=function(categoryName,categoriesArray) {
        for(var i=0;i<categoriesArray.length;i++) {
            if(categoriesArray[i].name==categoryName) return categoriesArray[i];
            var category=findCategoryByName(categoryName,categoriesArray[i].children);
            if(category!=null) return category;
        }

        return null;
    }

    $http.get('http://localhost:8081/categories.json').success(function(data){
        $scope.categories=data.data;
    });

    $http.get('http://localhost:8081/products/lenovo_phones.json').success(function(data){
       $scope.products=data.data;
    });

    $scope.toggleCategory=function(categoryName) {

        var category=findCategoryByName(categoryName,$scope.categories);

        category.selected=!category.selected;

        $http.get('http://localhost:8081/products/'+categoryName+'.json').success(function(data){
            $scope.products=data.data;
        });
    };
}]);