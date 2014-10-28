'use strict';

angular.module('myApp.cart', ['ngRoute'])

    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider.when('/cart', {
            templateUrl: 'cart/cart.html',
            controller: 'CartCtrl'
        })
    }])

    .factory('cart', [function () {
        var cart = {
            items: [],

            addProduct: function (product, quantity) {

                for (var i = 0; i < this.items.length; i++) {
                    var item = this.items[i];
                    if (item.product.code == product.code) {
                        item.quantity = item.quantity + quantity;
                        return;
                    }
                }

                this.items[this.items.length] = {product: product, quantity: quantity};
            },

            getTotalPrice: function () {

                var totalPrice = 0;

                for (var i = 0; i < this.items.length; i++) {
                    var item = this.items[i];
                    totalPrice += item.product.price * item.quantity;
                }

                return totalPrice;
            },

            load: function () {
                var cartItems = (localStorage != null) ? localStorage['myCartItems'] : null;
                if (cartItems != null) {
                    this.items = angular.fromJson(cartItems);
                }
            },

            save: function () {
                if (localStorage != null)
                    localStorage['myCartItems'] = angular.toJson(this.items);
            }
        };

        cart.load();

        return cart;
    }])

    .controller('CartCtrl', ['$scope', 'cart', function ($scope, cart) {

        $scope.cartItems = cart.items;
        $scope.totalPrice = function () {
            return cart.getTotalPrice();
        };
        $scope.save = function () {
            cart.save();
        };
    }]);
