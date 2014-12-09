'use strict';

angular.module('myAdminApp.products', ['ngRoute', 'myApp.category', 'myApp.settings', 'myApp.user'])
    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider.when('/products', {
            templateUrl: 'products/products.html',
            controller: 'ProductsCtrl'
        });
    }])
    .controller('ProductsCtrl', ['$scope', 'categoryService', 'settings', 'User', function ($scope, categoryService, settings, User) {

        User.getLoginStatus(function(user){
            if(user.isLoggedIn) {
                categoryService.init(function(){
                    $scope.categories=categoryService.categoriesArray;
                })
            }
        });
    }]);
