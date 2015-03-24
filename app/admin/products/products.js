'use strict';

angular.module('myAdminApp.products', ['ngRoute', 'myApp.category', 'myApp.settings', 'myApp.user'])
    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider.when('/products', {
            templateUrl: 'products/products.html',
            controller: 'ProductsCtrl'
        });
    }])
    .controller('ProductsCtrl', ['$scope', '$http', '$location', 'categoryService', 'settings', 'User', function ($scope, $http, $location, categoryService, settings, User) {

        User.getLoginStatus(function(user){
            if(user.isLoggedIn) {
                categoryService.init(function(){
                    $scope.categories=categoryService.categoriesArray;
                    $scope.toggleCategory = function (categoryName) {
                        categoryService.toggleCategory(categoryName);
                    };
                    $scope.showProducts = function (categoryName) {
                        $http.get(settings.apiUrl + '/categories/'+categoryName+'/products').success(function (data) {
                            $scope.products = data.data;
                        });
                    };

                    $scope.createCategory=function(parentName) {
                        $location.path('/category/create').search('parentName',parentName);
                    };
                })
            }
        });
    }]);
