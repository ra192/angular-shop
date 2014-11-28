'use strict';

function getLastPage(count, perPage) {
    var mod = count % perPage;
    if (mod == 0) {
        return count / perPage;
    } else {
        return (count - mod) / perPage + 1;
    }
}

function getPages(currentPage, lastPage, padding) {
    var start = currentPage - padding;
    var end = currentPage + padding;

    if (start < 1) {
        end = end - start + 1;
        start = 1;
    }

    if (end > lastPage) {
        start = start - (end - lastPage);
        if (start < 1)start = 1;
        end = lastPage;
    }

    var result = [];
    for (var i = start; i <= end; i++) {
        result.push(i);
    }

    return result;
}

angular.module('myApp.home', ['ngRoute', 'myApp.settings', 'myApp.category', 'myApp.cart', 'myApp.user'])

    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider.when('/home', {
            templateUrl: 'home/home.html',
            controller: 'HomeCtrl'

        })
            .when('/products/:categoryName', {
                templateUrl: 'home/home.html',
                controller: 'HomeCtrl'
            });
    }])

    .controller('HomeCtrl', ['$scope', '$http', '$routeParams', '$location', 'settings', 'categoryService', 'cart', 'User',
        function ($scope, $http, $routeParams, $location, settings, categoryService, cart, User) {

            var selectedCategoryName = $routeParams.categoryName;
            if (typeof selectedCategoryName == 'undefined')selectedCategoryName = 'lenovo_phones';

            categoryService.init(function () {
                categoryService.selectCategory(selectedCategoryName);
                $scope.categories = categoryService.categoriesArray;
            });

            var filter = $location.search().filter;

            var propertyValues = [];
            if (typeof filter != 'undefined') {
                propertyValues = filter.split("-");
            }

            var currentPage = $location.search().page;
            if (typeof currentPage == 'undefined')currentPage = 1;
            $scope.currentPage = currentPage;

            var order = $location.search().order;
            if (typeof order == 'undefined') order = "displayName";
            $scope.selectedOrder = order;

            var isAsc = $location.search().asc;
            if (typeof isAsc == 'undefined') isAsc = true;
            $scope.isAsc = isAsc;

            $http.post(settings.apiUrl + '/products/' + selectedCategoryName + '.json', {
                "propertyValues": propertyValues,
                "first": (currentPage - 1) * settings.productsPerPage,
                "max": settings.productsPerPage,
                "orderProperty": order,
                "isAsc": isAsc
            }).success(function (data) {
                $scope.products = data.data;
                $scope.pages = getPages(currentPage, getLastPage(data.count, settings.productsPerPage), 1);
            });

            $http.post(settings.apiUrl + '/productsProperties/' + selectedCategoryName + '.json', {"propertyValues": propertyValues}).success(function (data) {
                $scope.selectedProperties = data.selectedProperties.reduce(function (a, b) {
                    return a.concat(b.propertyValues);
                }, []);
                $scope.productsProperties = data.data;
            });

            $scope.toggleCategory = function (categoryName) {
                categoryService.toggleCategory(categoryName);
            };

            $scope.showProducts = function (categoryName) {
                $location.path('/products/' + categoryName).search("filter", null).search("page", null);
            };

            $scope.addFilter = function (propertyValueName) {
                var newFilter;

                if (typeof filter != 'undefined') {
                    newFilter = filter + "-" + propertyValueName;
                } else {
                    newFilter = propertyValueName;
                }

                $location.path('/products/' + selectedCategoryName).search("filter", newFilter).search("page", null);
            };

            $scope.delFilter = function (propertyValueName) {
                var newFilter;

                if (filter.lastIndexOf(propertyValueName, 0) == 0) {
                    newFilter = filter.replace(propertyValueName, "").replace("-", "");
                } else {
                    newFilter = filter.replace("-" + propertyValueName, "");
                }
                if (newFilter.length == 0) {
                    $location.path('/products/' + selectedCategoryName).search("filter", null).search("page", null);
                } else {
                    $location.path('/products/' + selectedCategoryName).search("filter", newFilter).search("page", null);
                }
            };

            $scope.showPage = function (page) {
                $location.path('/products/' + selectedCategoryName).search("page", page);
            };

            $scope.order = function (order, isAsc) {
                $location.path('/products/' + selectedCategoryName).search("order", order).search("asc", isAsc).search("page", null);
            };

            $scope.addToCart = function (product) {
                cart.addProduct(product, 1);
                cart.save();
            };

            User.getLoginStatus(function(user){
                if(user.isLoggedIn) {
                    $scope.isLoggedIn=true;
                } else {
                    $scope.isLoggedIn=false;
                }
            });

            $scope.login = function() {
                User.login(function(user){
                    if(user.isLoggedIn) {
                        $scope.isLoggedIn=true;
                    }
                });
            };

            $scope.logout = function() {
                User.logout(function(user) {
                   if(!user.isLoggedIn) {
                       $scope.isLoggedIn=false;
                   }
                });
            };
        }]);