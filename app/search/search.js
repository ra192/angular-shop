'use strict';

angular.module('myApp.search',['ngRoute','myApp.settings'])
    .config(['$routeProvider',function($routeProvider){
        $routeProvider.when('/search',{
            templateUrl:'search/search.html',
            controller:'SearchCtrl'
        })
    }])
    .controller('SearchCtrl',['$scope','$location','$http','settings',function($scope,$location,$http,settings){
        $http.get(settings.apiUrl+'/search',{params:{q:$location.search().q}}).success(function(data){
            $scope.products=data.data;
        })
    }]);