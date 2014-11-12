'use strict';



angular.module('myApp.home', ['ngRoute', 'myApp.settings', 'myApp.category', 'myApp.cart','facebook'])

    .config(['$routeProvider', 'FacebookProvider', function ($routeProvider, FacebookProvider) {
        $routeProvider.when('/home', {
            templateUrl: 'home/home.html',
            controller: 'HomeCtrl'

        })
            .when('/products/:categoryName', {
                templateUrl: 'home/home.html',
                controller: 'HomeCtrl'
            });

        FacebookProvider.init('131207310315568');
    }])

    .controller('HomeCtrl', ['$scope', '$http', '$routeParams', '$location', 'apiUrl','categoryService', 'cart', 'Facebook',
        function ($scope, $http, $routeParams, $location, apiUrl, categoryService, cart, Facebook) {

            var selectedCategoryName = $routeParams.categoryName;
            if (typeof selectedCategoryName == 'undefined')selectedCategoryName = 'lenovo_phones';

            categoryService.init(function () {
                categoryService.selectCategory(selectedCategoryName);
                $scope.categories = categoryService.categoriesArray;
            });

            var filter =  $location.search().filter;

            var propertyValues=[];
            if(typeof filter != 'undefined') {
                propertyValues=filter.split("-");
            }

            $http.post(apiUrl+'/products/' + selectedCategoryName + '.json',{"propertyValues":propertyValues}).success(function (data) {
                $scope.products = data.data;
            });

            $http.post(apiUrl+'/productsProperties/' + selectedCategoryName + '.json',{"propertyValues":propertyValues}).success(function (data) {
                $scope.selectedProperties=data.selectedProperties;
                $scope.productsProperties = data.data;
            });

            $scope.toggleCategory = function (categoryName) {
                categoryService.toggleCategory(categoryName);
            };

            $scope.showProducts = function (categoryName) {
                $location.path('/products/' + categoryName);
            };

            $scope.addFilter=function(propertyValueName) {
                var newFilter;

                if(typeof filter != 'undefined') {
                    newFilter=filter+"-"+propertyValueName;
                } else {
                    newFilter=propertyValueName;
                }

                $location.path('/products/'+selectedCategoryName).search("filter",newFilter);
            };

            $scope.addToCart=function(product) {
                cart.addProduct(product,1);
                cart.save();
            };

            $scope.login = function () {
                Facebook.login(function (fbResponse) {
                    alert(fbResponse.authResponse.userID);
                });
            };

            $scope.logout = function () {
                Facebook.logout(function (fbResponse) {
                    
                });
            };
        }]);