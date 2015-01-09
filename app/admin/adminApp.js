'use strict';

// Declare app level module which depends on views, and components
angular.module('myAdminApp', [
    'ngRoute',
    'myAdminApp.products',
    'myAdminApp.category',
    'myAdminApp.tools'
]).
    config(['$routeProvider', function($routeProvider) {
        $routeProvider.otherwise({redirectTo: '/products'});
    }])
;
