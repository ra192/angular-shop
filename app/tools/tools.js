'use strict';

angular.module('myApp.tools', ['ngRoute', 'myApp.settings', 'angularFileUpload', 'facebook'])

    .config(['$routeProvider', 'FacebookProvider', function ($routeProvider, FacebookProvider) {
        $routeProvider.when('/tools', {
            templateUrl: 'tools/tools.html',
            controller: 'ToolsCtrl'
        });

        FacebookProvider.init('131207310315568');
    }])

    .controller('ToolsCtrl', ['$scope', 'apiUrl', 'FileUploader', 'Facebook', function ($scope, apiUrl, FileUploader, Facebook) {

        Facebook.getLoginStatus(function (response) {
            if (response.status === 'connected') {
                $scope.uploader.headers.accessToken=response.authResponse.accessToken;
            }
        });

        $scope.uploader = new FileUploader({
            url: apiUrl + '/tools/import.json'
        });

        $scope.upload = function () {
            $scope.uploader.uploadItem(0);
        };
    }]);