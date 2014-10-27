'use strict';

function CategoryService(categoriesArray) {

    var findCategoryByName = function (categoryName, categoriesArray) {
        for (var i = 0; i < categoriesArray.length; i++) {
            if (categoriesArray[i].name == categoryName) return categoriesArray[i];
            var category = findCategoryByName(categoryName, categoriesArray[i].children);
            if (category != null) return category;
        }

        return null;
    };

    var selectCategory = function (categoryName, categoriesArray) {
        for (var i = 0; i < categoriesArray.length; i++) {
            if (categoriesArray[i].name == categoryName)
                categoriesArray[i].selected = true;
            else
                categoriesArray[i].selected = false;

            selectCategory(categoryName, categoriesArray[i].children);
        }
    };

    this.categoriesArray = categoriesArray;

    this.findCategoryByName = function (categoryName) {
        return findCategoryByName(categoryName, this.categoriesArray);
    };

    this.selectCategory = function (categoryName) {
        selectCategory(categoryName, this.categoriesArray);
    };

    this.toggleCategory = function (categoryName) {

        var category = this.findCategoryByName(categoryName);

        category.expanded = !category.expanded;
    };
}

angular.module('myApp.home', ['ngRoute', 'facebook'])

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

    .factory('categoryService', ['$http', function ($http) {

        var categoryService = new CategoryService([]);

        categoryService.init = function (callback) {
            if (categoryService.categoriesArray.length == 0) {
                $http.get('http://localhost:8081/categories.json').success(function (data) {
                    categoryService.categoriesArray = data.data;
                    callback();
                });
            }
            else
                callback();
        };

        return categoryService;
    }])

    .controller('HomeCtrl', ['$scope', '$http', '$routeParams', '$location', 'categoryService', 'Facebook',
        function ($scope, $http, $routeParams, $location, categoryService, Facebook) {

            var selectedCategoryName = $routeParams.categoryName;
            if (typeof selectedCategoryName == 'undefined')selectedCategoryName = 'lenovo_phones';

            categoryService.init(function () {
                categoryService.selectCategory(selectedCategoryName);
                $scope.categories = categoryService.categoriesArray;
            });

            $http.get('http://localhost:8081/products/' + selectedCategoryName + '.json').success(function (data) {
                $scope.products = data.data;
            });

            $scope.toggleCategory = function (categoryName) {
                categoryService.toggleCategory(categoryName);
            };

            $scope.showProducts = function (categoryName) {

                $location.path('/products/' + categoryName);
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