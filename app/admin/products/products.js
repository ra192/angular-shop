'use strict';

angular.module('myAdminApp.products', ['ngRoute', 'myApp.category', 'myApp.settings', 'myApp.user'])
    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider.when('/products', {
            templateUrl: 'products/products.html',
            controller: 'ProductsCtrl'
        });
    }])
    .controller('ProductsCtrl', ['$scope', '$location', '$http', 'categoryService', 'settings', 'User', function ($scope,$location, $http, categoryService, settings, User) {

        User.getLoginStatus(function(user){
            if(user.isLoggedIn) {
                categoryService.init(function(){
                    $scope.categories=categoryService.categoriesArray;

                    $scope.toggleCategory=function(categoryName){categoryService.toggleCategory(categoryName);};

                    $scope.showProducts=function(categoryName){
                        categoryService.selectCategory(categoryName);

                        $http.post(settings.apiUrl + '/products/' + categoryName + '.json', {}).success(function (data) {
                            $scope.products = data.data;
                        });
                    };

                    $scope.createCategory=function(parent) {
                        $location.path('/category/create').search("parent", parent);
                    };
                    $scope.updateCategory=function(name) {
                        $location.path('/category/update').search("name", name);
                    };
                })
            }
        });
    }]);
