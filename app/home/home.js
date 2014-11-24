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

angular.module('myApp.home', ['ngRoute', 'myApp.settings', 'myApp.category', 'myApp.cart', 'facebook'])

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

    .controller('HomeCtrl', ['$scope', '$http', '$routeParams', '$location', 'apiUrl', 'productsPerPage',
        'categoryService', 'cart', 'Facebook',
        function ($scope, $http, $routeParams, $location, apiUrl, productsPerPage, categoryService, cart, Facebook) {

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

            $http.post(apiUrl + '/products/' + selectedCategoryName + '.json', {
                "propertyValues": propertyValues,
                "first": (currentPage - 1) * productsPerPage,
                "max": productsPerPage,
                "orderProperty": order,
                "isAsc": isAsc
            }).success(function (data) {
                $scope.products = data.data;
                $scope.pages = getPages(currentPage, getLastPage(data.count, productsPerPage), 1);
            });

            $http.post(apiUrl + '/productsProperties/' + selectedCategoryName + '.json', {"propertyValues": propertyValues}).success(function (data) {
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

            $scope.isLoggedIn = false;
            Facebook.getLoginStatus(function (fbResponse) {
                if (fbResponse.status === 'connected') {
                    $scope.isLoggedIn = true;

                    $http.post(apiUrl + '/users/add.json', {
                        "userID": fbResponse.authResponse.userID,
                        "accessToken": fbResponse.authResponse.accessToken,
                        "expiresIn": fbResponse.authResponse.expiresIn
                    });
                }
            });

            $scope.login = function () {
                Facebook.login(function (fbResponse) {
                    if (fbResponse.status === 'connected') {
                        $scope.isLoggedIn = true;

                        $http.post(apiUrl + '/users/add.json', {
                            "userID": fbResponse.authResponse.userID,
                            "accessToken": fbResponse.authResponse.accessToken,
                            "expiresIn": fbResponse.authResponse.expiresIn
                        });
                    }
                });
            };

            $scope.logout = function () {
                Facebook.logout(function (fbResponse) {
                    $scope.isLoggedIn = false;
                });
            };
        }]);