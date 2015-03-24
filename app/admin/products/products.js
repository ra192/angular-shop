'use strict';

angular.module('myAdminApp.products', ['ngRoute', 'myApp.category', 'myApp.settings', 'myApp.user'])
    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider.when('/products', {
            templateUrl: 'products/products.html',
            controller: 'ProductsCtrl'
        })
            .when('/product/create', {
                templateUrl: 'products/product.html',
                controller: 'CreateProductCtrl'
            })
            .when('/product/update', {
                templateUrl: 'products/product.html',
                controller: 'UpdateProductCtrl'
            });
    }])
    .controller('ProductsCtrl', ['$scope', '$location', '$http', 'categoryService', 'settings', 'User', function ($scope, $location, $http, categoryService, settings, User) {

        User.getLoginStatus(function (user) {
            if (user.isLoggedIn) {
                categoryService.init(function () {
                    $scope.categories = categoryService.categoriesArray;

                    $scope.toggleCategory = function (categoryName) {
                        categoryService.toggleCategory(categoryName);
                    };

                    $scope.showProducts = function (categoryName) {
                        categoryService.selectCategory(categoryName);

                        $http.get(settings.apiUrl + '/categories' + categoryName + '/products').success(function (data) {
                            $scope.products = data.data;
                        });

                        $scope.selectedCategoryName=categoryName;
                    };

                    $scope.createCategory = function (parent) {
                        $location.path('/category/create').search("parent", parent);
                    };
                    $scope.updateCategory = function (name) {
                        $location.path('/category/update').search("name", name);
                    };

                    $scope.createProduct=function(){
                        $location.path('/product/create').search("category", $scope.selectedCategoryName);
                    };

                    $scope.updateProduct=function(code){
                        $location.path('/product/update').search("code", code);
                    };
                })
            }
        });
    }])
    .controller('CreateProductCtrl', ['$scope', '$routeParams', '$http', 'settings', 'User', function ($scope, $routeParams, $http, settings, User) {
        User.getLoginStatus(function (user) {
            if (user.isLoggedIn) {
                $scope.isCreate=true;
                $scope.product = {category: $routeParams.category,propertyValues:[]};

                $http.get(settings.apiUrl + '/categories/' + $routeParams.category).success(function (category) {
                    $scope.properties = [];
                    for (var i = 0; i < category.properties.length; i++) {
                        $http.get(settings.apiUrl + '/properties/' + category.properties[i]).success(function (property) {
                            $scope.properties.push(property);
                        });
                    }
                });

                $scope.save = function () {
                    $http.post(settings.apiUrl + '/products', $scope.product).success(function (result) {
                        $scope.message = result;
                    });
                };
            }
        });
    }])
    .controller('UpdateProductCtrl', ['$scope', '$routeParams', '$http', 'settings', 'User', function ($scope, $routeParams, $http, settings, User) {
        User.getLoginStatus(function (user) {
            if (user.isLoggedIn) {
                $http.get(settings.apiUrl+'/products/'+$routeParams.code).success(function(product){
                    $scope.product=product;

                    $http.get(settings.apiUrl + '/categories/' + product.category).success(function (category) {
                        $scope.properties = [];
                        for (var i = 0; i < category.properties.length; i++) {
                            $http.get(settings.apiUrl + '/properties/' + category.properties[i]).success(function (property) {
                                for(var i=0;i<property.propertyValues.length;i++) {
                                    var ind=product.propertyValues.indexOf(property.propertyValues[i].name);
                                    if(ind>-1) {
                                        $scope.properties[ind]=property;
                                        break;
                                    }
                                }
                            });
                        }
                    });
                });

                $scope.save = function () {
                    $http.put(settings.apiUrl + '/products', $scope.product).success(function (result) {
                        $scope.message = result;
                    });
                };
            }
        });
    }]);
