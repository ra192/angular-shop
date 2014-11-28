'use strict';

angular.module('myApp.tools', ['ngRoute', 'angularFileUpload', 'myApp.settings', 'myApp.user'])

    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider.when('/tools', {
            templateUrl: 'tools/tools.html',
            controller: 'ToolsCtrl'
        });
    }])

    .controller('ToolsCtrl', ['$scope', '$http', 'settings', 'FileUploader', 'User', function ($scope, $http, settings, FileUploader, User) {

        User.getLoginStatus(function(user){
            if(user.isLoggedIn) {
                $scope.uploader.headers.accessToken=user.accessToken;
            }
        });

        $scope.uploader = new FileUploader({
            url: settings.apiUrl + '/tools/import.json'
        });

        $scope.upload = function () {
            $scope.uploader.uploadItem(0);
        };
    }]);